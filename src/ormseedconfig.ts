import ormconfig from '@app/ormconfig';

const ormseedconfig = {
  ...ormconfig,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'], // Изменил эту строку
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default ormseedconfig;
