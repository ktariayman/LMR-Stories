import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToMany, Index, ManyToOne, JoinColumn,
} from 'typeorm';
import { StoryTranslation } from './StoryTranslation';
import { QuizQuestion } from './QuizQuestion';
import { UserProgress } from './UserProgress';
import { User } from './User';

export type StoryType = 'official' | 'community';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug!: string;

  @Column({ type: 'varchar', length: 20 })
  difficulty!: 'easy' | 'medium' | 'hard';

  @Column({ name: 'age_group', type: 'varchar', length: 10 })
  ageGroup!: '5-7' | '8-10';

  @Column({ type: 'varchar', length: 50 })
  theme!: string;

  @Column({ name: 'theme_emoji', type: 'varchar', length: 10, default: '' })
  themeEmoji!: string;

  @Column({ name: 'is_ai_generated', type: 'boolean', default: false })
  isAiGenerated!: boolean;

  @Column({ name: 'story_type', type: 'varchar', length: 20, default: 'official' })
  storyType!: StoryType;

  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author!: User | null;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ name: 'vote_count', type: 'integer', default: 0 })
  voteCount!: number;

  @Column({ name: 'cover_image', type: 'text', nullable: true })
  coverImage!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => StoryTranslation, (t) => t.story, { cascade: true })
  translations!: StoryTranslation[];

  @OneToMany(() => QuizQuestion, (q) => q.story, { cascade: true })
  quizQuestions!: QuizQuestion[];

  @OneToMany(() => UserProgress, (p) => p.story)
  progress!: UserProgress[];
}
