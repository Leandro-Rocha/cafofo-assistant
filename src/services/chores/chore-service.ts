import moment from 'moment'
import { ChoreExecution } from '../../modules/orm/entities/ChoreExecution.entity'

export namespace ChoreService {
    export async function lastChoreExecutions(): Promise<ChoreExecution[]> {
        const ids = await ChoreExecution.createQueryBuilder().select('MAX(id)', 'ids').groupBy('choreId').getRawMany()

        return await ChoreExecution.findByIds(
            ids.map((row) => row.ids),
            { relations: ['user', 'chore'] },
        )
    }

    export async function overdueChores() {
        const lastExecutions = await lastChoreExecutions()

        return lastExecutions.filter((execution) => {
            const alarm = execution.chore.alarm
            const executionTime = moment(Number(execution.timestamp))
            const daysSince = moment().diff(executionTime, 'days')
            return daysSince > alarm
        })
    }
}
