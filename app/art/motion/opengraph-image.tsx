import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Comic videos, a launch video and a film, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/art/motion", "motion");
}
