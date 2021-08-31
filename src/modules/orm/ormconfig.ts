import { ConnectionOptions } from 'typeorm'
import { requireEnv } from '../../core/util'

export const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT')),
    username: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],

    synchronize: true,
    migrationsRun: false,

    // logging: true,
    logger: 'advanced-console',

    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/database/migrations'
    }
}
