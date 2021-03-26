import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger OpenAPI Documentation config
  const config = new DocumentBuilder()
    .setTitle('Chytrá palice')
    .setDescription('API Description ')
    .setVersion('0.0.1')
    .addTag('contest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
