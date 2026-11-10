import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'node:url';
import { url } from 'node:inspector';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(fileURLToPath(new URL('../public', import.meta.url)));
  app.setBaseViewsDir(fileURLToPath(new URL('../views', import.meta.url)));
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
