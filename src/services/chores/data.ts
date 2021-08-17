import { Chore, ChoreType } from "./interfaces";

export const choreList: Chore[] = [
    { title: 'Louça', type: ChoreType.DISHES, action: 'lavar a louça', past: 'lavou a louça', alarm: 2 },
    { title: 'Banheiro Azul', type: ChoreType.TOILET_BLUE, action: 'limpar o banheiro azul', past: 'limpou o banheiro azul', alarm: 15 },
    { title: 'Banheiro Amarelo', type: ChoreType.TOILET_YELLOW, action: 'limpar o banheiro amarelo', past: 'limpou o banheiro amarelo', alarm: 7 },
    { title: 'Varanda', type: ChoreType.VARANDA, action: 'limpar a varanda', past: 'limpou a varanda', alarm: 15 },
]