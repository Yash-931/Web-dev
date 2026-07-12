import { fetchImageAsInlineData } from "./image";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
const ai = new GoogleGenAI({});

export async function generateVideo(
  prompt: string,
  imageUrls: string[],
  outputPath: string,
) {
  const imageBuffers = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      await fetchImageAsInlineData(imageUrl);
    }),
  );

  console.log("image buffers created: ", imageBuffers);

  const input = [
    ...imageBuffers.map((img) => ({
      type: "image" as const,
      data: img.inlineData.data,
      mime_type: img.inlineData.mimeType,
    })),
    {
      type: "text" as const,
      text: prompt,
    },
  ];

  const interaction = await ai.interactions.create({
    model: "gemini-omni-flash-preview",
    input: input,
  });

  if (interaction.output_video?.data) {
    fs.writeFileSync(
      `${outputPath}`,
      Buffer.from(interaction.output_video.data, "base64"),
    );
  }
}
