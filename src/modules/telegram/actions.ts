import moment from "moment";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import * as Calendar from "../../services/calendar/calendar";
import { showEventWithTime } from "../../services/calendar/calendar";
import { ChoreService } from "../../services/chores/chore-service";
import { choreList } from "../../services/chores/data";
import { Chore, ChoreExecution } from "../../services/chores/interfaces";
import { miguelFacts } from "../../services/miguel/miguel";
import { choreCollection, ChoreModel } from "../mongo/mongo";
import { Stickers } from "./stickers";

export async function showCalendar(ctx: Context<Update>, maxResults = 10) {
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
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo acessar a agenda...')
    }

    return '/'
}

export async function lastChores(ctx: Context<Update>) {
    try {
        let response = ''
        const lastExecutions = await ChoreService.lastChoreExecutions()

        choreList.forEach(chore => {
            const lastExecution = lastExecutions.find(execution => execution.type === chore.type)

            if (lastExecution) {
                response += `${chore.title} - ${moment(lastExecution.timestamp).fromNow()} por ${lastExecution.actor}\n`
            }
            else {
                response += `Ninguém nunca ${chore.past} 😳\n`
            }
        })

        console.log(await ChoreService.overdueChores())


        await ctx.reply(response)
    }
    catch (err) {
        console.error(err);
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

        overdueChores.forEach(overdueChore => {

            if (overdueChore.lastExecution) {
                overdueChoresText += `${overdueChore.chore.title} - ${moment(overdueChore.lastExecution.timestamp).fromNow()} por ${overdueChore.lastExecution.actor}\n`
            }
            else {
                overdueChoresText += `Ninguém nunca ${overdueChore.chore.past} 😳\n`
            }
        })
        await ctx.reply(overdueChoresText)
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