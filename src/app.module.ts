import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
  imports: [ChatModule, MongooseModule.forRoot(process.env.DATABASE_URL!), AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET!,
    signOptions: { expiresIn: '1h' },
    global: true,})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
