import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
