const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { userModel, organizationModel } = require("./models");

const BOARDS = []
const ISSUES = []

let BOARD_ID = 1;
let ISSUE_ID = 1;

const app = express();
app.use(express.json());

//POST ENDPOINTS
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username
    });

    if(userExists){
        return res.status(411).json({
            message: "User already exists"
        })
    }

    const user = await userModel.create({
        username, 
        password
    })

    res.json({
        message: "User signed up",
        user
    })
})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });

    if(!userExists){
        return res.status(403).json({
            message: "Invalid credentials"
        })
    }

    //create JWT for user
    const token = jwt.sign({
        userId: userExists._id
    }, "yash123");

    res.json({
        token
    })
})

app.post("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const org = await organizationModel.create({
        admin: userId,
        title: req.body.title,
        description: req.body.description,
        members: []
    })

    res.json({
        message: "Organization created successfully",
        id: org._id
    })
})

app.post("/add-member-to-organization",  authMiddleware, async (req, res) => {
    const userId = req.userId;

    const organizationId = req.body.organizationId;
    const memberUserEmail = req.body.memberUserEmail;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });
    if(!organization || organization.admin != userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    const memberUser = await userModel.findOne({
        username: memberUserEmail
    });

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

    await organizationModel.create(organization);

    res.json({
        message: "Member added successfully",
        organization
    })
})

app.post("/board", (req, res) => {

})

app.post("/issue", (req, res) => {

})


//GET ENDPOINTS
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    console.log("Input: " + organizationId);

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    console.log(organization);

    if(!organization || organization.admin != userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    res.json({
        organization: {
            //here I want to populate the members in the org (their usernames) --> we use the spread operator
            ...organization,
            members: organization.members.map( async (memberId) => {
                const user = await userModel.findOne({
                    _id: memberId
                })
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

app.get("/members", async (req, res) => {
    const organizationId = req.body.organizationId;
    
    const organization = await organizationModel.find({
        _id: organizationId
    })

    if(!organization) {
        res.status(404).json({
            message: "Org doesn't exist"
        })
        return;
    }

    console.log(organization[0].members)
    console.log(organization)


    res.status(200).json({
        members: await organization[0].members
    })

})

//UPDATE
app.put("/issues", (req, res) => {

})

//DELETE
app.delete("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const organizationId = req.body.organizationId;
    const memberUserEmail = req.body.memberUserEmail;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });
    if(!organization || organization.admin != userId) {
        res.status(411).json({
            message: "Either the org doesn't exist or you are not the admin of this org"
        })
        return;
    }

    const memberUser = await userModel.findOne({
        username: memberUserEmail
    });

    if(!memberUser){
        res.status(404).json({
            message: "User with the member email not found"
        })
        return;
    }

    const memberAlreadyPresent = organization.members.find( (x) => x == memberUser.id);
    console.log(memberAlreadyPresent);
    if(!memberAlreadyPresent){
        res.status(400).json({
            message: "Member not present in the org"
        });
        return;
    }

    organization.members = organization.members.filter( (x) =>  x != memberUser.id);
    console.log(organization);
    await organizationModel.create(organization);
    res.json({
        message: "Member deleted success"
    })
})



app.listen(3000);