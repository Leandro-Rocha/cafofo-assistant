import { Composer, Markup, Scenes } from 'telegraf'
import { User } from '../../orm/entities/User.entity'
import { CafofoContext } from '../telegram-bot'

const stepHandler = new Composer<CafofoContext>()
stepHandler.use(async (ctx) => {
    if (!ctx.from) return

    const nickname: string = (ctx.message as any)?.text

    if (!nickname || nickname.startsWith('/')) {
        ctx.reply('Sério, qual é seu apelido?')
        return
    }

    const user = new User(ctx.from.first_name, ctx.from.last_name!, nickname, ctx.from.id)
    await user.save()

    ctx.reply(`Legal! Cadastrei você, ${nickname}`)
    ctx.cffUser = user
    await ctx.scene.enter('main')
})

export const userRegisterWizard = new Scenes.WizardScene(
    'user-register',
    async (ctx) => {
        await ctx.reply('Olá, parece que é sua primeira vez por aqui...')
        await ctx.reply('Qual é seu apelido?', Markup.removeKeyboard())
        ctx.wizard.next()
    },
    stepHandler,
)
