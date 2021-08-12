import { Telegraf } from 'telegraf'
import { MenuMiddleware } from 'telegraf-inline-menu'
import { Calendar } from './calendar'
import { Tarefas } from './tarefas'
import { BotMenu } from './telegram-menu'


console.info('Starting TelegramBot')

const bot = new Telegraf(process.env.BOT_TOKEN || '')

bot.command('tarefas', async (ctx) => {
    ctx.replyWithMarkdown(await Tarefas.listTarefas())
})

bot.command('louca', (ctx) => {
    ctx.reply(Tarefas.loucaDeHoje())
})

bot.command('agenda', async (ctx) => {
    const response = await Calendar.events()

    ctx.reply(response)
})

bot.on('sticker', (ctx) => {
    console.log(ctx.message.sticker.file_id);

})


const mainMenuTemplate = BotMenu.createMainMenu()
const menuMiddleware = new MenuMiddleware('/', mainMenuTemplate)
bot.start(ctx => menuMiddleware.replyToContext(ctx))
bot.command('menu', ctx => menuMiddleware.replyToContext(ctx))
bot.use(menuMiddleware)

bot.launch()
console.info('TelegramBot started')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))