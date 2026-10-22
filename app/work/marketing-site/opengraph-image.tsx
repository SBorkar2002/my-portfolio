import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Marketing site and a 20-component library, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/work/marketing-site", "marketing-site");
}
