import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const client = new PrismaClient({
    adapter: adapter
})

async function createStock() {
    await client.stock.createMany({
        data: [{
            title: "AXIS BANK",
            symbol: "AXIS",
        },
        {
            title: "HDFC BANK",
            symbol: "HDFC"
        },
        {
            title: "TATA STEEL",
            symbol: "TATA"
        }
    ]
    })
}

createStock();