// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AppController } from '@app/app.controller';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AppService } from '@app/app.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TagModule } from '@app/tag/tag.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypeOrmModule } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ormconfig from '@app/ormconfig';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TagModule, UserModule], // TypeOrmModule.forRoot(ormconfig) строка импортирует подключение к бд
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AppModule {}
