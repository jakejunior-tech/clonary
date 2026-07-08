"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSession, clearSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { redirect } from "next/navigation";

export async function approveGeneration(id: string) {
  await prisma.generation.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
  revalidatePath("/generations");
}

export async function rejectGeneration(id: string) {
  await prisma.generation.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/generations");
}

export async function markAsPaid(id: string) {
  await prisma.generation.update({
    where: { id },
    data: { paymentStatus: "PAID" },
  });
  revalidatePath("/generations");
}

export async function createAccessCode(formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as string;

  if (!code || !type) throw new Error("Code and type are required");

  await prisma.accessCode.create({
    data: { code, type },
  });
  revalidatePath("/access-codes");
}

export async function toggleAccessCode(id: string, isActive: boolean) {
  await prisma.accessCode.update({
    where: { id },
    data: { isActive: !isActive },
  });
  revalidatePath("/access-codes");
}

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    throw new Error("Invalid username or password");
  }

  await createSession({ id: admin.id, username: admin.username });
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
