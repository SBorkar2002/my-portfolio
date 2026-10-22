import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Lead-gen assessment, redesigned and shipped, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/lead-gen-assessment", "lead-gen-assessment");
}
