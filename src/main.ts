import './config'
import './modules/orm/orm'
import './modules/telegram/telegram-bot'
import { DB } from './modules/orm/orm'
import { Bot } from './modules/telegram/telegram-bot'
import { dailyReportJob } from './modules/scheduler/scheduler'

async function init() {
    await DB.init()
    await Bot.init()
    dailyReportJob.start()
}

init()
