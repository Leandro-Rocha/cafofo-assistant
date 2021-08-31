import { Context } from 'telegraf'
import { createBackMainMenuButtons, MenuMiddleware, MenuTemplate } from 'telegraf-inline-menu'
import { ConstOrPromise } from 'telegraf-inline-menu/dist/source/generic-types'
import { MenuLike } from 'telegraf-inline-menu/dist/source/menu-like'
import { Update } from 'telegraf/typings/core/types/typegram'
import { choreList } from '../../services/chores/data'
import { Chore } from '../../services/chores/interfaces'
import * as Actions from './actions'
import { CafofoContext } from './telegram-bot'


export function createMainMenu() {
    const menuTemplate = new MenuTemplate<CafofoContext>(ctx => `Olá ${ctx.cffUser?.nickname}!\nComo posso ajudar?`)

    menuTemplate.interact('Agenda', 'calendar', { do: (ctx) => Actions.showCalendar(ctx) })
    menuTemplate.interact('Resumo', 'overview', { do: Actions.showOverview })
    menuTemplate.interact('Últimas Tarefas', 'last_chores', { do: Actions.lastChores })
    menuTemplate.submenu('Registrar tarefa', 'register_chore', chooseChoresMenu({ targetSubmenu: registerChoreConfirm() }))
    menuTemplate.submenu('Ver tarefa', 'view_chore', chooseChoresMenu({ action: Actions.listChoreExecution }))

    const menuMiddleware = new MenuMiddleware('/', menuTemplate)
    return menuMiddleware
}

function createBackMainButtons() {
    return createBackMainMenuButtons('Voltar', 'Menu principal');
}

function registerChoreConfirm() {
    const registerChoreConfirmMenu = new MenuTemplate<any>((ctx) => {
        const actor = ctx.from.first_name
        const chore = findChoreFromChoice(ctx)
        return `Confirma que ${actor} ${chore.past}?`
    })

    registerChoreConfirmMenu.interact('Sim', 'yes', {
        do: ctx => {
            const chore = findChoreFromChoice(ctx)
            return Actions.registerChore(ctx, chore)
        }
    })
    registerChoreConfirmMenu.interact('Não', 'no', { do: () => { return '/' } })

    return registerChoreConfirmMenu
}

function chooseChoresMenu(target: { targetSubmenu?: MenuLike<any>, action?: (ctx: Context<Update>, chore: Chore) => ConstOrPromise<string | boolean> }) {
    const chooseChore = new MenuTemplate<Context<Update>>(() => `Qual tarefa?`)
    chooseChore.manualRow(createBackMainButtons())

    if (target.targetSubmenu)
        chooseChore.chooseIntoSubmenu('chore_choose', choreList.map(chore => chore.title), target.targetSubmenu, { columns: 2 })

    if (target.action)
        chooseChore.choose('chore_choose', choreList.map(chore => chore.title), {
            do: (ctx) => {
                const chore = findChoreFromChoice(ctx)
                return target.action!(ctx, chore)
            },
            columns: 2
        })

    return chooseChore
}

function findChoreFromChoice(ctx: any) {
    const choice = ctx.match[1]
    const chore = choreList.find(chore => chore.title === choice)
    if (!chore) throw 'Cannot find chore'
    return chore
}









