const express = require("express");
const { authMiddleware } = require("../middleware");
const { User, Account } = require("../db");
const { default: mongoose } = require("mongoose");
const { $ZodCheckIncludes } = require("zod/v4/core");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const account = Account.findOne({
    userId: userId,
  });

  res.json({
    balance: account.balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const body = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { to, amount } = body;

  const toUser = await User.findOne({
    _id: to,
  });

  if (!toUser) {
    return res.status(404).json({
      message: "User you are trying to send not found",
    });
  }

  const userAccount = await Account.findOne({
    userId: userId,
  });

  const toAccount = await Account.findOne({
    userId: userId,
  });

  if (amount > userAccount.balance) {
    return res.status(402).json({
      message: "Insufficient balance",
    });
  }

  await Account.updateOne(
    {
      userId: userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    },
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    },
  ).session(session);

  await session.commitTransaction();
  res.status(200).json({
    message: "Transaction successful!",
  });
});

module.exports = accountRouter;
