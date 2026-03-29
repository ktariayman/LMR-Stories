import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Story } from './Story';

@Entity('user_progress')
@Unique(['userId', 'storyId', 'language'])
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Story, (s) => s.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story!: Story;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId!: string;

  @Column({ type: 'varchar', length: 10 })
  language!: string;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ name: 'quiz_score', type: 'int', default: 0 })
  quizScore!: number;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt!: Date | null;
}
