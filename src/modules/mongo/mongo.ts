import mongoose, { model, Schema } from 'mongoose'
import { requireEnv } from '../../core/util'
import { ChoreExecution, ChoreType } from '../../services/chores/interfaces'

const MONGO_URL = requireEnv('MONGO_URL')
const dbName = 'cafofo' + (process.env.DEBUG ? '_test' : '')

console.debug('Starting Mongo client')

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.info('Mongo client started'))


const choreSchema = new Schema<ChoreExecution>({
    actor: { type: String, required: true },
    type: { type: ChoreType, required: true },
    timestamp: { type: Number, required: true }
})

export const ChoreModel = model<ChoreExecution>('tarefas', choreSchema);
export const choreCollection = model('tarefas', choreSchema)