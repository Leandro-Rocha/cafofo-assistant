import { Telegraf } from 'telegraf'
import { requireEnv } from '../../core/util'
import * as BotMenu from './telegram-menu'
import * as os from 'os'

console.debug('Starting TelegramBot')

const bot = new Telegraf(requireEnv('BOT_TOKEN'))
BotMenu.createMainMenu(bot)

if (process.env.DEBUG == 'true') {
    bot.on('sticker', (ctx) => { console.log(ctx.message.sticker) })

    broadcast(`Hello! Running from ${os.hostname()}`)


}

process.once('SIGINT', async () => {
    await broadcast(`Saindo com [SIGINT]`)
    bot.stop('SIGINT')
})
process.once('SIGTERM', async () => {
    await broadcast(`Saindo com [SIGINT]`)
    bot.stop('SIGTERM')
})

bot.launch()
console.info('TelegramBot started')


async function broadcast(message: string) {
    const broadcastChatIds = process.env.BROADCAST_CHAT_IDS?.split(',')
    if (!broadcastChatIds) return
    for (const chatId of broadcastChatIds)
        await bot.telegram.sendMessage(chatId, message)
}