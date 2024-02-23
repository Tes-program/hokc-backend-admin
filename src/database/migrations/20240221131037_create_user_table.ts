import type { Knex } from "knex";

const tableName = 'users';
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.enum('role', ['admin', 'user']).defaultTo('user');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('matric_number', 7).notNullable().unique();
        table.string('phone_number').notNullable().unique();
        table.string('hall_of_residence').notNullable();
        table.enum('gender', ['male', 'female', 'others']).defaultTo('others');
        table.string('department').notNullable();
        table.date('date_of_birth').notNullable();
        table.string('profile_picture')
    })

    // Create index for user table
    await knex.schema.raw(`
        CREATE INDEX IF NOT EXISTS users_email_index ON users(email);
        CREATE INDEX IF NOT EXISTS users_matric_number_index ON users(matric_number);
        CREATE INDEX IF NOT EXISTS users_phone_number_index ON users(phone_number);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
    await knex.schema.raw(`
        DROP INDEX IF EXISTS users_email_index;
        DROP INDEX IF EXISTS users_matric_number_index;
        DROP INDEX IF EXISTS users_phone_number_index;
    `)
}

