//файл подключается к нашей бд а после  в строке  entities: [__dirname + '/**/*.entity{.ts,.js}'] выполняет код в tag.entity.ts
import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
export default config; //  export в AppModule
