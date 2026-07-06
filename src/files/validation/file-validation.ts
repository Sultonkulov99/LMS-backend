import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { mbToBytes } from '../../utils/units';
import { ValidateFileOptions } from '../../types/files';

export function validateFile(options: ValidateFileOptions): ParseFilePipe {
  const mimeTypes: Record<ValidateFileOptions['type'], RegExp> = {
    image: /(png|jpg|jpeg)$/g,
    video: /(avi|mp4|mpeg|mov|wmv)$/g,
  };
  const validators: Array<MaxFileSizeValidator | FileTypeValidator> = [
    new MaxFileSizeValidator({ maxSize: mbToBytes(options.size) }),
  ];
  if (options?.type) {
    validators.push(
      new FileTypeValidator({ fileType: mimeTypes[options.type] }),
    );
  }
  return new ParseFilePipe({
    fileIsRequired: options?.required,
    validators,
  });
}
