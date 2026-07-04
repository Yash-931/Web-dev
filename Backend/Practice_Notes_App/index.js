const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json())

const notes = [];
const users = [];

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find( (user) => user.username === username);
    if(userExists){
        return res.status(403).json({
            message: "User already exists"
        })
    }

    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "You have signed up"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find( (user) => user.username === username && user.password === password);
    if(!userExists){
        return res.status(403).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        username: username,
    }, "yash1212");

    res.json({
        token: token
    })


})

app.post("/notes" , (req, res) => {

    const token = req.headers.token;
    if(!token){
        res.status(403).json({
            message: "You are not logged in"
        });
        return;
    }

    const decode = jwt.verify(token , "yash1212");
    const username = decode.username

    if(!username){
        return res.status(403).json({
            message: "Malformed token"
        })
    }

    const note = req.body.note;
    notes.push({note, username});
    res.json({
        message: "Note added",
    })
})

app.get("/notes", (req, res) => {
    const token = req.headers.token;
    if(!token){
        res.status(403).json({
            message: "You are not logged in"
        });
        return;
    }

    const decode = jwt.verify(token , "yash1212");
    const username = decode.username

    if(!username){
        return res.status(403).json({
            message: "Malformed token"
        })
    }
    const userNotes = notes.filter(note => note.username === username);
    res.json({
        notes: userNotes
    })
})

app.get("/", (req, res) => {
    res.sendFile("C:/Users/Yash.Aggarwal/Desktop/Web-dev/Backend/Practice_Notes_App/index.html");
})

app.get("/signup", (req, res) => {
    res.sendFile("C:/Users/Yash.Aggarwal/Desktop/Web-dev/Backend/Practice_Notes_App/signup.html");
})

app.get("/signin", (req, res) => {
    res.sendFile("C:/Users/Yash.Aggarwal/Desktop/Web-dev/Backend/Practice_Notes_App/signin.html");
})

app.listen(3000);