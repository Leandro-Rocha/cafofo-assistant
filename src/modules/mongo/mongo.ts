import mongoose, { Schema } from 'mongoose'
import { MissingEnvironmentProperty } from '../../core/exceptions'
import { ChoreExecution, ChoreType } from '../../services/chores/interfaces'

if (!process.env.MONGO_URL) throw new MissingEnvironmentProperty('MONGO_URL')
const MONGO_URL = process.env.MONGO_URL
const dbName = 'cafofo'

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

const choreCollection = mongoose.model('tarefas', choreSchema)

async function test() {
    const newLocal = await choreCollection.findOne({ timestamp: 1628789609897 })
    console.log(newLocal)
}

test()
