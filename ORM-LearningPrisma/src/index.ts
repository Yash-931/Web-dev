import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const client = new PrismaClient({
    adapter: adapter
});


async function createUser() {
    await client.user.create({
        data: {
            username: "Yash",
            password: "123",
            age: 21
        }
    })
}

createUser();