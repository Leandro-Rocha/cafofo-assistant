import * as fs from 'fs';
import { Composer, Markup, Scenes } from "telegraf";
import { list, search } from "../../cafofo-flix/ondebaixa";
import { Stickers } from "../stickers";
import { CafofoContext } from "../telegram-bot";

const stepHandler = new Composer<CafofoContext>()

export const cafofoFlixWizard = new Scenes.WizardScene(
    'cafofo-flix',
    async (ctx) => {
        console.debug(`Entered [cafofo-flix]`)

        await ctx.reply('O que você quer assistir?', Markup.keyboard(['Voltar']).resize())

        ctx.wizard.next()
    },
    async (ctx) => {
        const answer: string = (<any>ctx.message)?.text

        if (answer === 'Voltar') {
            await ctx.scene.enter('main')
            return
        }

        const results = await search(answer)

        if (results.length === 0) {
            await ctx.reply(`Não encontrei nenhum resultado...`)
            return await ctx.scene.enter('cafofo-flix')
        }

        await ctx.reply(
            `Achei esses resultados`,
            Markup.inlineKeyboard([
                ...results.map(result => Markup.button.switchToCurrentChat(`${result.title}`, `/list ${result.url}`))
            ], { columns: 1 })
        )

        ctx.wizard.next()
    },
    async (ctx) => {

        const rawAnswer: string = (<any>ctx.message)?.text
        const answer = rawAnswer.substring(rawAnswer.indexOf('/list') + 6)

        if (answer === 'Voltar') {
            await ctx.scene.enter('main')
            return
        }

        const results = await list(answer)

        if (results.length === 0) {
            await ctx.reply(`Não encontrei nenhum resultado...`)
            return await ctx.scene.enter('cafofo-flix')
        }

        await ctx.reply(
            `Achei esses resultados`,
            Markup.inlineKeyboard([
                ...results.map(result => Markup.button.switchToCurrentChat(`${result.title}`, `/download ${result.url}`))
            ], { columns: 1 })
        )

        ctx.wizard.next()
    }, async (ctx) => {

        const rawAnswer: string = (<any>ctx.message)?.text
        const magnet = rawAnswer.substring(rawAnswer.indexOf('/download') + 10)

        if (magnet === 'Voltar') {
            await ctx.scene.enter('main')
            return
        }

        fs.writeFileSync(`./${Math.random()}.magnet`, magnet)
        await ctx.reply('Aye, aye, captain')
        await ctx.replyWithSticker(Stickers.JackTheParrot_wink)

        await ctx.scene.enter('main')
    },
    stepHandler
)

