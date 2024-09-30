import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRET_JWT } from 'src/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req.cookies) {
            return req.cookies['token'];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, username: payload.username };
  }
}
