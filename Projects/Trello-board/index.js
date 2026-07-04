const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { userModel, organizationModel, boardModel, issuesModel } = require("./models");

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

app.post("/board/:org", authMiddleware, async (req, res) => {
    const title = req.body.title;
    const organizationId = req.params.org;
    const userId = req.userId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin != userId){
        res.status(403).json({
            message: "Either the org doesn't exists or you are not the admin of the org"
        })
        return;
    }

    const board = await boardModel.create({
        title: title,
        organization: organizationId,
        issues: [],
    });

    res.status(201).json({
        message: "Board created success",
        boardId: board._id
    })

})

app.post("/issue/:org", authMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const organizationId = req.params.org;
    const userId = req.userId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    const response = organization.members.filter( (memberId) => memberId.toString() === userId.toString())

    if(!organization || (response.length === 0 && organization.admin.toString() != userId.toString())){
        res.status(403).json({
            message: "Either the org doesn't exists or you are not a member of the org"
        })

        return;
    }

    const issue = await issuesModel.create({
        title: title,
        description: description,
        board: null
    })

    res.status(201).json({
        message: "Issue created success"
    })


})

app.post("/assign-issue/:orgId/:issueId/:boardId", async (req, res) => {
    const issueId = req.params.issueId;
    const boardId = req.params.boardId;
    const userId = req.userId;
    const organizationId = req.orgId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    const response = organization.members.filter( (memberId) => memberId.toString() === userId.toString())

    if(!organization || (response.length === 0 && organization.admin.toString() != userId.toString())){
        res.status(403).json({
            message: "Either the org doesn't exists or you are not a member of the org"
        })

        return;
    }

    const issue = await issuesModel.findOne({
        _id: issueId
    })

    const board = await boardModel.findOne({
        _id: boardId
    })

    board.issues.push
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

app.get("/boards/:org", authMiddleware, async (req, res) => {
    const organizationId = req.params.org;
    const userId = req.userId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    const response = organization.members.filter( (memberId) => memberId.toString() === userId.toString())

    if(!organization || (response.length === 0 && organization.admin.toString() != userId.toString())){
        res.status(403).json({
            message: "Either the org doesn't exists or you are not a member of the org"
        })

        return;
    }


    const boards = await boardModel.find({
        organization: organizationId
    });

    res.status(200).json({
        boards: boards
    })
})

app.get("/issues/:boardId", authMiddleware, async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.userId;

    const board = await boardModel.findOne({
        _id: boardId
    });

    const organizationId = board.organization;
    
    const organization = await organizationModel.findOne({
        _id: organizationId
    })

    const response = organization.members.filter( (memberId) => memberId.toString() === userId.toString())

    if(!organization || (response.length === 0 && organization.admin.toString() != userId.toString())){
        res.status(403).json({
            message: "Either the org doesn't exists or you are not a member of the org"
        })

        return;
    }

    const issues = board.issues;
    const issueArray = await issuesModel.find({
        _id: issues
    })

    res.status(200).json({
        issues: issueArray.map( (iss) => {
            return {
                title: iss.title,
                description: iss.description
            }
        })
    })
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

    let org = organization[0];
    const members = await userModel.find({
        _id: org.members
    })

    res.status(200).json({
        members: members.map( (m) => {
            return {
                username: m.username,
                id: m._id
            }
        })
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