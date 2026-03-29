import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Story } from './Story';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Story, (s) => s.quizQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story!: Story;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId!: string;

  @Column({ type: 'varchar', length: 10 })
  language!: string;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'jsonb' })
  options!: string[];

  @Column({ name: 'correct_answer', type: 'varchar', length: 200 })
  correctAnswer!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;
}
