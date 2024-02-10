import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponsInterface } from './types/userRespons.interface';
import { login } from './dto/login.dto';
import { Request } from 'express';
import { ExpressRequestIntetface } from '@app/types/expressRequest';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@app/guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new BackendValidationPipe()) // валидация (class-transformer,class-validator)
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponsInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body('user') loginUserDto: login,
  ): Promise<UserResponsInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
  //пример с созданным под себя декоратором
  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
    // @User('id') currentUserId: number,
  ): Promise<UserResponsInterface> {
    // console.log('currentUserId', currentUserId);
    console.log('user', user);
    return this.userService.buildUserResponse(user);
  }
  //пример с middleware авторизацией
  // @Get('user')
  // async currentUser(
  //   @Req() request: ExpressRequestIntetface,
  //   @User('id') user: UserEntity,
  // ): Promise<UserResponsInterface> {
  //   console.log('user', user);
  //   return this.userService.buildUserResponse(request.user);
  // }
  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponsInterface> {
    const updateUser = await this.userService.updateUser(
      updateUserDto,
      currentUserId,
    );
    return this.userService.buildUserResponse(updateUser);
  }
}
