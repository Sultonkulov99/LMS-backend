import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { EFileType } from '../types/files';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { CourseVideoParamsDto } from './dto/course-video-params.dto';

@Injectable()
export class FilesService {
  private readonly _uploads = path.join(process.cwd(), 'uploads');
  getFileDir(type: EFileType) {
    switch (type) {
      case EFileType.PUBLIC_FILE:
        return path.join(this._uploads, 'public');
      case EFileType.COURSE_VIDEO:
        return path.join(this._uploads, 'private', 'videos');
      case EFileType.COURSE_CONTENT:
        return path.join(this._uploads, 'private', 'files');
    }
  }

  private prefixes: Record<EFileType, string> = {
    [EFileType.PUBLIC_FILE]: 'pbf',
    [EFileType.COURSE_VIDEO]: 'pcvi',
    [EFileType.COURSE_CONTENT]: 'pccf',
  };

  private generateFileName(file: Express.Multer.File, type: EFileType) {
    const ext = file.originalname.split('.').at(-1);
    const uuid = randomUUID();
    return `${this.prefixes[type]}_${uuid}.${ext}`;
  }

  public saveFile(
    file: Express.Multer.File,
    type: EFileType,
    _fileName?: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = _fileName || this.generateFileName(file, type);
      fs.writeFile(
        path.join(this.getFileDir(type), fileName),
        file.buffer,
        null,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(fileName);
          }
        },
      );
    });
  }

  public deleteLessonVideos(id: string) {
    const lessonVidDes = path.join(this.getFileDir(EFileType.COURSE_VIDEO), id);
    fs.rmSync(lessonVidDes, {
      force: true,
      recursive: true,
    });
  }

  public saveLessonVideo(file: Express.Multer.File, lessonId: string) {
    return new Promise(async (resolve, reject) => {
      const videoDir = path.join(
        this.getFileDir(EFileType.COURSE_VIDEO),
        lessonId,
      );
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir);
      }
      let fileName = await this.saveFile(
        file,
        EFileType.COURSE_VIDEO,
        path.join(lessonId, `original.${file.originalname.split('.').at(-1)}`),
      );
      fileName = fileName.split('/')[1];
      ffmpeg(path.join(videoDir, fileName))
        // .audioCodec('libopus')
        // .audioBitrate(96)
        .outputOptions([
          '-profile:v baseline',
          '-movflags faststart',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(path.join(videoDir, 'index.m3u8'))
        .on('end', function (err, stdout, stderr) {
          if (err) {
            reject(err);
          } else {
            resolve(fileName);
          }
        })
        .run();
    });
  }

  public deleteFile(fileName: string, type: EFileType): void {
    try {
      fs.unlinkSync(path.join(this.getFileDir(type), fileName));
    } catch {}
  }

  getAndCheckFilePath(fileName: string, fileType: EFileType) {
    const fileDes = path.join(this.getFileDir(fileType), fileName);
    const exists = fs.existsSync(fileDes);
    if (!exists) {
      throw new NotFoundException('File not found');
    }
    return fileDes;
  }

  streamPublicFile(fileName: string) {
    const fileDes = this.getAndCheckFilePath(fileName, EFileType.PUBLIC_FILE);
    return fs.createReadStream(fileDes);
  }

  streamLessonFile(fileName: string) {
    const fileDes = this.getAndCheckFilePath(
      fileName,
      EFileType.COURSE_CONTENT,
    );
    return fs.createReadStream(fileDes);
  }

  streamLessonVideo(params: CourseVideoParamsDto, res: any) {
    const fileDes = path.join(
      this.getFileDir(EFileType.COURSE_VIDEO),
      params.lessonId,
      params.hlsf,
    );

    const file = fs.createReadStream(fileDes);
    return file.pipe(res);

    // const file = fs.createReadStream(fileDes);

    // ffmpeg(fileDes)
    //   .videoFilters([
    //     {
    //       filter: 'drawtext',
    //       options: {
    //         text: '+998902400025',
    //         fontsize: 20,
    //         fontcolor: 'white',
    //         x: 'if(eq(mod(n\\,300)\\,0)\\,rand(0\\,(w-text_w))\\,x)',
    //         y: 'if(eq(mod(n\\,300)\\,0)\\,rand(0\\,(h-text_h))\\,y)',
    //         enable: 'lt(mod(n\\,300)\\,200)',
    //         shadowcolor: 'black',
    //         shadowx: 3,
    //         shadowy: 3,
    //         alpha: '0.4',
    //       },
    //     },
    //     {
    //       filter: 'drawtext',
    //       options: {
    //         text: 'Raupov Manuchehr',
    //         fontsize: 20,
    //         fontcolor: 'white',
    //         x: 'if(eq(mod(n\\,300)\\,0)\\,rand(0\\,(w-text_w))\\,x)',
    //         y: 'if(eq(mod(n\\,300)\\,0)\\,rand(0\\,(h-text_h))\\,y)',
    //         enable: 'lt(mod(n\\,300)\\,200)',
    //         shadowcolor: 'black',
    //         shadowx: 3,
    //         shadowy: 3,
    //         alpha: '0.4',
    //       },
    //     },
    //   ])
    //   // .videoBitrate('1000k')
    //   .outputFormat('hls')
    //   .pipe(res, { end: true });
  }
}
