import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chore } from './Chore.entity'
import { User } from './User.entity'

@Entity()
export class ChoreExecution extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    user!: User

    @ManyToOne(() => Chore)
    chore!: Chore

    @Column({
        type: 'varchar',
        transformer: {
            to: (value: number) => String(value),
            from: (value: string) => Number(value),
        },
    })
    timestamp!: number

    constructor(user: User, chore: Chore, timestamp: number) {
        super()
        this.user = user
        this.chore = chore
        this.timestamp = timestamp
    }
}
