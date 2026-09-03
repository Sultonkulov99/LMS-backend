// import {
//   PipeTransform,
//   Injectable,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import sharp from 'sharp';
// import { ValidateFileOptions, ValidateFilesOptions } from '../../types/files';

// @Injectable()
// export class FilesValidation implements PipeTransform {
//   private readonly options: ValidateFilesOptions;

//   private readonly mimeTypes: Record<ValidateFileOptions['type'], RegExp> = {
//     image: /(png|jpg|jpeg)$/,
//     video: /(avi|mp4|mpeg|mov|wmv|quicktime|x-msvideo|x-ms-wmv)$/,
//   };

//   constructor(options: ValidateFilesOptions) {
//     this.options = options;
//   }

//   // Agar fayl rasm turi bo'lib, lekin PNG/JPG/JPEG bo'lmasa (masalan HEIC,
//   // WEBP, AVIF) — sharp yordamida avtomatik PNG'ga aylantiramiz. Shu orqali
//   // qaysi formatda yuklansa ham backend uni qabul qila oladi.
//   private async convertImageIfNeeded(
//     file: Express.Multer.File,
//     type: ValidateFileOptions['type'],
//   ): Promise<void> {
//     if (type !== 'image') return;

//     const mime = file.mimetype.split('/')[1];
//     const mimeRegex = this.mimeTypes.image;
//     if (mimeRegex.test(mime)) return; // allaqachon qo'llab-quvvatlanadigan format

//     try {
//       const pngBuffer = await sharp(file.buffer).png().toBuffer();
//       file.buffer = pngBuffer;
//       file.mimetype = 'image/png';
//       file.size = pngBuffer.length;
//       file.originalname = file.originalname.replace(/\.[^.]+$/, '') + '.png';
//     } catch {
//       throw new HttpException(
//         `"${file.originalname}" faylini qayta ishlab bo'lmadi. Bu fayl haqiqiy rasm ekanini tekshiring.`,
//         HttpStatus.UNSUPPORTED_MEDIA_TYPE,
//       );
//     }
//   }

//   private async validateFiles(
//     fieldName: string,
//     files: Array<Express.Multer.File>,
//   ) {
//     const validation = this.options?.[fieldName];
//     if (!validation?.type) return;

//     for (const file of files) {
//       await this.convertImageIfNeeded(file, validation.type);

//       const mime = file.mimetype.split('/')[1];
//       const mimeRegex = this.mimeTypes[validation.type];
//       if (!mimeRegex.test(mime)) {
//         throw new HttpException(
//           `Invalid file type for "${fieldName}"! Only ${validation.type} files are allowed`,
//           HttpStatus.UNSUPPORTED_MEDIA_TYPE,
//         );
//       }
//     }
//   }

//   async transform(value: Record<string, Array<Express.Multer.File>>) {
//     for (const fieldName of Object.keys(value)) {
//       const files: Array<Express.Multer.File> = [...(value?.[fieldName] ?? [])];
//       if (this.options?.[fieldName]?.required && !files?.length) {
//         throw new HttpException(
//           `The field ${fieldName} should contain at least one file`,
//           HttpStatus.LENGTH_REQUIRED,
//         );
//       }
//       await this.validateFiles(fieldName, files);
//     }
//     return value;
//   }

  
// }

import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import sharp from 'sharp';
import { ValidateFileOptions, ValidateFilesOptions } from '../../types/files';

@Injectable()
export class FilesValidation implements PipeTransform {
  private readonly options: ValidateFilesOptions;

  private readonly mimeTypes: Record<ValidateFileOptions['type'], RegExp> = {
    image: /(png|jpg|jpeg)$/,
    video: /(avi|mp4|mpeg|mov|wmv|quicktime|x-msvideo|x-ms-wmv)$/,
  };

  constructor(options: ValidateFilesOptions) {
    this.options = options;
  }

  // Agar fayl rasm turi bo'lib, lekin PNG/JPG/JPEG bo'lmasa (masalan HEIC,
  // WEBP, AVIF) — sharp yordamida avtomatik PNG'ga aylantiramiz. Shu orqali
  // qaysi formatda yuklansa ham backend uni qabul qila oladi.
  private async convertImageIfNeeded(
    file: Express.Multer.File,
    type: ValidateFileOptions['type'],
  ): Promise<void> {
    if (type !== 'image') return;

    const mime = file.mimetype.split('/')[1];
    const mimeRegex = this.mimeTypes.image;
    if (mimeRegex.test(mime)) return; // allaqachon qo'llab-quvvatlanadigan format

    try {
      const pngBuffer = await sharp(file.buffer).png().toBuffer();
      file.buffer = pngBuffer;
      file.mimetype = 'image/png';
      file.size = pngBuffer.length;
      file.originalname = file.originalname.replace(/\.[^.]+$/, '') + '.png';
    } catch {
      throw new HttpException(
        `"${file.originalname}" faylini qayta ishlab bo'lmadi. Bu fayl haqiqiy rasm ekanini tekshiring.`,
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }

  private async validateFiles(
    fieldName: string,
    files: Array<Express.Multer.File>,
  ) {
    const validation = this.options?.[fieldName];
    if (!validation?.type) return;

    for (const file of files) {
      await this.convertImageIfNeeded(file, validation.type);

      const mime = file.mimetype.split('/')[1];
      const mimeRegex = this.mimeTypes[validation.type];
      if (!mimeRegex.test(mime)) {
        throw new HttpException(
          `Invalid file type for "${fieldName}"! Only ${validation.type} files are allowed`,
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    }
  }

  async transform(value: Record<string, Array<Express.Multer.File>>) {
    // JSON so'rovlarda (multipart bo'lmaganda) Multer req.files'ni
    // umuman o'rnatmaydi — shuning uchun `value` bu yerda `undefined`
    // bo'lib keladi. Buni bo'sh obyektga aylantirmasak,
    // `Object.keys(undefined)` xato tashlaydi va bu 500 Internal
    // Server Error sifatida chiqadi.
    value = value ?? {};

    // `value`ning emas, `this.options`ning kalitlari bo'yicha aylanamiz —
    // shunda "required: true" bo'lgan, lekin so'rovda umuman
    // yuborilmagan maydonlar ham to'g'ri aniqlanadi va xato tashlanadi.
    for (const fieldName of Object.keys(this.options ?? {})) {
      const files: Array<Express.Multer.File> = [
        ...(value?.[fieldName] ?? []),
      ];
      if (this.options?.[fieldName]?.required && !files?.length) {
        throw new HttpException(
          `The field ${fieldName} should contain at least one file`,
          HttpStatus.LENGTH_REQUIRED,
        );
      }
      await this.validateFiles(fieldName, files);
    }
    return value;
  }
}