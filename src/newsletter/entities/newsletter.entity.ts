import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm'

@Entity('newsletters')
export class Newsletter {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column({ default: true })
    isSubscribed: boolean

    @CreateDateColumn({ name: 'creation_date' })
    creationDate: Date
}
