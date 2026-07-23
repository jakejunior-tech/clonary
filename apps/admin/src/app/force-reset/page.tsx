"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForceResetPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [confirm, setConfirm] = useState("admin123");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Resetting...");
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      setStatus("");
      return;
    }

    try {
      const res = await fetch("/admin/api/force-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Success! Redirecting...");
        setTimeout(() => router.push("/admin/login?reset=true"), 1500);
      } else {
        setError(data.error || "Failed to reset");
        setStatus("");
      }
    } catch (e) {
      setError(String(e));
      setStatus("");
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Force Reset Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">One-time credential reset</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">New username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} type="text" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">New password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={4} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm password</label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && !error && <p className="text-sm text-green-600">{status}</p>}
          <button type="submit" className="w-full py-2.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors">
            Reset Admin
          </button>
        </form>
      </div>
    </div>
  );
}