import axios from "axios"
import { MissingEnvironmentProperty } from "../../core/exceptions"
import { ChoreExecution, ChoreType } from "./interfaces"

if (!process.env.CHORES_SERVICE_ADDRESS) throw new MissingEnvironmentProperty('CHORES_SERVICE_ADDRESS')
const CHORES_SERVICE_ADDRESS = process.env.CHORES_SERVICE_ADDRESS

export async function registerChoreExecution(chore: ChoreExecution) {
    await axios.post(CHORES_SERVICE_ADDRESS + '/chores', chore)
}

export async function listChores(type: ChoreType) {
    const choresCallRaw = await axios.get(CHORES_SERVICE_ADDRESS + `/chores/${type}`)
    return choresCallRaw.data
}

export async function lastChoreExecution() {
    const choresCallRaw = await axios.get(CHORES_SERVICE_ADDRESS + `/chores/all/last`)
    const lastChoresParsed = choresCallRaw.data.map((raw: { _id: string, timestamp: number }) => { return { type: raw._id, timestamp: raw.timestamp, } })
    return lastChoresParsed
}


