"use client";

import { useActionState } from "react";
import { resetAdmin } from "@/lib/actions";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await resetAdmin(formData);
      if (result?.error) return result.error;
      return null;
    },
    null as string | null,
  );

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Reset Admin Access</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Enter the security phrase and your new credentials
          </p>
        </div>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Security phrase
            </label>
            <input
              name="secret"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              New username
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              New password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={4}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Confirm password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          {state && (
            <p className="text-sm text-red-600">{state}</p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors"
            disabled={pending}
          >
            {pending ? "Resetting..." : "Reset & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
