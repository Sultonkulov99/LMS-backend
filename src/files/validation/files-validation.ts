import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidateFileOptions, ValidateFilesOptions } from '../../types/files';

@Injectable()
export class FilesValidation implements PipeTransform {
  private readonly options: ValidateFilesOptions;

  private readonly mimeTypes: Record<ValidateFileOptions['type'], RegExp> = {
    image: /(png|jpg|jpeg)$/,
    video: /(avi|mp4|mpeg|mov|wmv)$/,
  };

  constructor(options: ValidateFilesOptions) {
    this.options = options;
  }

  private validateFiles(files: Array<Express.Multer.File>) {
    for (const file of files) {
      const validation = this.options?.[file.fieldname];
      if (validation?.type) {
        const mime = file.mimetype.split('/')[1];
        const mimeRegex = this.mimeTypes[validation.type];
        if (!mimeRegex.test(mime)) {
          throw new HttpException(
            `Invalid file type! Only ${validation.type} files are allowed`,
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );
        }
      }
    }
  }

  transform(value: Record<string, Array<Express.Multer.File>>) {
    for (const fieldName of Object.keys(value)) {
      const files: Array<Express.Multer.File> = [...value?.[fieldName]];
      if (this.options?.[fieldName]?.required && !files?.length) {
        throw new HttpException(
          `The field ${fieldName} should contain at least one file`,
          HttpStatus.LENGTH_REQUIRED,
        );
      }
      this.validateFiles(files);
    }
    return value;
  }
}
