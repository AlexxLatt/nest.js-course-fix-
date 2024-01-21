import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() // проверка на то что строка не пуста
  readonly username: string;

  @IsNotEmpty() // проверка на то что строка не пуста
  @IsEmail() // проверка на то что это Email
  readonly email: string;

  @IsNotEmpty() // проверка на то что строка не пуста
  readonly password: string;
}
