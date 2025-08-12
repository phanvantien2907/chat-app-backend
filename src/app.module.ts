import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ExceptionModule } from './exception/exception.module';
import { CatchEverythingFilter } from 'src/exception/http-exception.filter';
import { UsersModule } from './users/users.module';
dotenv.config();

@Module({
  imports: [ChatModule, MongooseModule.forRoot(process.env.DATABASE_URL!), AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET!,
    signOptions: { expiresIn: '1h' },
    global: true,}),
    ExceptionModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_FILTER',
    useClass: CatchEverythingFilter,
  }],
})
export class AppModule {}
