import mongoose, { model, Schema } from 'mongoose'
import { requireProperty } from 'profile-env'
import { ChoreExecution, ChoreType } from '../../services/chores/interfaces'

const MONGO_URL = requireProperty('MONGO_URL')
const dbName = requireProperty('DB_DATABASE')

console.debug(`Starting Mongo client [${dbName}]`)

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