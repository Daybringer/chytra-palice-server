import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { JwtStrategy } from './jwt.strategy';
require('dotenv').config();
@Module({
  imports: [
    JwtModule.register({
      secret: 'test2',
      signOptions: { expiresIn: '100d' },
    }),
    TypeOrmModule.forFeature([AdminEntity]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
