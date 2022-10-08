import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.findUser({ id: Number(id) });
  }

  // @Get()
  // async findUsers(): Promise<UserModel[]> {
  //   return this.userService.findUsers({
  //     where: { name: true },
  //   });
  // }

  @Post()
  async createUser(
    @Body()
    userData: CreateUserDto,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  // @Put(':id')
  // async updateUser(@Param('id') id: string): Promise<UserModel> {
  //   return this.userService.updateUser({
  //     where: { id: Number(id) },
  //     data: {
  //       email: '',
  //       name: '',
  //       walletAddress: '',
  //       // assets: '',
  //     },
  //   });
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string): Promise<UserModel> {
  //   return this.userService.deleteUser({ id: Number(id) });
  // }
}
