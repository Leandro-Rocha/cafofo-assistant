import { Scenes, session, Telegraf } from "telegraf"
import { CafofoContext } from "../telegram-bot"
import { choreWizard } from "./chore-scene"
import { mainWizard } from "./main-scene"
import { userRegisterWizard } from "./welcome-scene"

export function loadScenes(bot: Telegraf<CafofoContext>) {

    console.debug(`Loading scenes...`)

    bot.use(session())
    const stage = new Scenes.Stage<CafofoContext>([mainWizard, userRegisterWizard, choreWizard], { default: 'main' })
    bot.use(stage.middleware())
}