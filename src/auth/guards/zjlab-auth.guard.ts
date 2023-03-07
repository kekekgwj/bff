import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ZjlabAuthGuard extends AuthGuard('zjlab') { }