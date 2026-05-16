import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const client = new PrismaClient({
    adapter: adapter
})

async function createUser() {
    await client.user.create({
        data: {
            username: "gg",
            password: "gg",
            age: 21,
            todos: {
                create: {
                    description: "go to gym",
                    title: "GYM",
                    done: false
                }
            }
        }
    })
}

createUser();