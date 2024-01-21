import { UserEntity } from '../user.entity';
export type UserType = Omit<UserEntity, 'hashPassword'>; // убираем из UserEntity  метод hashPassword(т.к в объекте на не нужен метод)
