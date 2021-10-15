import moment from 'moment'
import { Composer, Markup, Scenes } from 'telegraf'
import { Chore } from '../../orm/entities/Chore.entity'
import { ChoreExecution } from '../../orm/entities/ChoreExecution.entity'
import { User } from '../../orm/entities/User.entity'
import { lastChores } from '../actions'
import { Stickers } from '../stickers'
import { CafofoContext } from '../telegram-bot'

const stepHandler = new Composer<CafofoContext>()

export const choreWizard = new Scenes.WizardScene(
    'chore-scene',
    async (ctx) => {
        console.debug(`Entered [chore-scene]`)

        const choreNames = (await Chore.find()).map((chore) => chore.title)

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
        const chore = await Chore.findOneOrFail({ title: choice })

        if (chore) {
            const user = await User.findOneOrFail({ telegramChatId: ctx.cffUser?.telegramChatId })
            const execution = new ChoreExecution(user, chore, moment.now())
            execution.save()
            await ctx.replyWithSticker(Stickers.ConcernedFroge_thumbs)
            await ctx.reply('Anotado!')
        }

        await ctx.scene.enter('main')
    },
    stepHandler,
)
