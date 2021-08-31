import './config'
import './modules/orm/orm'
import './modules/mongo/mongo'
import './modules/telegram/telegram-bot'
import { DB } from './modules/orm/orm'
import { Bot } from './modules/telegram/telegram-bot'

async function init() {
    await DB.init()
    await Bot.init()
}

init()