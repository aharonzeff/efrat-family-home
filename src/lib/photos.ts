import type { ImageMetadata } from "astro";

const images = import.meta.glob("../assets/photos/*.jpg", {
  eager: true,
  import: "default",
});

export function resolvePhoto(file: string): ImageMetadata {
  const match = Object.entries(images).find(([key]) => key.endsWith(`/${file}`));
  if (!match) {
    throw new Error(
      `Photo "${file}" is listed in content but missing from src/assets/photos/. Add the file or update gallery.json.`,
    );
  }
  return match[1] as ImageMetadata;
}
