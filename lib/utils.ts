/** Joins class names, skipping empty ones (stand-in for clsx + tailwind-merge in vendored components). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
