"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function generateSpeech(formData: FormData) {
  const session = await requireAuth();
  const userId = session.sub as string;

  const voiceId = formData.get("voiceId") as string;
  const text = formData.get("text") as string;
  const emotion = formData.get("emotion") as string;

  if (!voiceId || !text) throw new Error("Voice and text are required");

  const voice = await prisma.clonedVoice.findFirst({
    where: { id: voiceId, userId },
  });

  if (!voice) throw new Error("Voice not found");

  await prisma.generation.create({
    data: {
      userId,
      voiceId,
      text,
      emotionTags: emotion || null,
      status: "PENDING",
      paymentStatus: "UNPAID",
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
