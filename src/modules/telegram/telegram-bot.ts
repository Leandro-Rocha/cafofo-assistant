import { Telegraf } from 'telegraf'
import { MissingEnvironmentProperty } from '../../core/exceptions'
import * as BotMenu from './telegram-menu'


if (!process.env.BOT_TOKEN) throw new MissingEnvironmentProperty('BOT_TOKEN')

console.debug('Starting TelegramBot')

const bot = new Telegraf(process.env.BOT_TOKEN)
BotMenu.createMainMenu(bot)

if (process.env.DEBUG == 'true') bot.on('sticker', (ctx) => { console.log(ctx.message.sticker) })

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.launch()
console.info('TelegramBot started')
