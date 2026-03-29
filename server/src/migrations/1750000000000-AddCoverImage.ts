import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverImage1750000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE stories ADD COLUMN cover_image TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE stories DROP COLUMN cover_image`);
  }
}
