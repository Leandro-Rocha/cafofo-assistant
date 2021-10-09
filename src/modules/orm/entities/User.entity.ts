import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName?: string

    @Column()
    nickname!: string

    @Column()
    telegramChatId!: number

    constructor(firstName: string, lastName: string, nickname: string, telegramChatId: number) {
        super()
        this.firstName = firstName
        this.lastName = lastName
        this.nickname = nickname
        this.telegramChatId = telegramChatId
    }
}
