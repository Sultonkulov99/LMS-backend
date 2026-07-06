import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTAccessOptions } from '../../global/config/jwt';
import { TAuthUser } from '../../types/user';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTAccessOptions.secret,
    });
  }

  async validate(payload: { phone: string; id: number }): Promise<TAuthUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        fullName: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
