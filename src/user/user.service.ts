import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponsInterface } from './types/userRespons.interface';
import { login } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = { errors: {} };
    const userByEmail = await this.userRepository.findOne({
      //проверка на email проверяем дб на DTO запрос
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      //проверка на username проверяем дб на DTO запрос
      username: createUserDto.username,
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }
    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }
    if (userByEmail || userByUsername) {
      // если мы нашли что-то из них то выводится ошибка
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto); // копируем свойства объекта createUserDto в newUser
    console.log('new user', newUser);
    return await this.userRepository.save(newUser); //сохраняем объект в бд
  }

  generateJwt(user: UserEntity): string {
    // создаем токен
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET, // в config
    );
  }

  buildUserResponse(user: UserEntity): UserResponsInterface {
    // создаем объект user и через spread оператор заполняем объект User
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
  async login(loginUserDto: login): Promise<UserEntity> {
    const errorResponse = { errors: { 'email or password': 'is valid' } };
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ['id', 'username', 'email', 'bio', 'image', 'password'] }, // здесь мы делаем это что бы получить поле password тк в entity select:false
    ); // находим емаил по логину
    if (!user) {
      // если email-a нету то выдается ошибка
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordCorrect = await compare(
      // проверка пароля на сходства
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      // если пароля нету то выдается ошибка
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    delete user.password;
    return user;
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
  async updateUser(
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<UserEntity> {
    const user = await this.findById(currentUserId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
}
