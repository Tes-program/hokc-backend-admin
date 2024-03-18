import type { Knex } from "knex";


const tableName = 'otp_verification';
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('otp').notNullable();
        table.boolean('is_used').defaultTo(false);
        table.timestamp('expires_at').defaultTo(knex.fn.now());
    })

    await knex.schema.raw(`
        CREATE INDEX IF NOT EXISTS otp_verification_user_id_index ON otp_verification(user_id);
    `)

    await knex.schema.raw(`
        CREATE OR REPLACE FUNCTION delete_expired_otp()
        RETURNS TRIGGER AS $$
        BEGIN
            DELETE FROM otp_verification WHERE expires_at < NOW();
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await knex.schema.raw(`
        CREATE TRIGGER delete_expired_otp
        AFTER INSERT OR UPDATE ON otp_verification
        EXECUTE FUNCTION delete_expired_otp();
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
    await knex.schema.raw(`
        DROP INDEX IF EXISTS otp_verification_user_id_index;
    `)
    await knex.schema.raw(`
        DROP TRIGGER IF EXISTS delete_expired_otp ON otp_verification;
    `)
    await knex.schema.raw(`
        DROP FUNCTION IF EXISTS delete_expired_otp;
    `)
}

