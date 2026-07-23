import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password || password.length < 4) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const passwordHash = hashPassword(password);

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: "No admin found" }, { status: 404 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { username, passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}