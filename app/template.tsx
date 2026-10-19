/** Re-mounts on every route change, so each page wipes in (stepped, pixel style). Off for reduced motion. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
