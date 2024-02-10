import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1704816963944 implements MigrationInterface {
  name = 'SeedDb1704816963944'; //Это имя миграции, которое представляет собой комбинацию слова "CreateTags" и временной метки 1704816963944 (это часть таймштампа, созданного автоматически). Это имя служит идентификатором миграции.

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nest js')`,
    );
    // password 123
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$z9J.BNwivxFtQJ3VbLXcbO.ZyARBTaVpXXy7elux0Q1i0rHa3JWHG')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description , body, "tagList", "authorId") VALUES ('first-article','First article','first article descr','first article body','coffee, dragons',1)`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description , body, "tagList", "authorId") VALUES ('second-article','Second article','second article descr','second article body','coffee, dragons',1)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
//Когда вы применяете миграции (npm run db:migrateRun), эти методы используются для обновления базы данных согласно ваших изменений в коде.
//Миграции позволяют вам эволюционировать схему базы данных, не теряя при этом данные.
//Каждая миграция представляет собой точку во времени, когда база данных изменяется.
