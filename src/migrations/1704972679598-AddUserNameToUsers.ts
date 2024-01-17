import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNameToUsers1704972679598 implements MigrationInterface {
  name = 'AddUserNameToUsers1704972679598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
