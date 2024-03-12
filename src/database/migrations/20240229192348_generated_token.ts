import type { Knex } from "knex";

const tableName = 'generated_token';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('token').notNullable();
        table.enum('type', ['REFRESH', 'PASSWORD_RESET', 'ACCESS']).notNullable();
        table.boolean('is_revoked').defaultTo(false);
        table.timestamp('expires_at').notNullable();
    })


    await knex.raw(`
        CREATE OR REPLACE FUNCTION delete_expired_token()
        RETURNS TRIGGER AS $$
        BEGIN
            DELETE FROM generated_token WHERE expires_at < NOW();
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await knex.raw(`
        CREATE TRIGGER delete_expired_token
        AFTER INSERT ON generated_token
        EXECUTE FUNCTION delete_expired_token();
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table(tableName, (table) => {
        table.dropForeign('user_id');
    });
    await knex.raw('DROP TRIGGER IF EXISTS delete_expired_token ON generated_token CASCADE');
    await knex.raw('DROP FUNCTION IF EXISTS delete_expired_token() CASCADE');
    await knex.schema.dropTable(tableName);
}

