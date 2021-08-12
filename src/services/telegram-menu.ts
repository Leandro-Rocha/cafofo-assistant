import { Context } from 'telegraf'
import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu'
import { Update } from 'telegraf/typings/core/types/typegram'
import { Actions } from './actions'

export namespace BotMenu {
    export function createMainMenu() {
        const menuTemplate = new MenuTemplate<Context<Update>>(ctx => `Olá ${ctx.from?.first_name}!\nComo posso ajudar?`)

        menuTemplate.interact('Agenda', 'agenda', { do: Actions.showAgenda })
        menuTemplate.submenu('Tarefas', 'tarefas', createTarefasMenu())

        return menuTemplate
    }


    function createTarefasMenu() {
        const submenuTarefas = new MenuTemplate<any>(() => `Selecione uma tarefa`)

        submenuTarefas.manualRow(createBackMainMenuButtons('Voltar', 'Menu principal'))

        submenuTarefas.submenu('Louça', 'louca', createLoucaMenu())

        submenuTarefas.interact('Banheiros', 'banheiros', {
            do: async ctx => {
                await ctx.reply('Vai lavar banheiro!!')
                return '.'
            }
        })

        return submenuTarefas
    }

    function createLoucaMenu() {
        const submenuLouca = new MenuTemplate<any>(() => `Louça:`)

        submenuLouca.manualRow(createBackMainMenuButtons('Voltar', 'Menu principal'))
        submenuLouca.interact('Quem lavou por último?', 'last_louca', { do: Actions.lastLouca })
        submenuLouca.interact('Lavei agora!', 'register_louca', { do: Actions.registerLouca })

        return submenuLouca
    }
}









