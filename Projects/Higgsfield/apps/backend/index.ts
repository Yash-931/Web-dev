import express from "express";
import { prisma } from "./db";
import { CreateAvatatSchema, CreateUserSchema } from "./types";
import { createImage } from "./image";
import { uuid } from "uuidv4";
import { generateVideo } from "./video";
import { success } from "zod";

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

app.post("/api/v1/video", async (req, res) => {
  try {
    await generateVideo(
      "A medium shot of the subject in the reference images walking down a bustling street at dusk. The camera tracks their movement smoothly. The individual maintains the exact facial shape, expression tendencies, and appearance from the reference photos. Soft ambient city lights, highly detailed, continuous identity.",
      [
        "https://github.com/Yash-931/Web-dev/blob/99fd2c1296d5c1f4c3f82c437e19039bc4080761/Projects/Higgsfield/apps/backend/assets/01d271e0-a4a7-409b-a486-792be9c5eaa7/avatar-1783834797137.png?raw=true",
        "https://raw.githubusercontent.com/Yash-931/Web-dev/99fd2c1296d5c1f4c3f82c437e19039bc4080761/Projects/Higgsfield/apps/backend/assets/7d271e34-8cf9-493e-ad66-71a4d406cd0d/avatar-1783834797026.png",
        "https://raw.githubusercontent.com/Yash-931/Web-dev/99fd2c1296d5c1f4c3f82c437e19039bc4080761/Projects/Higgsfield/apps/backend/assets/ea86ac07-317b-43ba-becd-0658fc4d02ee/avatar-1783834797169.png",
      ],
      "./assets/video/kiratDance.mp4",
    );

    res.status(200).json({
        success: true,
        message: "Video generation success"
    })
  } catch (e) {
    res.status(400).json({
        error: e
    })
  }
});

app.listen(3000);
