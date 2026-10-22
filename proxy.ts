import { NextResponse, type NextRequest } from "next/server";

// The private stats page lives at a secret address taken from the STATS_PATH environment variable, so the address
// never appears in this public repo. Requests to that address are rewritten to the internal /stats-console route;
// opening /stats-console directly gets the 404 page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.STATS_PATH;
  if (pathname === "/stats-console") return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  if (secret && pathname === `/${secret}`) {
    const headers = new Headers(request.headers);
    headers.set("x-stats-gate", secret);
    const res = NextResponse.rewrite(new URL(`/stats-console${request.nextUrl.search}`, request.url), { request: { headers } });
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  return NextResponse.next();
}

// Single-segment paths only, so images, video and scripts never run through here.
export const config = { matcher: "/:slug((?!_next|images|video|logos|icons|cursors)[^/.]+)" };
