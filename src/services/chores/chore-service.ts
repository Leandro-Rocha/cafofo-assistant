import moment from "moment";
import { choreCollection } from "../../modules/mongo/mongo";
import { choreList } from "./data";
import { Chore, ChoreExecution } from "./interfaces";


export namespace ChoreService {

    export async function lastChoreExecutions(): Promise<ChoreExecution[]> {
        return await choreCollection.aggregate([{
            $sort: {
                timestamp: 1,
            }
        }, {
            $group: {
                _id: '$type',
                actor: { $last: "$actor" },
                type: { $last: "$type" },
                timestamp: { $last: "$timestamp" },
            }
        }])
    }

    export async function overdueChores(): Promise<{ chore: Chore; lastExecution?: ChoreExecution | undefined; }[]> {
        let overdueChores: { chore: Chore, lastExecution?: ChoreExecution }[] = []
        const lastExecutions = await lastChoreExecutions()

        choreList.forEach(chore => {
            const lastExecution = lastExecutions.find(execution => execution.type === chore.type)

            if (!lastExecution || moment().diff(moment(lastExecution.timestamp), 'days') > chore.alarm)
                overdueChores.push({ chore, lastExecution: (lastExecution ? lastExecution : undefined) })
        })

        return overdueChores
    }
}