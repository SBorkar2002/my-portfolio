/** Pre-optimised WebP from public/images at 1x and 2x of its display width. */
export function Img({
  name,
  width,
  alt,
  fit = "cover",
  position = "center",
  priority = false,
}: {
  name: string;
  width: number;
  alt: string;
  /** "contain" keeps the whole screenshot, top-aligned, for frames that do not match its proportions. */
  fit?: "cover" | "contain";
  position?: "center" | "top";
  priority?: boolean;
}) {
  const fitClass = fit === "contain" ? "object-contain object-top" : position === "top" ? "object-cover object-top" : "object-cover";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${name}-${width}.webp`}
      srcSet={`/images/${name}-${width}.webp 1x, /images/${name}-${width * 2}.webp 2x`}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`block size-full ${fitClass}`}
    />
  );
}
