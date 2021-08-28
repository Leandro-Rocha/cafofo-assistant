import * as os from 'os'
import { Telegraf } from 'telegraf'
import { requireEnv, sleep } from '../../core/util'
import * as BotMenu from './telegram-menu'

console.debug('Starting TelegramBot')

const bot = new Telegraf(requireEnv('BOT_TOKEN'))
BotMenu.createMainMenu(bot)

if (process.env.DEBUG == 'true') {
    bot.on('sticker', (ctx) => { console.debug(ctx.message.sticker) })
    bot.on('message', (ctx) => { console.debug(ctx.from) })

    broadcast(`Olá!! Rodando em ${os.hostname()}`)
}

process.once('SIGINT', async () => {
    await broadcast(`Saindo com [SIGINT] [${process.exitCode}]`)
    bot.stop('SIGINT')
})
process.once('SIGTERM', async () => {
    await broadcast(`Saindo com [SIGTERM] [${process.exitCode}]`)
    bot.stop('SIGTERM')
})


async function init() {
    while (true)
        try {
            await bot.launch()
            console.info('TelegramBot started')
            break
        }
        catch (reason) {
            console.log(reason.response);

            console.warn('Could not start Telegram bot. Retrying in 10s');
            await sleep(10000)
        }
}


init()



export async function broadcast(message: string) {
    const broadcastChatIds = process.env.BROADCAST_CHAT_IDS?.split(',')
    if (!broadcastChatIds) return
    for (const chatId of broadcastChatIds)
        await bot.telegram.sendMessage(chatId, message)
}