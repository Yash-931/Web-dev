import { GoogleGenAI } from "@google/genai";
import path from "path";


const ai = new GoogleGenAI({
  vertexai: true,
  project: "project-d189ea0e-8fb5-4502-969",
  location: "us-central1",
});

export async function fetchImageAsInlineData(url: string) {
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

export async function createImage(prompt: string, imageUrl: string, outputFilePath: string) {
  let base64Image = "";

  const inputImageBlock = await fetchImageAsInlineData(imageUrl);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [inputImageBlock, prompt],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData,
  );
  if (!imagePart || !imagePart.inlineData?.data) {
    throw new Error("Model failed to output a modified image.");
  }

  base64Image = imagePart.inlineData.data;

  const uploadDir = path.join(process.cwd(), `${outputFilePath}`);

  await Bun.write(
    path.join(uploadDir, `avatar-${Date.now()}.png`),
    Buffer.from(base64Image, "base64"),
  );

  console.log("Image saved successfully");
}
