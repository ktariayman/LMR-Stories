import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn,
} from 'typeorm';
import { Achievement } from './Achievement';

@Entity('user_achievements')
@Unique(['userId', 'achievement'])
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievement_id' })
  achievement!: Achievement;

  @Column({ name: 'achievement_id', type: 'uuid' })
  achievementId!: string;

  @CreateDateColumn({ name: 'earned_at' })
  earnedAt!: Date;
}
