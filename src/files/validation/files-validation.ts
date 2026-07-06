import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidateFileOptions, ValidateFilesOptions } from '../../types/files';
import { mbToBytes } from '../../utils/units';

@Injectable()
export class FilesValidation implements PipeTransform {
  private readonly options: ValidateFilesOptions;

  private readonly mimeTypes: Record<ValidateFileOptions['type'], RegExp> = {
    image: /(png|jpg|jpeg)$/g,
    video: /(avi|mp4|mpeg|mov|wmv)$/g,
  };

  constructor(options: ValidateFilesOptions) {
    this.options = options;
  }

  private validateFiles(files: Array<Express.Multer.File>) {
    for (const file of files) {
      const validation = this.options?.[file.fieldname];
      if (validation) {
        if (validation?.type) {
          const mime = file.mimetype.split('/')[1];
          const mimeRegex = this.mimeTypes[validation.type];
          if (!mimeRegex.test(mime)) {
            throw new HttpException(
              `Invalid file type! Only ${mimeRegex} allowed`,
              HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            );
          }
        }
        if (file.size > mbToBytes(validation.size)) {
          throw new HttpException(
            `File size should be less than ${mbToBytes(validation.size)} bytes`,
            HttpStatus.PAYLOAD_TOO_LARGE,
          );
        }
      }
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
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
