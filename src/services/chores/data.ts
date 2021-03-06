import { Chore, ChoreType } from './interfaces'

export const choreList: Chore[] = [
    { title: 'Louça', type: ChoreType.DISHES, action: 'lavar a louça', past: 'lavou a louça', alarm: 2 },
    { title: 'Banheiro Azul', type: ChoreType.TOILET_BLUE, action: 'limpar o banheiro azul', past: 'limpou o banheiro azul', alarm: 15 },
    { title: 'Banheiro Amarelo', type: ChoreType.TOILET_YELLOW, action: 'limpar o banheiro amarelo', past: 'limpou o banheiro amarelo', alarm: 10 },
    { title: 'Varanda', type: ChoreType.VARANDA, action: 'limpar a varanda', past: 'limpou a varanda', alarm: 15 },
    { title: 'Fogão', type: ChoreType.COZINHA_FOGAO, action: 'limpar o fogão', past: 'limpou o fogão', alarm: 15 },
    { title: 'Micro', type: ChoreType.MICRO, action: 'limpar o micro-ondas', past: 'limpou o micro-ondas', alarm: 7 },
    { title: 'Gavetas', type: ChoreType.COZINHA_GAVETAS, action: 'limpar as gavetas da cozinha', past: 'limpou as gavetas da cozinha', alarm: 30 },
    { title: 'Lixo da Cozinha', type: ChoreType.COZINHA_LIXO, action: 'limpar o lixo da cozinha', past: 'limpou o lixo da cozinha', alarm: 30 },
    { title: 'Janela Quartinho', type: ChoreType.JANELA_QUARTINHO, action: 'limpar a janela do quartinho', past: 'limpou a janela do quartinho', alarm: 30 },
    { title: 'Janela Escritório', type: ChoreType.JANELA_ESCRITORIO, action: 'limpar a janela do escritório', past: 'limpou a janela do escritório', alarm: 30 },
    { title: 'Janela Suíte', type: ChoreType.JANELA_SUITE, action: 'limpar a janela da suíte', past: 'limpou a janela da suíte', alarm: 30 },
    { title: 'Rack', type: ChoreType.RACK, action: 'tirar pó do rack da sala', past: 'tirou pó do rack da sala', alarm: 7 },
    { title: 'Aspirar', type: ChoreType.ASPIRAR, action: 'aspirar a casa', past: 'aspirou a casa', alarm: 3 },
]
