import { UserType } from './user.type';

export interface UserResponsInterface {
  // добавлаем в UserType строку token:string
  user: UserType & { token: string };
}
