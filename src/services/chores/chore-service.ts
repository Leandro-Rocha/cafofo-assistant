import { choreCollection } from "../../modules/mongo/mongo";
import { ChoreExecution } from "./interfaces";


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
}