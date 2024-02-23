import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

const tableName = "password_reset";

const createToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
}

const createPasswordReset = (id: number) => {
    return {
        email: faker.internet.email(),
        token: createToken(id),
        expires_at: faker.date.future(),
    };
}

// const uuid = faker.string.uuid();


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(tableName).del();

    const passwordResets = Array.from({ length: 10 }, (_, index) => createPasswordReset(index + 1));

    // Inserts seed entries
    await knex(tableName).insert([
        ...passwordResets,
    ]);
}
