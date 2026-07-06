import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerDocConfig = new DocumentBuilder()
  .setTitle('API Docs')
  .setDescription('The api description of E-Learning')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
