import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/auth/auth.controller';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { RefreshToken, RefreshTokenSchema } from 'src/auth/schema/refreshtoken.schema';
import { ResetToken, ResetTokenSchema } from 'src/auth/schema/resert-token.schema';


@Module({
  imports: [MongooseModule.forFeature([{name:Auth.name, schema:AuthSchema, collection: 'users'},
   {name: RefreshToken.name, schema: RefreshTokenSchema, collection: 'refresh_tokens'},
    {name: ResetToken.name, schema: ResetTokenSchema, collection: 'reset_tokens'}
  ])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
