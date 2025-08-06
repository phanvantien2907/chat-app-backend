import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CatchEverythingFilter } from 'src/exception/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: '*', // Cho phép tất cả các nguồn gốc
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các tiêu đề được phép
    credentials: true, // Cho phép cookie được gửi trong các yêu cầu cross-origin
  });
  app.setGlobalPrefix('api'); // Thiết lập tiền tố toàn cục cho các route
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
    forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không được định nghĩa
    transform: true, // Tự động chuyển đổi kiểu dữ liệu
  }));
  app.useGlobalFilters(new CatchEverythingFilter());
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
