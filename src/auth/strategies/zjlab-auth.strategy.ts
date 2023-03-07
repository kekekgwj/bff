import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-custom';
import { FastifyRequest } from 'fastify'

@Injectable()
export class ZjlabStrategy extends PassportStrategy(Strategy, 'zjlab') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: FastifyRequest): Promise<Payload> {
    const q: any = req.query;

    const user = await this.authService.validateZJlabUser(q.ticket as string);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}