import z from 'zod'

export const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateAvatatSchema = z.object({
    name: z.string(),
    imageUrl: z.string()
})