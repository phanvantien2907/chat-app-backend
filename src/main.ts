import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Cho phép tất cả các nguồn gốc
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các tiêu đề được phép
  });
  app.setGlobalPrefix('api'); // Thiết lập tiền tố toàn cục cho các route
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
    forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không được định nghĩa
    transform: true, // Tự động chuyển đổi kiểu dữ liệu
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
