import { Context, Telegraf } from 'telegraf'
import { createBackMainMenuButtons, MenuMiddleware, MenuTemplate } from 'telegraf-inline-menu'
import { Update } from 'telegraf/typings/core/types/typegram'
import * as Actions from './actions'

export function createMainMenu(bot: Telegraf) {
    const menuTemplate = new MenuTemplate<Context<Update>>(ctx => `Olá ${ctx.from?.first_name}!\nComo posso ajudar?`)

    menuTemplate.interact('Agenda', 'agenda', { do: Actions.showAgenda })
    menuTemplate.submenu('Tarefas', 'tarefas', createTarefasMenu())

    const menuMiddleware = new MenuMiddleware('/', menuTemplate)
    bot.start(ctx => menuMiddleware.replyToContext(ctx))
    bot.command('menu', ctx => menuMiddleware.replyToContext(ctx))
    bot.use(menuMiddleware)

    return menuTemplate
}


function createTarefasMenu() {
    const submenuTarefas = new MenuTemplate<any>(() => `Selecione uma tarefa`)

    submenuTarefas.manualRow(createBackMainMenuButtons('Voltar', 'Menu principal'))
    submenuTarefas.submenu('Louça', 'louca', createLoucaMenu())

    return submenuTarefas
}

function createLoucaMenu() {
    const submenuLouca = new MenuTemplate<any>(() => `Louça:`)

    submenuLouca.manualRow(createBackMainMenuButtons('Voltar', 'Menu principal'))
    submenuLouca.interact('Quem lavou por último?', 'last_louca', { do: Actions.lastLouca })
    submenuLouca.interact('Lavei agora!', 'register_louca', { do: Actions.registerDishes })

    return submenuLouca
}









