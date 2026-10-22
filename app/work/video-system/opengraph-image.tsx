import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Video production system for a launch film, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/video-system", "video-system");
}
