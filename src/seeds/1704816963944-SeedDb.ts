import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1704816963944 implements MigrationInterface {
  name = 'SeedDb1704816963944'; //Это имя миграции, которое представляет собой комбинацию слова "CreateTags" и временной метки 1704816963944 (это часть таймштампа, созданного автоматически). Это имя служит идентификатором миграции.

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Этот метод определяет действия, которые нужно выполнить для обновления базы данных (например, создание таблицы). В данном случае, используется
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'),('coffe'),('nest js')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //Этот метод определяет действия, которые нужно выполнить для отката изменений, внесенных методом up
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
//Когда вы применяете миграции (npm run db:migrateRun), эти методы используются для обновления базы данных согласно ваших изменений в коде.
//Миграции позволяют вам эволюционировать схему базы данных, не теряя при этом данные.
//Каждая миграция представляет собой точку во времени, когда база данных изменяется.
