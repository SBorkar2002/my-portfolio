import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "#futureofhr: a webinar page built like a video call, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/futureofhr", "futureofhr");
}
