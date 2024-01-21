import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponsInterface } from './types/userRespons.interface';
import { login } from './dto/login.dto';
import { Request } from 'express';
import { ExpressRequestIntetface } from '@app/types/expressRequest';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe()) // валидация (class-transformer,class-validator)
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponsInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: login,
  ): Promise<UserResponsInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Get('user')
  async currentUser(
    @Req() request: ExpressRequestIntetface,
  ): Promise<UserResponsInterface> {
    console.log(request.user);
    return this.userService.buildUserResponse(request.user);
  }
}
