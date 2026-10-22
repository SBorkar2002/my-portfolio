import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Webtoon action, client pages and a cricket one-shot, by Sejal Borkar";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("/art/comics", "comics");
}
