/** SB pixel badge (from the portfolio-pixel logo study, option 1): a rounded-pixel badge with SB in pixel letters.
    Ink fill with lavender letters in light theme, lavender fill with deep purple letters in dark (globals.css). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 15 11" width="45" height="33" shapeRendering="crispEdges" className={className}>
      <path fill="var(--logo-fill)" d="M1 0h13v1h-13zM0 1h15v1h-15zM0 2h15v1h-15zM0 3h15v1h-15zM0 4h15v1h-15zM0 5h15v1h-15zM0 6h15v1h-15zM0 7h15v1h-15zM0 8h15v1h-15zM0 9h15v1h-15zM1 10h13v1h-13z" />
      <path fill="var(--logo-text)" d="M3 2h4v1h-4zM8 2h4v1h-4zM2 3h1v1h-1zM8 3h1v1h-1zM12 3h1v1h-1zM2 4h1v1h-1zM8 4h1v1h-1zM12 4h1v1h-1zM3 5h3v1h-3zM8 5h4v1h-4zM6 6h1v1h-1zM8 6h1v1h-1zM12 6h1v1h-1zM6 7h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM2 8h4v1h-4zM8 8h4v1h-4z" />
    </svg>
  );
}
