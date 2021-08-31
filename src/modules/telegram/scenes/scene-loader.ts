import { Scenes, session, Telegraf } from "telegraf"
import { CafofoContext } from "../telegram-bot"
import { mainWizard } from "./main-scene"
import { userRegisterWizard } from "./welcome-scene"

export function loadScenes(bot: Telegraf<CafofoContext>) {

    console.debug(`Loading scenes...`)
    const stage = new Scenes.Stage<CafofoContext>([userRegisterWizard, mainWizard], { default: 'main' })
    bot.use(session())
    bot.use(stage.middleware())
}