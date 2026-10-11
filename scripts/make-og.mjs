import { mkdir } from "node:fs/promises";
import sharp from "sharp";

await mkdir("public/og", { recursive: true });
await sharp("src/assets/photos/15-balcony.jpg")
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 78 })
  .toFile("public/og/home.jpg");
console.log("Wrote public/og/home.jpg");
