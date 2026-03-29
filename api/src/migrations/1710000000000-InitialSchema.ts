import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE "stories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" varchar(100) NOT NULL,
        "difficulty" varchar(20) NOT NULL,
        "age_group" varchar(10) NOT NULL,
        "theme" varchar(50) NOT NULL,
        "theme_emoji" varchar(10) NOT NULL DEFAULT '',
        "is_ai_generated" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stories" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_stories_slug" ON "stories" ("slug");`);

    await queryRunner.query(`
      CREATE TABLE "story_translations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "story_id" uuid NOT NULL,
        "language" varchar(10) NOT NULL,
        "title" varchar(200) NOT NULL,
        "content" text NOT NULL,
        "summary" text NOT NULL DEFAULT '',
        CONSTRAINT "PK_story_translations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_story_translations_story_lang" UNIQUE ("story_id", "language"),
        CONSTRAINT "FK_story_translations_story" FOREIGN KEY ("story_id")
          REFERENCES "stories"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "quiz_questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "story_id" uuid NOT NULL,
        "language" varchar(10) NOT NULL,
        "question" text NOT NULL,
        "options" jsonb NOT NULL,
        "correct_answer" varchar(200) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_quiz_questions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_quiz_questions_story" FOREIGN KEY ("story_id")
          REFERENCES "stories"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_progress" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" varchar(100) NOT NULL DEFAULT 'default',
        "story_id" uuid NOT NULL,
        "language" varchar(10) NOT NULL,
        "completed" boolean NOT NULL DEFAULT false,
        "quiz_score" integer NOT NULL DEFAULT 0,
        "stars" integer NOT NULL DEFAULT 0,
        "completed_at" TIMESTAMP,
        CONSTRAINT "PK_user_progress" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_progress" UNIQUE ("user_id", "story_id", "language"),
        CONSTRAINT "FK_user_progress_story" FOREIGN KEY ("story_id")
          REFERENCES "stories"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "achievements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" varchar(50) NOT NULL,
        "title" varchar(100) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "emoji" varchar(10) NOT NULL DEFAULT '',
        "requirement_type" varchar(30) NOT NULL,
        "requirement_value" integer NOT NULL,
        CONSTRAINT "PK_achievements" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_achievements_slug" ON "achievements" ("slug");`);

    await queryRunner.query(`
      CREATE TABLE "user_achievements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" varchar(100) NOT NULL DEFAULT 'default',
        "achievement_id" uuid NOT NULL,
        "earned_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_achievements" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_achievements" UNIQUE ("user_id", "achievement_id"),
        CONSTRAINT "FK_user_achievements_achievement" FOREIGN KEY ("achievement_id")
          REFERENCES "achievements"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_achievements" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "achievements" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_progress" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quiz_questions" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "story_translations" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stories" CASCADE;`);
  }
}
