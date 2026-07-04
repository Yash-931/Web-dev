import { PrismaClient } from "../generated/prisma/client";

const client = new PrismaClient({} as any);

async function createUser() {
    await client.user.create({
        data: {
            username: "Yash",
            password: "1234",
            age: 21
        }
    })
}

createUser();