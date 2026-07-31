import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { ImageImportResponseDTO } from './sven.dto';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';

@Injectable()
export class SvenService {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  prompt =
    'Extract all terms and their definitions from this image.\n' +
    '\n' +
    'Rules:\n' +
    '- Each term has exactly one corresponding definition.\n' +
    '- Keep definitions complete (they may contain multiple sentences).\n' +
    '- Preserve the order from top to bottom.\n' +
    '- Do NOT merge multiple terms.\n' +
    '- Do NOT invent content.\n' +
    '- Read the card naturally: the label/name is the term, the explanation is the definition.\n' +
    '\n' +
    'Content types:\n' +
    '- term_content_type: "text" | "latex" | "code"\n' +
    '- special_content_type: "text" | "latex" | "code"\n' +
    '- special_side: "term" | "definition" | "none"\n' +
    '\n' +
    'LaTeX rules:\n' +
    '- Use term_content_type="latex" ONLY when the entire term is a mathematical expression.\n' +
    '- When term_content_type="latex", the term field MUST contain ONLY valid LaTeX.\n' +
    '- The term field MUST NOT contain any explanatory text, labels, units, punctuation, or natural language when term_content_type="latex".\n' +
    '- Do NOT wrap LaTeX in $, $$, \\( \\), or \\[ \\].\n' +
    '- Examples of valid latex terms:\n' +
    '  - x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n' +
    '  - \\int_0^1 x^2\\,dx\n' +
    '  - E = mc^2\n' +
    '- Examples of INVALID latex terms:\n' +
    '  - Formula: E = mc^2\n' +
    '  - The equation E = mc^2\n' +
    '  - E = mc^2 where E is energy\n' +
    '\n' +
    'Code rules:\n' +
    '- Use term_content_type="code" ONLY when the entire term is source code.\n' +
    '- When term_content_type="code", the term field MUST contain ONLY code.\n' +
    '\n' +
    'Definition rules:\n' +
    '- Definitions must always be plain natural language text.\n' +
    '- Definitions must NEVER contain LaTeX.\n' +
    '- Definitions must NEVER contain source code.\n' +
    '- If the original definition contains a formula, rewrite the formula as plain text if possible.\n' +
    '- If a definition is primarily a formula, move the formula to the side indicated by special_side and keep the definition text-only.\n' +
    '\n' +
    'Special content detection:\n' +
    '- If the term contains a mathematical formula, set special_content_type="latex" and special_side="term".\n' +
    '- If the definition contains a mathematical formula, set special_content_type="latex" and special_side="definition".\n' +
    '- If the term contains source code, set special_content_type="code" and special_side="term".\n' +
    '- If the definition contains source code, set special_content_type="code" and special_side="definition".\n' +
    '- Otherwise set special_content_type="text" and special_side="none".';

  responseSchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        term: { type: SchemaType.STRING },
        definition: { type: SchemaType.STRING },
        specialContentType: {
          type: SchemaType.STRING,
          enum: ['text', 'latex', 'code'],
        },
        specialSide: {
          type: SchemaType.STRING,
          enum: ['none', 'term', 'definition'],
        },
      },
      required: ['term', 'definition', 'special_content_type', 'special_side'],
    },
  };

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private getDailyImportKey(userId: string): string {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return `sven:import:${userId}:${date}`;
  }

  private secondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
  }

  async checkAndIncrementDailyImport(userId: string): Promise<void> {
    const key = this.getDailyImportKey(userId);
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, this.secondsUntilMidnight());
    }
    if (count > 3) {
      throw new BadRequestException('rate_limit');
    }
  }

  async import(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<ImageImportResponseDTO[]> {
    await this.checkAndIncrementDailyImport(userId);

    if (!files || files.length === 0) {
      return [
        {
          id: crypto.randomUUID(),
          index: 0,
          term: '',
          definition: '',
          image: '',
          isDouble: false,
          specialContentType: 'text',
        },
      ];
    }

    const flat = (
      await Promise.all(files.map((file) => this.uploadImage(file)))
    ).flat();

    return flat;
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<ImageImportResponseDTO[]> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        // @ts-expect-error responseSchema typing lags behind the API
        responseSchema: this.responseSchema,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const imagePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    const result = await model.generateContent([this.prompt, imagePart]);
    type GeminiCard = {
      term: string;
      definition: string;
      specialContentType: 'text' | 'latex' | 'code';
      specialSide: 'none' | 'term' | 'definition';
    };
    const parsed = JSON.parse(result.response.text()) as GeminiCard[];

    return parsed.map((card, i) => {
      let { term, definition } = card;
      const contentType = card.specialContentType;

      if (card.specialSide === 'definition' && contentType !== 'text') {
        [term, definition] = [definition, term];
      }

      return {
        id: crypto.randomUUID(),
        index: i,
        term: this.stripMathDelimiters(term).slice(0, 500),
        definition: definition.slice(0, 500),
        image: '',
        isDouble: false,
        specialContentType: contentType,
      };
    });
  }

  private stripMathDelimiters(value: string): string {
    return value
      .trim()
      .replace(/^\${1,2}/, '')
      .replace(/\${1,2}$/, '')
      .replace(/^\\\[|\\\]$/g, '')
      .replace(/^\\\(|\\\)$/g, '')
      .trim();
  }
}
