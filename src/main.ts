import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './apps/app.module';
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const  reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true
  }))
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
