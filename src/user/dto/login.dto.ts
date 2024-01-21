import { IsEmail, IsNotEmpty } from 'class-validator';

export class login {
  @IsNotEmpty() // проверка на то что строка не пуста
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
