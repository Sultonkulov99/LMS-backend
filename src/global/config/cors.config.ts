import { INestApplication, Logger } from '@nestjs/common';

export class CorsConfig {
  private app: INestApplication;
  private logger: Logger = new Logger();

  constructor(app: INestApplication) {
    this.app = app;
  }

  public enable(envCors: string) {
    let whiteListRegex = '^(';
    if (envCors === '*') {
      this.app.enableCors({
        origin: true,
      });
      this.logger.log('CORS enabled for all');
      return envCors;
    }

    const whiteList = envCors.split(',');
    whiteList.forEach((origin, idx) => {
      if (idx === 0) {
        whiteListRegex += origin;
      } else if (idx > 0) {
        whiteListRegex += `|${origin}`;
      }
      if (idx + 1 === whiteList.length) {
        whiteListRegex += ')$';
      }
    });

    this.app.enableCors({
      origin: new RegExp(whiteListRegex),
    });

    this.logger.log(`CORS enabled for: ${envCors.replace(/,/g, ' | ')}`);

    return whiteListRegex;
  }
}
