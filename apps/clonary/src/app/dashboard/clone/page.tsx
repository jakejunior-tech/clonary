"use client";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useState } from "react";

async function cloneVoice(formData: FormData) {
  "use server";

  const session = await requireAuth();
  const userId = session.sub as string;
  const name = formData.get("name") as string;

  if (!name) throw new Error("Voice name is required");

  const voice = await prisma.clonedVoice.create({
    data: {
      userId,
      name,
      elevenlabsVoiceId: "pending",
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export default function CloneVoicePage() {
  const [name, setName] = useState("");

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Clone Your Voice</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a digital replica of your voice
        </p>
      </div>

      <form action={cloneVoice} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Voice Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Natural Voice"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
          <div className="text-4xl mb-3">🎤</div>
          <p className="text-sm font-medium">Upload Audio Sample</p>
          <p className="text-xs text-muted-foreground mt-1">
            MP3 or WAV, at least 30 seconds of clear speech
          </p>
          <button
            type="button"
            className="mt-4 text-sm text-primary font-medium hover:underline"
            onClick={() => alert("Audio upload will be available when ElevenLabs is integrated")}
          >
            Browse Files
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          Start Cloning
        </button>
      </form>
    </div>
  );
}
