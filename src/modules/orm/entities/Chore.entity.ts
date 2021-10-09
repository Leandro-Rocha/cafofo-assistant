import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Action } from './Action.entity'
import { Room } from './Room.entity'

@Entity()
export class Chore extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @ManyToOne(() => Room)
    room!: Room

    @ManyToOne(() => Action)
    action!: Action

    @Column()
    alarm!: number

    constructor(title: string, room: Room, action: Action, alarm: number) {
        super()
        this.title = title
        this.room = room
        this.action = action
        this.alarm = alarm
    }
}
