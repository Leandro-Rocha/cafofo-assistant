import moment from "moment";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { Calendar } from "../services/calendar";
import * as Chores from "../services/chores";
import { Stickers } from "./stickers";


export async function showAgenda(ctx: Context<Update>) {
    try {
        await ctx.reply(await Calendar.events())
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo acessar a agenda...')
    }

    return '/'
}

export async function lastLouca(ctx: Context<Update>) {

    try {
        const lastDishes = await Chores.lastChoreExecution(Chores.ChoreType.DISHES);
        if (lastDishes) {
            const date = moment(lastDishes.timestamp).format('YYYY-MM-DD')
            const time = moment(lastDishes.timestamp).format('HH:mm')
            await ctx.reply(`Quem lavou a louça por último foi ${lastDishes.actor} em ${date} às ${time}`)
        }
        else {
            await ctx.replyWithSticker(Stickers.StarPatrick_shock)
            await ctx.reply('A louça nunca foi lavada!')
        }
    }
    catch (err) {
        console.error(err);
        await ctx.replyWithSticker(Stickers.Buddy_Bear_sad)
        await ctx.reply('Não consigo ver quem lavou a louça por último...')
    }

    return '/'
}

export async function registerDishes(ctx: Context<Update>) {

    const chore = {
        actor: ctx.from!.first_name,
        type: Chores.ChoreType.DISHES,
        timestamp: Date.now()
    }

    try {
        await Chores.registerChore(chore)
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