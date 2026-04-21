import { Injectable } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { ImageImportResponseDTO } from './sven.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    'Return ONLY valid JSON in this exact format:\n' +
    '[\n' +
    '  {\n' +
    '    "id": "string",\n' +
    '    "index": 0,\n' +
    '    "term": "string",\n' +
    '    "definition": "string"\n' +
    '  }\n' +
    ']';

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  // IMPORT naar gemini sturen -------------------------------------------------

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
        },
      ];
    }

    const flat = (
      await Promise.all(files.map((file) => this.uploadImage(file)))
    ).flat();

    return flat;
  }

  // UPLOAD images uploaden -------------------------------------------------

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<ImageImportResponseDTO[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imagePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    const result = await model.generateContent([this.prompt, imagePart]);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }
}
