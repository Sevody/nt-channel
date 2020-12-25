import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'channel_users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    line_id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    gender: string;

    @Column()
    avatar: string;

    @Column()
    locale: string;
}
