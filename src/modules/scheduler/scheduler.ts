import cron from 'cron'
import { requireProperty } from 'profile-env'
import { eventsOverview } from '../../services/calendar/calendar'
import { Bot } from '../telegram/telegram-bot'

export const dailyReportJob = cron.job(
    '0 0 8 * * *',
    async () => {
        Bot.broadcast(await eventsOverview(), requireProperty('BROADCAST_CHAT_IDS').split(','))
    },
    null,
    true,
    'America/Sao_Paulo',
)
