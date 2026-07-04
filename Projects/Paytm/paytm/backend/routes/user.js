const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const brcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
require("dotenv").config();

const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updateSchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

userRouter.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Inputs not correct!",
    });
  }

  const user = await User.findOne({
    username: body.username,
  });

  if (user) {
    return res.status(400).json({
      message: "User with username already exists",
    });
  }

  const password = body.password;
  const hashedPassword = await brcrypt.hash(password, 10);

  body.password = hashedPassword;

  const dbUser = await User.create(body);

  const userAccount = await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.floor(Math.random() * 10000)
  });

  return res.status(201).json({
    message: "User created successfully",
    dbUser,
    balance: userAccount.balance
  });
});

userRouter.post("/signin", async (req, res) => {
  const body = req.body;
  const { success } = signinSchema.safeParse(body);

  if (!success) {
    return res.status(400).json({
      message: "Invalid inputs",
    });
  }

  const username = body.username;
  const password = body.password;

  const user = await User.findOne({
    username: username,
  });

  const isMatch = await brcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  if (!user) {
    return res.json({
      message: "User with username doesn't exist. Please siginup.",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
  );

  return res.json({
    message: "User signed in successfully",
    token: token,
  });
});

userRouter.put("/update", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const body = req.body;
  const { success } = updateSchema.safeParse(body);

  if (!success) {
    return res.status(400).json({
      message: "Invalid inputs",
    });
  }

  await User.updateOne({ _id: userId }, { $set: body });

  res.status(200).json({
    message: "User updated successfully",
  });
});

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter
            }
        },
        {
            lastName: {
                $regex: filter
            }
        }]
    });

    return res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

module.exports = userRouter;
