import type { Knex } from "knex";


const tableName = 'users_information';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone_number').notNullable();
        table.string('matric_number', 7).notNullable().unique();
        table.string('hall_of_residence').notNullable();
        table.enum('gender', ['male', 'female', 'others']).defaultTo('others');
        table.string('department').notNullable();
        table.date('date_of_birth').notNullable();
        table.string('profile_picture')
    })

    await knex.schema.raw(`
        CREATE INDEX IF NOT EXISTS users_matric_number_index ON users_information(matric_number);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
    await knex.schema.raw(`
        DROP INDEX IF EXISTS users_matric_number_index;
    `)
}

