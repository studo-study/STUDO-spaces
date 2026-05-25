import { Injectable } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { ImageImportResponseDTO } from './sven.dto';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

@Injectable()
export class SvenService {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  prompt =
    'Extract all terms and their definitions from this image.\n' +
    'Rules:\n' +
    '- Each term has a corresponding definition\n' +
    '- Keep definitions complete (can be multiple sentences)\n' +
    '- Preserve order from top to bottom\n' +
    '- Do NOT merge multiple terms\n' +
    '- Do NOT invent content\n' +
    '- If the term is a mathematical formula, set term_content_type to "latex" ' +
    'and put the LaTeX in the term field WITHOUT $$ or $ delimiters (e.g. ' +
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a})\n' +
    '- If the term is source code, set term_content_type to "code" ' +
    'and put the code in the term field\n' +
    '- The definition is always plain text, never latex or code\n' +
    '- The default term_content_type is "text"- Read the card naturally: the label/name is the term, the explanation is the definition\n' +
    '- If either side is a mathematical formula, set special_content_type to "latex" and special_side to whichever side ("term" or "definition") contains the formula\n' +
    '- If either side is source code, set special_content_type to "code" and special_side accordingly\n' +
    '- Write latex WITHOUT $$ or $ delimiters\n' +
    '- Otherwise special_content_type is "text" and special_side is "none"';

  responseSchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        term: { type: SchemaType.STRING },
        definition: { type: SchemaType.STRING },
        special_content_type: {
          type: SchemaType.STRING,
          enum: ['text', 'latex', 'code'],
        },
        special_side: {
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
  ) {}

  async import(
    files: Express.Multer.File[],
  ): Promise<ImageImportResponseDTO[]> {
    if (!files || files.length === 0) {
      return [
        {
          id: crypto.randomUUID(),
          index: 0,
          term: '',
          definition: '',
          image: '',
          isDouble: false,
          special_content_type: 'text',
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
      special_content_type: 'text' | 'latex' | 'code';
      special_side: 'none' | 'term' | 'definition';
    };
    const parsed = JSON.parse(result.response.text()) as GeminiCard[];

    return parsed.map((card, i) => {
      let { term, definition } = card;
      const contentType = card.special_content_type;

      if (card.special_side === 'definition' && contentType !== 'text') {
        [term, definition] = [definition, term];
      }

      return {
        id: crypto.randomUUID(),
        index: i,
        term: this.stripMathDelimiters(term),
        definition,
        image: '',
        isDouble: false,
        special_content_type: contentType,
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
