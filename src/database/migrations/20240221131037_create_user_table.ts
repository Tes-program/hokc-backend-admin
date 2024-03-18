import type { Knex } from "knex";

const tableName = 'users';
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('phone_number').notNullable().unique();
        table.enum('role', ['admin', 'user']).defaultTo('user');
        table.boolean('is_verified').defaultTo(false);
    })    

    await knex.schema.raw(`
        CREATE INDEX IF NOT EXISTS users_email_index ON users(email);
        CREATE INDEX IF NOT EXISTS users_phone_number_index ON users(phone_number);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
    await knex.schema.raw(`
        DROP INDEX IF EXISTS users_email_index;
        DROP INDEX IF EXISTS users_phone_number_index;
    `)
}

