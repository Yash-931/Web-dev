import { fetchImageAsInlineData } from "./image";
import { GoogleGenAI } from "@google/genai";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";

const ai = new GoogleGenAI({
  vertexai: true,
  project: "project-d189ea0e-8fb5-4502-969",
  location: "us-central1",
});

const storage = new Storage();

export async function generateVideo(
  prompt: string,
  imageUrls: string[],
  outputPath: string,
) {
  const fetchedImages = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      return await fetchImageAsInlineData(imageUrl);
    }),
  );
  console.log(`${fetchedImages.length} image buffers fetched successfully.`);

  if (fetchedImages.length === 0) {
    throw new Error("You must provide at least one reference image URL.");
  }

  // Vertex AI strictly requires the base64 string to be keyed under 'bytesBase64Encoded'
  // and the array property name to be snake_case 'reference_images'
  const formattedReferenceImages = fetchedImages.slice(0, 3).map((img) => ({
    image: {
      bytesBase64Encoded: img.inlineData.data, // 👈 Crucial fix for Vertex AI serialization
      mimeType: img.inlineData.mimeType,
    },
    referenceType: "asset",
  }));

  try {
    console.log("Triggering Veo 3.1 Reference-Driven Video Generation...");

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-001",
      prompt: prompt,
      config: {
        aspectRatio: "16:9",
        outputGcsUri: "gs://higgsfield-video-bucket/video-outputs/",
        // @ts-ignore - explicitly using the lower-level wire parameter format for Vertex
        reference_images: formattedReferenceImages,
      },
    });

    // 3. Resilient Operation Polling Lifecycle
    let pollCount = 0;
    while (!operation.done) {
      pollCount++;
      console.log(`[Poll #${pollCount}] Video is rendering... checking again in 20 seconds.`);
      
      // Wait 20 seconds before asking the server again
      await new Promise((resolve) => setTimeout(resolve, 20000));
      
      try {
        // Fetch status with a fresh network handshake
        operation = await ai.operations.get({ operation: operation });
      } catch (pollError) {
        // If a network timeout or socket drop happens, catch it here so the script doesn't hang forever
        console.log("⚠️ Network timeout or transient hiccup during check. Retrying connection next cycle...");
        continue; 
      }
    }

    if (operation.response && operation.response.generatedVideos) {
      const videoUri = operation.response.generatedVideos[0].video.uri;
      console.log("Video generation success in cloud! URI:", videoUri);

      const cleanUri = videoUri.replace("gs://", "");
      const parts = cleanUri.split("/");
      const bucketName = parts[0];
      const fileName = parts.slice(1).join("/");

      console.log(`Downloading video from bucket: ${bucketName}...`);

      await storage.bucket(bucketName).file(fileName).download({
        destination: outputPath,
      });

      console.log(
        `🎉 Success! Video saved locally to your machine at: ${outputPath}`,
      );
    }
  } catch (error) {
    console.error("Error generating or downloading video:", error);
  }
}
