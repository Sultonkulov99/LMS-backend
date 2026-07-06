declare module 'fluent-ffmpeg' {
  const ffmpeg: any;
  export = ffmpeg;
}

import '@nestjs/swagger';
declare module '@nestjs/swagger' {
  export function ApiProperty(options?: any): PropertyDecorator;
  export function ApiPropertyOptional(options?: any): PropertyDecorator;
  export function ApiResponseProperty(options?: any): PropertyDecorator;
}
