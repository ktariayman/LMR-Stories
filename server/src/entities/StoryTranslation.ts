import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Story } from './Story';

@Entity('story_translations')
@Unique(['story', 'language'])
export class StoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Story, (s) => s.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story!: Story;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId!: string;

  @Column({ type: 'varchar', length: 10 })
  language!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', default: '' })
  summary!: string;

  @Column({ name: 'audio_content', type: 'text', nullable: true })
  audioContent?: string;
}
