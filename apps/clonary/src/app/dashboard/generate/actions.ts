"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

const EMOTION_STYLE_MAP: Record<string, string> = {
  happy: "excited",
  sad: "sad",
  angry: "angry",
  excited: "excited",
  calm: "calm",
  whisper: "whisper",
};

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
  if (!ELEVENLABS_API_KEY) throw new Error("ElevenLabs API key not configured");

  const ttsBody: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  };

  if (emotion && EMOTION_STYLE_MAP[emotion]) {
    ttsBody.voice_settings = {
      ...(ttsBody.voice_settings as object),
      style: EMOTION_STYLE_MAP[emotion],
    } as Record<string, unknown>;
    ttsBody.voice_settings = ttsBody.voice_settings as Record<string, unknown>;
  }

  const res = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${voice.elevenlabsVoiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ttsBody),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS failed: ${err}`);
  }

  const audioBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  const dataUrl = `data:audio/mpeg;base64;voiceid=${voice.elevenlabsVoiceId},${base64}`;

  await prisma.generation.create({
    data: {
      userId,
      voiceId,
      text,
      emotionTags: emotion || null,
      audioUrl: dataUrl,
      status: "PENDING",
      paymentStatus: "UNPAID",
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}