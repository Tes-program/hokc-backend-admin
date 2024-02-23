import type { Knex } from "knex";


const tableName = 'password_reset';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email').notNullable();
        table.string('token').notNullable();
        table.timestamp('expires_at').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
}

