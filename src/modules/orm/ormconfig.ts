import { requireProperty } from 'profile-env'
import { ConnectionOptions } from 'typeorm'

export const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host: requireProperty('DB_HOST'),
    port: Number(requireProperty('DB_PORT')),
    username: requireProperty('DB_USER'),
    password: requireProperty('DB_PASSWORD'),
    database: requireProperty('DB_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],

    synchronize: true,
    migrationsRun: false,

    // logging: true,
    logger: 'advanced-console',

    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/database/migrations',
    },
}
