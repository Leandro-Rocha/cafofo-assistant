import moment from 'moment'
import { Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import * as Calendar from '../../services/calendar/calendar'
import { showEventWithTime } from '../../services/calendar/calendar'
import { ChoreService } from '../../services/chores/chore-service'
import { Chore, ChoreExecution } from '../../services/chores/interfaces'
import { miguelFacts } from '../../services/miguel/miguel'
import { Stickers } from './stickers'
import { CafofoContext } from './telegram-bot'

export async function showCalendar(ctx: CafofoContext, maxResults = 10) {
    try {
        const parsedEvents = await Calendar.listNextEvents(maxResults)
        const grouped = Calendar.groupByDay(parsedEvents)
        let response = ''

        for (const [day, events] of Object.entries(grouped)) {
            const momentDay = moment(day)

            response += `${momentDay.format('DD MMM (ddd) - ')}${Calendar.daysFromNow(day)}\n`
            response += `${events.map(showEventWithTime).join('\n')}`
            response += `\n\n`
        }

        await ctx.reply(`Esses são os próximos ${maxResults} compromissos:\n`)
        await ctx.reply(response)
    } catch (err) {
        console.error(err)
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo acessar a agenda...')
    }

    return '/'
}

export async function lastChores(ctx: Context<Update>) {
    try {
        let response = ''
        const lastExecutions = await ChoreService.lastChoreExecutions()

        lastExecutions.forEach((lastExecution) => {
            response += `${lastExecution.chore.title} - ${moment(lastExecution.timestamp).fromNow()} por ${lastExecution.user.nickname}\n`
        })

        await ctx.reply(response)
    } catch (err) {
        console.error(err)
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo fazer o resumo de hoje...')
    }

    return '/'
}

export async function showOverview(ctx: Context<Update>) {
    try {
        await ctx.reply(await Calendar.eventsOverview())
        await ctx.reply(miguelFacts())

        let overdueChoresText = 'Essas tarefas estão atrasadas!\n\n'
        const overdueChores = await ChoreService.overdueChores()

        overdueChores.forEach((overdueChore) => {
            overdueChoresText += `${overdueChore.chore.title} - ${moment(overdueChore.timestamp).fromNow()} por ${overdueChore.user.nickname}\n`
        })
        await ctx.reply(overdueChoresText)
    } catch (err) {
        console.error(err)
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo fazer o resumo de hoje...')
    }

    return '/'
}
