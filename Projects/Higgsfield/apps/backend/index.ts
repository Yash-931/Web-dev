import express, { response } from "express";
import { prisma } from "./db";
import { CreateAvatatSchema, CreateUserSchema } from "./types";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import axios from "axios";
import path from "path";

const app = express();

const ai = new GoogleGenAI({
  vertexai: true,
  project: "project-d189ea0e-8fb5-4502-969",
  location: "us-central1", // Keep this stable region for Imagen 3
});

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

app.post("/api/v1/health", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Standard text/multimodal model
      contents: "Hi gemini, are you up and running?",
    });

    console.log(response.text);
    res.json({ message: response.text });
  } catch (error) {
    console.error("API Call failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/avatar", async (req, res) => {
  try {
    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt:
        "A professional corporate portfolio headshot, left side profile view...",
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png",
      },
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    const buffer = Buffer.from(base64Image, "base64");

    // Process or save your image buffer here
    res.json({ success: true, image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("API Call failed:", error);
    res.status(500).json({ error: error.message });
  }
});

async function fetchImageAsInlineData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get("content-type") || "image/png";

    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: mimeType,
      },
    };
  } catch (error) {
    console.error("Error downloading input image:", error);
    throw new Error("Could not process the provided input image URL.");
  }
}

app.post("/api/v1/generate-avatar", async (req, res) => {
  try {
    const { prompt, imageUrl } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "A prompt is required." });
    }

    let base64Image = "";

    // SCENARIO A: Image-to-Image Generation (Image Editing/Modification)
    if (imageUrl) {
      const inputImageBlock = await fetchImageAsInlineData(imageUrl);

      // With Gemini image models, pass both the image block and the text instruction in the contents array
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image", // High-fidelity native image creation and editing model
        contents: [inputImageBlock, prompt],
        config: {
          // Tell the model we want an image returned back to us
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      // Extract the output image bytes from the parts array
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData,
      );
      if (!imagePart || !imagePart.inlineData?.data) {
        throw new Error("Model failed to output a modified image.");
      }

      console.log("Scenario A success");
      base64Image = imagePart.inlineData.data;
    }
    // SCENARIO B: Pure Text-to-Image Generation (Fallback)
    else {
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/png",
          aspectRatio: "1:1",
        },
      });
      console.log("Using scenario B");
      base64Image = response.generatedImages[0].image.imageBytes;
    }

    const uploadDir = path.join(process.cwd(), "uploads");

    await Bun.write(
      path.join(uploadDir, `avatar-${Date.now()}.png`),
      Buffer.from(base64Image, "base64"),
    );


    console.log("Image saved");

    // Send the base64 data URI back to the MERN frontend
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error: any) {
    console.error("Generation pipeline failed:", error);
    res
      .status(500)
      .json({ error: error.message || "Image generation failed." });
  }
});

// app.post("/api/v1/avatar", async (req, res) => {
//   const { success, data } = CreateAvatatSchema.safeParse(req.body);
//   if (!success) {
//     res.status(411).json({
//       message: "Invalid inputs",
//     });
//     return;
//   }

//   const userPrompt =
//     "Create a left side profile for this user. Given the image, create a portfolio headshot from the left side of this user";

//   const options = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   };

//   const payload = {
//     key: process.env.MODELS_LAB_API_KEY,
//     model_id: "fluxdev",
//     controlnet_model: "depth",
//     controlnet_type: "depth",
//     init_image: data.image, // The Google Image URL passed from Frontend
//     prompt:
//       userPrompt ||
//       "A sharp professional studio portrait, side profile view of the same person, 90-degree profile angle, looking to the side, cinematic lighting",
//     negative_prompt:
//       "front view, looking at camera, deformed face, bad anatomy",
//     width: "512",
//     height: "512",
//     samples: "1",
//     num_inference_steps: "30",
//     safety_checker: "yes",
//     controlnet_conditioning_scale: "0.8",
//     auto_hint: "yes",
//   };

//   const response = await axios.post(process.env.MODELS_LAB_URL!, payload, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   console.log(response)

// });

app.listen(3000);
