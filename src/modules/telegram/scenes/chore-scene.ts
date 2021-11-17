import moment from 'moment'
import { requireProperty } from 'profile-env'
import { Composer, Markup, Scenes } from 'telegraf'
import { Chore } from '../../orm/entities/Chore.entity'
import { ChoreExecution } from '../../orm/entities/ChoreExecution.entity'
import { User } from '../../orm/entities/User.entity'
import { lastChores } from '../actions'
import { Stickers } from '../stickers'
import { Bot, CafofoContext } from '../telegram-bot'

const stepHandler = new Composer<CafofoContext>()

export const choreWizard = new Scenes.WizardScene(
    'chore-scene',
    async (ctx) => {
        console.debug(`Entered [chore-scene]`)

        const choreNames = (await Chore.find()).map((chore) => chore.title).sort()

        await ctx.reply(
            'Qual delas?',
            Markup.keyboard(['Voltar', 'Ver todas', ...choreNames], {
                wrap: (_btn, _index, currentRow) => {
                    return _index < 3 || currentRow.length >= 3
                },
            })
                .resize()
                .oneTime(),
        )

        ctx.wizard.next()
    },
    async (ctx) => {
        const choice: string = (ctx.message as any)?.text

        if (choice === 'Voltar') {
            await ctx.scene.enter('main')
            return
        }

        if (choice === 'Ver todas') {
            await lastChores(ctx)
            await ctx.scene.enter('main')
            return
        }

        const chore = await Chore.findOneOrFail({ title: choice }, { relations: ['action'] })
        await ctx.reply(
            `Confirma que ${ctx.cffUser?.nickname} ${chore.action.past} ${chore.title}?`,
            Markup.inlineKeyboard([Markup.button.callback('Sim', choice), Markup.button.callback('Não', 'no')]),
        )

        ctx.wizard.next()
    },
    async (ctx) => {
        const choice: string = (ctx.callbackQuery as any)?.data
        const chore = await Chore.findOneOrFail({ title: choice }, { relations: ['action'] })

        if (chore) {
            const userChatId = ctx.cffUser?.telegramChatId!
            const user = await User.findOneOrFail({ telegramChatId: userChatId })
            const execution = new ChoreExecution(user, chore, moment.now())
            execution.save()

            await ctx.replyWithSticker(Stickers.FunkyGoose_thumbs)
            await ctx.reply('Anotado!')

            // Broadcast to all but current user
            const broadcastIds = requireProperty('BROADCAST_CHAT_IDS').split(',')
            const otherUserIds = broadcastIds.filter((id) => id !== String(userChatId))
            Bot.broadcast(`${ctx.cffUser?.nickname} acabou de ${chore.action.present} ${chore.title}!`, otherUserIds)
        }

        await ctx.scene.enter('main')
    },
    stepHandler,
)
