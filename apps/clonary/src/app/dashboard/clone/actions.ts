"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

export async function cloneVoice(formData: FormData) {
  const session = await requireAuth();
  const userId = session.sub as string;

  const name = formData.get("name") as string;
  const audio = formData.get("audio") as File;

  if (!name) throw new Error("Voice name is required");
  if (!audio || audio.size === 0) throw new Error("Audio sample is required");

  if (!ELEVENLABS_API_KEY) throw new Error("ElevenLabs API key not configured");

  const apiForm = new FormData();
  apiForm.append("name", name);
  apiForm.append("files", audio);

  const res = await fetch(`${ELEVENLABS_BASE}/voices/add`, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
    body: apiForm,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs voice cloning failed: ${err}`);
  }

  const data = await res.json();

  const voice = await prisma.clonedVoice.create({
    data: {
      userId,
      name,
      elevenlabsVoiceId: data.voice_id,
      sampleUrl: null,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}