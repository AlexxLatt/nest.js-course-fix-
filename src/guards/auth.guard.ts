import { ExpressRequestIntetface } from '@app/types/expressRequest';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestIntetface>();
    if (request.user) {
      return true;
    }
    throw new HttpException('Not autorized', HttpStatus.UNAUTHORIZED);
  }
}
