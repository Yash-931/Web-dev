import express from "express";
import { prisma } from "./db";
import { CreateAvatatSchema, CreateUserSchema } from "./types";
import { createImage } from "./image";
import { uuid } from "uuidv4";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { success, data } = CreateUserSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs. Validation failed",
    });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: req.body.password,
    },
  });
  res.json({
    id: user.id,
  });
});

app.post("/api/v1/avatar", async (req, res) => {
  try {
    const { success, data } = CreateAvatatSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        message: "Input validation failed",
      });
      return;
    }
    const { name, imageUrl } = req.body;

    const leftProfileId = uuid();
    const rightProfileId = uuid();
    const frontProfileId = uuid();

    await Promise.all([
      createImage(
        "Create a side profile for the user for the left side. It should be a high quality portfolio shoot type photo",
        imageUrl,
        `./assets/${leftProfileId}`,
      ),

      createImage(
        "Create a side profile for the user for the right side. It should be a high quality portfolio shoot type photo",
        imageUrl,
        `./assets/${rightProfileId}`,
      ),

      createImage(
        "Create a front profile for the user. It should be a high quality portfolio shoot type photo",
        imageUrl,
        `./assets/${frontProfileId}`,
      ),
    ]);


    // TODOS left:
    //1. Store the images in a object store like S3
    //2. Store the URLs of the generated images in the database

    res.json({
      success: true,
      name: name,
    });
  } catch (error: any) {
    console.error("Generation pipeline failed:", error);
    res
      .status(500)
      .json({ error: error.message || "Image generation failed." });
  }
});

app.listen(3000);
