import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateToken } from './jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '20m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GenerateToken],
  exports: [GenerateToken],
})
export class JwtTokenModule {}