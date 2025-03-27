import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ type: 'jsonb', nullable: true })
  body: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
