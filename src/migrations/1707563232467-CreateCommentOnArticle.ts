import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentOnArticle1707563232467 implements MigrationInterface {
  name = 'CreateCommentOnArticle1707563232467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "comments" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "comment"`);
  }
}
