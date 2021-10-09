import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class Action extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    present!: string

    @Column()
    past!: string

    constructor(title: string, present: string, past: string) {
        super()
        this.title = title
        this.present = present
        this.past = past
    }
}
