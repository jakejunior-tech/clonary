"use client";

import { useActionState } from "react";
import { generateSpeech } from "./actions";
import type { ClonedVoice } from "@clonary/database";

const emotions = [
  { value: "", label: "None" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "angry", label: "Angry" },
  { value: "excited", label: "Excited" },
  { value: "calm", label: "Calm" },
  { value: "whisper", label: "Whisper" },
];

export default function GenerateForm({ voices }: { voices: ClonedVoice[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      try {
        await generateSpeech(formData);
        return { error: undefined };
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Generation failed" };
      }
    },
    { error: undefined },
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="voiceId" className="text-sm font-medium">
          Voice
        </label>
        <select
          id="voiceId"
          name="voiceId"
          required
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">Select a voice</option>
          {voices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="text" className="text-sm font-medium">
          Text
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={4}
          placeholder="Enter the text you want to convert to speech..."
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Emotion Tag</label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((e) => (
            <label
              key={e.value}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm cursor-pointer hover:bg-muted transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
            >
              <input
                type="radio"
                name="emotion"
                value={e.value}
                defaultChecked={e.value === ""}
                className="accent-primary"
              />
              {e.label}
            </label>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {pending ? "Generating..." : "Generate Speech"}
      </button>
    </form>
  );
}