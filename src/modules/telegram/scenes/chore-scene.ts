import { Composer, Markup, Scenes } from "telegraf";
import { choreList } from "../../../services/chores/data";
import { lastChores, registerChore } from "../actions";
import { CafofoContext } from "../telegram-bot";

const stepHandler = new Composer<CafofoContext>()
// stepHandler.use(async (ctx) => {

//     if (!ctx.from) return

//     const nickname: string = (<any>ctx.message)?.text

//     if (!nickname || nickname.startsWith('/')) {
//         ctx.reply('Sério, qual é seu apelido?')
//         return
//     }

//     const user = new User();
//     user.firstName = ctx.from.first_name
//     user.lastName = ctx.from.last_name
//     user.nickname = nickname
//     user.telegramChatId = ctx.from.id
//     await user.save()

//     ctx.reply(`Legal! Cadastrei você, ${nickname}`)
//     ctx.scene.leave()
// })

export const choreWizard = new Scenes.WizardScene(
    'chore-scene',
    async (ctx) => {
        console.debug(`Entered [chore-scene]`)

        const choreNames = choreList.map(chore => chore.title);
        await ctx.reply('Qual delas?', Markup.keyboard(
            ['Voltar', 'Ver todas', ...choreNames], {
            wrap: (_btn, _index, currentRow) => {

                return _index < 3 || currentRow.length >= 3
            }
        }).resize())

        ctx.wizard.next()
    },
    async (ctx) => {
        const choice: string = (<any>ctx.message)?.text

        if (choice === 'Voltar') {
            await ctx.scene.enter('main')
            return
        }

        if (choice === 'Ver todas') {
            await lastChores(ctx)
            await ctx.scene.enter('main')
            return
        }

        const chore = choreList.find(chore => chore.title === choice)!

        await ctx.reply(
            `Confirma que ${ctx.cffUser?.nickname} ${chore.past}?`,
            Markup.inlineKeyboard([
                Markup.button.callback('Sim', choice),
                Markup.button.callback('Não', 'no')
            ])
        )

        ctx.wizard.next()
    },
    async (ctx) => {

        const choice: string = (<any>ctx.callbackQuery)?.data
        const chore = choreList.find(chore => chore.title === choice)!

        if (chore) {
            await registerChore(ctx, chore)
        }

        await ctx.scene.enter('main')
    },
    stepHandler
)

