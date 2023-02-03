// Update with your config settings.
require("dotenv").config({path: __dirname + '/.env' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
        client: 'postgresql',
        connection: process.env.DB_CONNECTION,
        // seeds: {
        //     directory: './db/seeds'
        // }
    },

    staging: {
        client: 'postgresql',
        connection: {
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DATABASE,
            user: process.env.DATABASE,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        // seeds: {
        //     directory: './db/seeds'
        // }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: process.env.DATABASE,
            user: process.env.DATABASE,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        // seeds: {
        //     directory: './db/seeds'
        // }
    }

};
