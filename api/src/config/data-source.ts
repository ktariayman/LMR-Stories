import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { Story } from '../entities/Story';
import { StoryTranslation } from '../entities/StoryTranslation';
import { QuizQuestion } from '../entities/QuizQuestion';
import { UserProgress } from '../entities/UserProgress';
import { Achievement } from '../entities/Achievement';
import { UserAchievement } from '../entities/UserAchievement';
import { User } from '../entities/User';
import { StoryVote } from '../entities/StoryVote';
import { InitialSchema1710000000000 } from '../migrations/1710000000000-InitialSchema';
import { AuthAndCommunity1740000000000 } from '../migrations/1740000000000-AuthAndCommunity';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://lmr:lmr_password@localhost:5432/lmr_stories';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  entities: [Story, StoryTranslation, QuizQuestion, UserProgress, Achievement, UserAchievement, User, StoryVote],
  migrations: [InitialSchema1710000000000, AuthAndCommunity1740000000000],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
