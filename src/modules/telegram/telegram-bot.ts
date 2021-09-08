import * as os from 'os'
import { requireProperty } from 'profile-env'
import { Scenes, Telegraf } from 'telegraf'
import { sleep } from '../../core/util'
import { User } from '../orm/entities/User.entity'
import { loadScenes } from './scenes/scene-loader'


export interface CafofoContext extends Scenes.WizardContext {
    cffUser?: User
}

export namespace Bot {
    let bot: Telegraf<CafofoContext>

    export async function init() {
        console.debug('Starting TelegramBot')

        bot = new Telegraf<CafofoContext>(requireProperty('BOT_TOKEN'))

        bot.use(async (ctx, next) => {
            const cffUser = await User.findOne({ telegramChatId: ctx.from?.id })
            ctx.cffUser = cffUser
            next()
        })

        loadScenes(bot)

        if (process.env.DEBUG == 'true') {
            bot.on('sticker', (ctx) => { console.debug(ctx.message.sticker) })

            broadcast(`Olá!! Rodando em ${os.hostname()}`, requireProperty('BROADCAST_CHAT_IDS').split(','))
        }

        process.once('SIGINT', async () => {
            await broadcast(`Saindo com [SIGINT] [${process.exitCode}]`, requireProperty('ADMIN_CHAT_IDS').split(','))
            bot.stop('SIGINT')
        })
        process.once('SIGTERM', async () => {
            await broadcast(`Saindo com [SIGTERM] [${process.exitCode}]`, requireProperty('ADMIN_CHAT_IDS').split(','))
            bot.stop('SIGTERM')
        })

        while (true)

            try {
                await bot.launch()
                console.info('TelegramBot started')
                break
            }
            catch (reason: any) {
                console.error(reason)
                console.warn('Could not start Telegram bot. Retrying in 10s')
                await sleep(10000)
            }
    }

    export async function broadcast(message: string, chatIds: string[]) {
        for (const chatId of chatIds) await bot.telegram.sendMessage(chatId, message)
    }
}
