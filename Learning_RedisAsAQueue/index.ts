import { createClient } from "redis";
import express from "express";

const app = express();

app.use(express.json());

const client = await createClient()
  .on("error", (err) => console.log("Redis client error " + err))
  .connect();

app.post("/push", async (req, res) => {
    const userId = req.body.userId
    const language = req.body.language
  console.log("Pushing in redis...");
  await client.lPush(
    "problems",
    JSON.stringify({ id: 1, user: userId, lang: language, code: "int main()" }),
  );
  return res.status(201).json({
    message: "Pushed to redis success!"
  })
});

app.listen(3000);
