import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocConfig } from './global/config/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CorsConfig } from './global/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  new CorsConfig(app).enable(process.env.CORS as string);

  app.enableCors({
    origin: '*',
  });

  if (process.env?.SWAGGER === 'true') {
    const swaggerDoc = SwaggerModule.createDocument(app, SwaggerDocConfig);
    SwaggerModule.setup('swagger', app, swaggerDoc,{
      swaggerOptions:{
        persistAuthorization: true, 
      }
    });
  }

  await app.listen(+process.env.PORT || 9000);
}
bootstrap();
