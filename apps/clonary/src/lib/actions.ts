"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  const accessCode = await prisma.accessCode.findUnique({
    where: { code },
  });

  if (!accessCode || !accessCode.isActive || accessCode.type !== "USER") {
    throw new Error("Invalid or inactive access code");
  }

  const existing = await prisma.user.findFirst({
    where: { accessCodeId: accessCode.id },
  });

  if (existing) {
    throw new Error("Access code already used");
  }

  const user = await prisma.user.create({
    data: {
      accessCodeId: accessCode.id,
      name: name || null,
      phone: phone || null,
    },
  });

  await createSession({ id: user.id });
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const code = formData.get("code") as string;

  const accessCode = await prisma.accessCode.findUnique({
    where: { code },
    include: { users: true },
  });

  if (!accessCode || !accessCode.isActive || accessCode.type !== "USER") {
    throw new Error("Invalid access code");
  }

  const user = accessCode.users[0];
  if (!user) {
    throw new Error("No user registered with this code");
  }

  await createSession({ id: user.id });
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/");
}
