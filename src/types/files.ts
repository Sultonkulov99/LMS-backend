export enum EFileType {
  PUBLIC_FILE,
  COURSE_VIDEO,
  COURSE_CONTENT,
}

export interface ValidateFileOptions {
  size: number;
  type?: 'image' | 'video';
  required?: boolean;
}

export type ValidateFilesOptions = Record<
  Express.Multer.File['fieldname'],
  ValidateFileOptions
>;
