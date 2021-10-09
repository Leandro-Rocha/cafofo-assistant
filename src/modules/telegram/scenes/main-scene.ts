import { Composer, Markup, Scenes } from 'telegraf'
import { showCalendar, showOverview } from '../actions'
import { CafofoContext } from '../telegram-bot'

const stepHandler = new Composer<CafofoContext>()

stepHandler.hears('Agenda', (ctx) => {
    showCalendar(ctx)
})

stepHandler.hears('Resumo', (ctx) => {
    showOverview(ctx)
})

stepHandler.hears('Tarefas', async (ctx) => {
    await ctx.scene.enter('chore-scene')
})

stepHandler.hears('CafofoFlix', async (ctx) => {
    await ctx.scene.enter('cafofo-flix')
})

export const mainWizard = new Scenes.WizardScene(
    'main',

    async (ctx) => {
        console.debug(`Entered [main]`)

        if (!ctx.cffUser) {
            console.debug(`User not found!`)
            await ctx.scene.enter('user-register')
            return
        }

        await ctx.reply(
            `Olá ${ctx.cffUser?.nickname}!\nComo posso ajudar?`,
            Markup.keyboard([
                ['Agenda', 'Resumo'],
                ['Tarefas', 'Configurações'],
            ])
                .resize()
                .oneTime(),
        )

        ctx.wizard.next()
    },
    stepHandler,
)
