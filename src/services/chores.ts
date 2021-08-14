import axios from "axios"
import { MissingEnvironmentProperty } from "../core/exceptions"

if (!process.env.CHORES_SERVICE_ADDRESS)
    throw new MissingEnvironmentProperty('CHORES_SERVICE_ADDRESS')
const CHORES_SERVICE_ADDRESS = process.env.CHORES_SERVICE_ADDRESS

export interface Chore {
    actor: string,
    type: ChoreType,
    timestamp: number
}

export enum ChoreType {
    DISHES = 'dishes'
}


export async function registerChore(chore: Chore) {
    await axios.post(CHORES_SERVICE_ADDRESS + '/tarefas', chore)
}


export async function listChores(type: ChoreType) {
    const choresCallRaw = await axios.get(CHORES_SERVICE_ADDRESS + `/chores/${type}`)
    return choresCallRaw.data
}

export async function lastChoreExecution(type: ChoreType) {
    const choresCallRaw = await axios.get(CHORES_SERVICE_ADDRESS + `/chores/${type}/last`, { params: { type } })
    return choresCallRaw.data
}


