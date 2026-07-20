import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/", "/access-codes", "/users", "/generations"];

function getSecret(): Uint8Array<ArrayBuffer> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret) as unknown as Uint8Array<ArrayBuffer>;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [, payloadB64, sigB64] = parts;
    const data = `${parts[0]}.${parts[1]}`;

    const key = await crypto.subtle.importKey(
      "raw",
      getSecret(),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(data));
    if (!valid) return false;

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!protectedPaths.includes(path)) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  return verifyToken(token).then((valid) => {
    if (!valid) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
