import dotenv from "dotenv";
import * as process from "process";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { Knex } from "knex";

dotenv.config();

const tableName = "users";
const userPassword = process.env.USER_PASSWORD as string;

export async function seed(knex: Knex): Promise<void> {
    await knex(tableName).del();
    // A function that retunn random courses from an array of courses
    // const randomCourses = (courses: string[]) => {
    //     const randomIndex = Math.floor(Math.random() * courses.length);
    //     return courses[randomIndex];
    // };
    const hashPassword: string = await bcrypt.hash(userPassword, 10);
    const users = Array.from({ length: 10 }, () => ({
        email: faker.internet.email(),
        password: hashPassword,
        role: "user",
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        matric_number: faker.string.alphanumeric(7),
        phone_number: faker.phone.number(),
        hall_of_residence: faker.location.city(),
        gender: faker.person.sex(),
        department: faker.helpers.arrayElement(["Computer Science","Information Technology", "Physics", "Mathematics"]),
        date_of_birth: faker.date.past(),
        profile_picture: faker.image.avatar(),
    }));

            // Inserts seed entries

    await knex(tableName).insert(users);

}
