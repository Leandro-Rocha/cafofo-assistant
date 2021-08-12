import axios from "axios";
import moment from "moment";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { Calendar } from "./calendar";

export namespace Actions {

    export async function showAgenda(ctx: Context<Update>) {
        await ctx.reply(await Calendar.events())
        return '/'
    }

    export async function lastLouca(ctx: Context<Update>) {
        const lastLoucaRaw = await (await axios.get('http://localhost:21992/lastLouca')).data
        const date = moment(lastLoucaRaw.timestamp).format('YYYY-MM-DD')
        const time = moment(lastLoucaRaw.timestamp).format('HH:mm')

        await ctx.reply(`Quem lavou a louça por último foi ${lastLoucaRaw.actor} em ${date} às ${time}`)

        return '/'
    }

    export async function registerLouca(ctx: Context<Update>) {

        await axios.post('http://localhost:21992/tarefas', { actor: ctx.from?.first_name, type: 'louca', timestamp: Date.now() })
            .then(async () => {
                await ctx.replyWithSticker('CAACAgIAAxkBAAICY2EVXnTFg1FhMsIHvAtZfVoCPRQkAAJfAAPBnGAMLpRna9tNe9QgBA')
                await ctx.reply('Anotado!')
            })
            .catch(async () => {
                await ctx.reply('Alguma coisa deu errada! 😖')
            })

        return '/'
    }
}