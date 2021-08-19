import moment from "moment";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import * as Calendar from "../../services/calendar/calendar";
import { Chore, ChoreExecution } from "../../services/chores/interfaces";
import { choreCollection, ChoreModel } from "../mongo/mongo";
import { Stickers } from "./stickers";

const showEventWithTime = (event: Calendar.CalendarEvent) => `  ${(event.start.hasTime ? event.start.moment.format('HH:mm - ') : '')}${event.summary}`

export async function showCalendar(ctx: Context<Update>, maxResults = 10) {
    try {
        const parsedEvents = await Calendar.listNextEvents(maxResults)
        const grouped = Calendar.groupByDay(parsedEvents)
        let response = ''

        for (const [day, events] of Object.entries(grouped)) {
            const momentDay = moment(day)
            const isToday = momentDay.diff(moment(), 'days') == 0


            response += `${momentDay.format('DD MMM (ddd) - ')}${(isToday ? 'hoje' : momentDay.fromNow())}\n`
            response += `${events.map(showEventWithTime).join('\n')}`
            response += `\n\n`
        }

        await ctx.reply(`Esses são os próximos ${maxResults} compromissos:\n`)
        await ctx.reply(response)
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo acessar a agenda...')
    }

    return '/'
}


export async function createOverview() {
    const events = await Calendar.listNextEvents()
    const todayEvents = events.filter(event => event.start.moment.isSame(moment().add(0, 'days'), 'day'))
    const tomorrowEvents = events.filter(event => event.start.moment.isSame(moment().add(1, 'days'), 'day'))

    const todayEventsFormatted = `Para hoje: ` + (todayEvents.length > 0
        ? `\n   ${todayEvents.map(showEventWithTime).join('\n')}`
        : `Nada 😎`) + '\n\n'

    const tomorrowEventsFormatted = `Para amanhã: ` + (tomorrowEvents.length > 0
        ? `\n   ${tomorrowEvents.map(showEventWithTime).join('\n')}`
        : `Nada 😎`)

    // const lastChoreList: { type: string, timestamp: number }[] = await ChoreService.lastChoreExecution()
    // const lastChoresParsed = lastChoreList
    //     .map(choreExecution => {
    //         const chore = choreList.find(chore => chore.type === choreExecution.type)!
    //         return { chore, lastExecution: moment(choreExecution.timestamp) }
    //     })
    //     .filter(choreExecution => {
    //         console.log(choreExecution.chore.title + '  -  ' + choreExecution.lastExecution.diff(moment(), 'days'))

    //         return choreExecution.lastExecution.diff(moment(), 'days') > -1
    //     })



    return todayEventsFormatted + tomorrowEventsFormatted
}

export async function showOverview(ctx: Context<Update>) {
    try {
        await ctx.reply(await createOverview())
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo fazer o resumo de hoje...')
    }

    return '/'
}

export async function registerChore(ctx: Context<Update>, chore: Chore) {

    const choreExecution = new ChoreModel({
        actor: ctx.from!.first_name,
        type: chore.type,
        timestamp: Date.now(),
    })
    choreExecution.isNew = true

    try {
        await choreExecution.save()
        await ctx.replyWithSticker(Stickers.ConcernedFroge_thumbs)
        await ctx.reply('Anotado!')
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Alguma coisa deu errado...')
    }

    return '/'
}


export async function listChoreExecution(ctx: Context<Update>, chore: Chore) {

    try {
        const choreExecutions: ChoreExecution[] = await choreCollection.find({ type: chore.type })
        const response = choreExecutions.map(chore => {
            const timestamp = moment(chore.timestamp).format('YYYY-MM-DD HH:mm')
            return `${chore.actor} - ${timestamp} `
        }).join('\n')

        if (response) await ctx.reply(response)
        else await ctx.reply('Isso nunca foi feito!')
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply(`Não consigo ver quem ${chore.past}...`)
    }

    return '/'
}