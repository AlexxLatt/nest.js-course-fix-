// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { UserService } from './user/user.service';
import { ArticaleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticaleModule,
    ProfileModule,
  ], // TypeOrmModule.forRoot(ormconfig) строка импортирует подключение к бд
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
