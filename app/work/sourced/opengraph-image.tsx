import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Sourced: human-made and AI art, side by side, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/sourced", "sourced");
}
