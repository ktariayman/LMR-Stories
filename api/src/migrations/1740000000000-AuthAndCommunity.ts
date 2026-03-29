import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthAndCommunity1740000000000 implements MigrationInterface {
  name = 'AuthAndCommunity1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" varchar(50) NOT NULL,
        "password_hash" varchar(255) NOT NULL DEFAULT '',
        "display_name" varchar(100),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_username" ON "users" ("username");`);

    // 2. Insert sentinel default user (for legacy progress data)
    await queryRunner.query(`
      INSERT INTO "users" ("id", "username", "password_hash", "display_name")
      VALUES ('00000000-0000-0000-0000-000000000001', 'default', '', 'Default User');
    `);

    // 3. Add community columns to stories
    await queryRunner.query(`ALTER TABLE "stories" ADD COLUMN "story_type" varchar(20) NOT NULL DEFAULT 'official';`);
    await queryRunner.query(`ALTER TABLE "stories" ADD COLUMN "author_id" uuid;`);
    await queryRunner.query(`ALTER TABLE "stories" ADD COLUMN "is_public" boolean NOT NULL DEFAULT true;`);
    await queryRunner.query(`ALTER TABLE "stories" ADD COLUMN "vote_count" integer NOT NULL DEFAULT 0;`);
    await queryRunner.query(`
      ALTER TABLE "stories" ADD CONSTRAINT "FK_stories_author"
        FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL;
    `);

    // 4. Add audio_content to story_translations if not exists
    await queryRunner.query(`ALTER TABLE "story_translations" ADD COLUMN IF NOT EXISTS "audio_content" text;`);

    // 5. Migrate user_progress.user_id from varchar to uuid FK
    await queryRunner.query(`ALTER TABLE "user_progress" ADD COLUMN "user_id_new" uuid;`);
    await queryRunner.query(`
      UPDATE "user_progress" SET "user_id_new" = '00000000-0000-0000-0000-000000000001';
    `);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT IF EXISTS "UQ_user_progress";`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP COLUMN "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_progress" RENAME COLUMN "user_id_new" TO "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_progress" ALTER COLUMN "user_id" SET NOT NULL;`);
    await queryRunner.query(`
      ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_user"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_progress" ADD CONSTRAINT "UQ_user_progress"
        UNIQUE ("user_id", "story_id", "language");
    `);

    // 6. Migrate user_achievements.user_id from varchar to uuid FK
    await queryRunner.query(`ALTER TABLE "user_achievements" ADD COLUMN "user_id_new" uuid;`);
    await queryRunner.query(`
      UPDATE "user_achievements" SET "user_id_new" = '00000000-0000-0000-0000-000000000001';
    `);
    await queryRunner.query(`ALTER TABLE "user_achievements" DROP CONSTRAINT IF EXISTS "UQ_user_achievements";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" DROP COLUMN "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" RENAME COLUMN "user_id_new" TO "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" ALTER COLUMN "user_id" SET NOT NULL;`);
    await queryRunner.query(`
      ALTER TABLE "user_achievements" ADD CONSTRAINT "FK_user_achievements_user"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_achievements" ADD CONSTRAINT "UQ_user_achievements"
        UNIQUE ("user_id", "achievement_id");
    `);

    // 7. Create story_votes table
    await queryRunner.query(`
      CREATE TABLE "story_votes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "story_id" uuid NOT NULL,
        "value" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_story_votes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_story_votes" UNIQUE ("user_id", "story_id"),
        CONSTRAINT "FK_story_votes_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_story_votes_story" FOREIGN KEY ("story_id")
          REFERENCES "stories"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "story_votes";`);

    // Revert user_achievements
    await queryRunner.query(`ALTER TABLE "user_achievements" DROP CONSTRAINT IF EXISTS "UQ_user_achievements";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" DROP CONSTRAINT IF EXISTS "FK_user_achievements_user";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" ADD COLUMN "user_id_old" varchar(100) DEFAULT 'default';`);
    await queryRunner.query(`ALTER TABLE "user_achievements" DROP COLUMN "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" RENAME COLUMN "user_id_old" TO "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_achievements" ADD CONSTRAINT "UQ_user_achievements" UNIQUE ("user_id", "achievement_id");`);

    // Revert user_progress
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT IF EXISTS "UQ_user_progress";`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT IF EXISTS "FK_user_progress_user";`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD COLUMN "user_id_old" varchar(100) DEFAULT 'default';`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP COLUMN "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_progress" RENAME COLUMN "user_id_old" TO "user_id";`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "UQ_user_progress" UNIQUE ("user_id", "story_id", "language");`);

    // Revert stories columns
    await queryRunner.query(`ALTER TABLE "stories" DROP CONSTRAINT IF EXISTS "FK_stories_author";`);
    await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN IF EXISTS "vote_count";`);
    await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN IF EXISTS "is_public";`);
    await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN IF EXISTS "author_id";`);
    await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN IF EXISTS "story_type";`);

    // Drop users table
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_username";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
