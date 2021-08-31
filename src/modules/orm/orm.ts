import { createConnection } from "typeorm";


export namespace DB {

    export async function init() {
        console.debug('Creating DB connection')
        const connection = await createConnection();

        process.once('SIGINT', async () => {
            console.debug('Closing DB connection')
            await connection.close()
        })
        process.once('SIGTERM', async () => {
            console.debug('Closing DB connection')
            await connection.close()
        })
    }
}

