import { Composer, Scenes } from "telegraf";
import { User } from "../../orm/entities/User.entity";
import { CafofoContext } from "../telegram-bot";
import { createMainMenu } from "../telegram-menu";
import { userRegisterWizard } from "./welcome-scene";

const stepHandler = new Composer<CafofoContext>()
stepHandler.use(async (ctx, next) => {
    if (ctx.scene.current === userRegisterWizard) return

    const cffUser = await User.findOne({ telegramChatId: ctx.from?.id })


    if (cffUser) {
        ctx.cffUser = cffUser
        next()
    }
    else {
        console.debug(`User not found!`)
        await ctx.scene.enter('user-register')
    }
})

const menuMiddleware = createMainMenu();
stepHandler.use(menuMiddleware)
stepHandler.start(ctx => menuMiddleware.replyToContext(ctx))
stepHandler.command('menu', ctx => menuMiddleware.replyToContext(ctx))

export const mainWizard = new Scenes.WizardScene(
    'main',
    stepHandler,
)
