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

export enum ChoreType {
    DISHES = 'dishes',
    TOILET_BLUE = 'toilet_blue',
    TOILET_YELLOW = 'toilet_yellow',
    VARANDA = 'balcony',
    COZINHA_FOGAO = 'COZINHA_FOGAO',
    COZINHA_GAVETAS = 'COZINHA_GAVETAS',
    COZINHA_LIXO = 'COZINHA_LIXO',
    MICRO = 'MICRO',
}
