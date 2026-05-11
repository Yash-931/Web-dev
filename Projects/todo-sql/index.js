const express = require("express");
const { Pool } = require("pg");
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.NEON_DB,
});

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {
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