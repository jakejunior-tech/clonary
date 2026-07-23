"use client";

import Link from "next/link";
import { login } from "@/lib/actions";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("reset") !== "true") return null;

  return (
    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
      Credentials updated successfully! Sign in with your new username and password.
    </div>
  );
}

function LoginForm() {
  return (
    <form action={login} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
      <button className="w-full py-2.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors">
        Sign in
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Clonary Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>
        <Suspense>
          <ResetBanner />
        </Suspense>
        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <button className="w-full py-2.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors">
            Sign in
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-500 hover:text-zinc-700 underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
