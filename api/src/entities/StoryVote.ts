import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { User } from './User';
import { Story } from './Story';

@Entity('story_votes')
@Unique(['userId', 'storyId'])
export class StoryVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId!: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story!: Story;

  @Column({ type: 'integer', default: 1 })
  value!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
