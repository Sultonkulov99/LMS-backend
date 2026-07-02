import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('LMS')
    .setDescription('LMS platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
