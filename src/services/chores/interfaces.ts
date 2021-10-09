export interface Chore {
    title: string
    type: ChoreType
    action: string
    past: string
    alarm: number
}

export interface ChoreExecution {
    actor: string
    type: ChoreType
    timestamp: number
}

export enum Rooms {
    COZINHA = 'COZINHA',
    SALA = 'SALA',
    QUARTINHO = 'QUARTINHO',
    SUITE = 'SUITE',
    ESCRITORIO = 'ESCRITORIO',
    BANHEIRO_AZUL = 'BANHEIRO_AZUL',
    BANHEIRO_AMARELO = 'BANHEIRO_AMARELO',
}

export enum Actions {
    LIMPAR = 'LIMPAR',
    LAVAR = 'LAVAR',
    ASPIRAR = 'ASPIRAR',
    TIRAR_PO = 'TIRAR_PO',
}

export class ActionMap {
    LIMPAR = { present: 'limpar', past: 'limpou' }
    LAVAR = { present: 'lavar', past: 'lavou' }
    ASPIRAR = { present: 'aspirar', past: 'aspirou' }
    TIRAR_PO = { present: 'tirar pó', past: 'tirou pó' }
}

export enum ChoreType {
    ASPIRAR = 'ASPIRAR',
    COZINHA_FOGAO = 'COZINHA_FOGAO',
    COZINHA_GAVETAS = 'COZINHA_GAVETAS',
    COZINHA_LIXO = 'COZINHA_LIXO',
    DISHES = 'dishes',
    JANELA_ESCRITORIO = 'JANELA_ESCRITORIO',
    JANELA_QUARTINHO = 'JANELA_QUARTINHO',
    JANELA_SUITE = 'JANELA_SUITE',
    MICRO = 'MICRO',
    RACK = 'RACK',
    TOILET_BLUE = 'toilet_blue',
    TOILET_YELLOW = 'toilet_yellow',
    VARANDA = 'balcony',
}
