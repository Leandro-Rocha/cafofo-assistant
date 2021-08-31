import { Composer, Scenes } from "telegraf";
import { User } from "../../orm/entities/User.entity";
import { CafofoContext } from "../telegram-bot";

const stepHandler = new Composer<CafofoContext>()
stepHandler.use(async (ctx) => {

    if (!ctx.from) return

    const nickname: string = (<any>ctx.message)?.text

    if (!nickname || nickname.startsWith('/')) {
        ctx.reply('Sério, qual é seu apelido?')
        return
    }

    const user = new User();
    user.firstName = ctx.from.first_name
    user.lastName = ctx.from.last_name
    user.nickname = nickname
    user.telegramChatId = ctx.from.id
    await user.save()

    ctx.reply(`Legal! Cadastrei você, ${nickname}`)
    ctx.scene.leave()
})

export const userRegisterWizard = new Scenes.WizardScene(
    'user-register',
    async (ctx) => {
        await ctx.reply('Olá, parece que é sua primeira vez por aqui...')
        await ctx.reply('Qual é seu apelido?')
        ctx.wizard.next()
    },
    stepHandler,
)
