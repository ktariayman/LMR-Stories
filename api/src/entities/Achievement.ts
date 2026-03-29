import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  slug!: string;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  emoji!: string;

  @Column({ name: 'requirement_type', type: 'varchar', length: 30 })
  requirementType!: string;

  @Column({ name: 'requirement_value', type: 'int' })
  requirementValue!: number;
}
