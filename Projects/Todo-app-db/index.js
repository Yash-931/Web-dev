const express = require('express');
const { authMiddleware } = require('./middleware/authMiddleware');
const { userModel, todoModel } = require('./middleware/models');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username: username,
        password: password
    });

    if(existingUser) {
        res.json({
            message: "User already exists please signin"
        })
        return;
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    });

    res.status(200).json({
        message: "User signup success",
        username: username
    })

})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    })

    if(!userExists) {
        res.status(403).json({
            messgae: "User not found please signup"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists._id
    }, "yash123");
    res.json({
        message: "Signin success",
        token: token
    })
})


app.post("/todos", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    const newTodo = await todoModel.create({
        title: title,
        description: description,
        userId: userId
    });

    res.json({
        message: "Todo created success",
        todo: {
            title: newTodo.title,
            description: newTodo.description
        }
    })
})

app.get("/todos", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const userExists = await userModel.findOne({
        _id: userId
    });

    if(!userExists){
        res.status(403).json({
            message: "User not found"
        })
        return;
    }

    const userTodos = await todoModel.find({
        userId: userId
    });

    res.status(200).json({
        todos: userTodos
    })
})

app.delete("/todo/:todoId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.todoId;
    const userExists = await userModel.findOne({
        _id: userId
    });

    if(!userExists){
        res.status(403).json({
            message: "User not found"
        });

        return;
    }

    await todoModel.deleteOne({
        _id: todoId
    })

    res.json({
        message: "Todo deleted"
    });
})


app.listen(3000);