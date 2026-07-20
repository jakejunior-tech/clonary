"use client";

import { useState, useRef } from "react";
import { cloneVoice } from "./actions";

export default function CloneVoicePage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      await cloneVoice(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cloning failed");
      setPending(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Clone Your Voice</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a digital replica of your voice
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

        <div className="space-y-2">
          <label htmlFor="audio" className="text-sm font-medium">
            Audio Sample
          </label>
          <div className="rounded-xl border-2 border-dashed border-border p-6 text-center">
            <div className="text-4xl mb-2">{file ? "✅" : "🎤"}</div>
            <p className="text-sm font-medium">
              {file ? file.name : "Upload Audio Sample"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              MP3 or WAV, at least 30 seconds of clear speech
            </p>
            <label className="mt-3 inline-block text-sm text-primary font-medium hover:underline cursor-pointer">
              Browse Files
              <input
                id="audio"
                name="audio"
                type="file"
                accept="audio/*"
                required
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {pending ? "Cloning..." : "Start Cloning"}
        </button>
      </form>
    </div>
  );
}