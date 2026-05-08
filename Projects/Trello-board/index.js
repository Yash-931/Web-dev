const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");


const USERS = []
const ORGANIZATIONS = []
const BOARDS = []
const ISSUES = []

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

const app = express();
app.use(express.json());

//POST ENDPOINTS
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find( (user) => user.username === username);

    if(userExists){
        return res.status(411).json({
            message: "User already exists"
        })
    }

    USERS.push({
        username, 
        password,
        id: USER_ID++
    })

    res.json({
        message: "User signed up"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find( (user) => user.username === username && user.password === password);

    if(!userExists){
        return res.status(403).json({
            message: "Invalid credentials"
        })
    }

    //create JWT for user
    const token = jwt.sign({
        userId: userExists.id
    }, "yash123");

    res.json({
        token
    })
})

app.post("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;

    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        admin: userId,
        title: req.body.title,
        description: req.body.description,
        members: []
    })

    res.json({
        message: "Organization created successfully",
        id: ORGANIZATION_ID-1
    })
})

app.post("/add-member-to-organization",  authMiddleware, (req, res) => {
    const userId = req.userId;

    const organizationId = req.body.organizationId;
    const memberUserEmail = req.body.memberUserEmail;

    const organization = ORGANIZATIONS.find( (org) => org.id === organizationId);
    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    const memberUser = USERS.find( (user) => user.username === memberUserEmail);

    if(!memberUser){
        res.status(404).json({
            message: "User with the member email not found"
        })
        return;
    }

    const memberAlreadyPresent = organization.members.find( (x) => x === memberUser.id);
    if(memberAlreadyPresent){
        res.status(400).json({
            message: "Member already present in the org"
        });
        return;
    }

    organization.members.push(memberUser.id);

    res.json({
        message: "Member added successfully"
    })
})

app.post("/board", (req, res) => {

})

app.post("/issue", (req, res) => {

})


//GET ENDPOINTS
app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = Number(req.query.organizationId);

    const organization = ORGANIZATIONS.find( (org) => org.id === organizationId);
    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    res.json({
        organization: {
            //here I want to populate the members in the org (their usernames) --> we use the spread operator
            ...organization,
            members: organization.members.map( (memberId) => {
                const user = USERS.find( (user) => user.id === memberId)
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })

})

app.get("/boards", (req, res) => {

})

app.get("/issues", (req, res) => {

})

app.get("/members", (req, res) => {

})

//UPDATE
app.put("/issues", (req, res) => {

})

//DELETE
app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;

    const organizationId = req.body.organizationId;
    const memberUserEmail = req.body.memberUserEmail;

    const organization = ORGANIZATIONS.find( (org) => org.id === organizationId);
    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    const memberUser = USERS.find( (user) => user.username === memberUserEmail);

    if(!memberUser){
        res.status(404).json({
            message: "User with the member email not found"
        })
        return;
    }

    const memberAlreadyPresent = organization.members.find( (x) => x === memberUser.id);
    if(!memberAlreadyPresent){
        res.status(400).json({
            message: "Member not present in the org"
        });
        return;
    }

    organization.members = organization.members.filter( (x) =>  x !== memberUser.id);
    res.json({
        message: "Member deleted success"
    })
})



app.listen(3000);