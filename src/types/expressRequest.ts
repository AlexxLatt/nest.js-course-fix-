import { UserEntity } from '@app/user/user.entity';
import { Request } from 'express';
export interface ExpressRequestIntetface extends Request {
  user?: UserEntity;
}
