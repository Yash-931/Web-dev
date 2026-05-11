const express = require("express");
const { Pool } = require("pg");
const z = require("zod");
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.NEON_DB,
});

const app = express();
app.use(express.json())


const SignupSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    emal: z.email()
})


app.post("/signup", async (req, res) => {

    const { data, success, error } = SignupSchema.safeParse(req.body);

    if(!success){
        res.status(403).json({
            message: "Incorrect inputs",
            error: JSON.parse(error)
        })
        return;
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    //prone to SQL injection so do not use this
    // await pool.query(`INSERT INTO users (username, emal, password) VALUES ('${username}', '${email}', '${password}')`);


    //instead use this
    await pool.query('INSERT INTO users (username, emal, password) VALUES ($1, $2, $3)', 
        [username, email, password]
    )

    res.json({
        message: "Signup successful"
    })

})

app.post("/signin", (req, res) => {

})


app.listen(3000);