import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Company blog and a themed thumbnail system, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/afb-blog", "afb-blog");
}
