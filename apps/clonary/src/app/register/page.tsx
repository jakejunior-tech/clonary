"use client";

import { useActionState } from "react";
import { register } from "@/lib/actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      try {
        await register(formData);
        return { error: undefined };
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Registration failed" };
      }
    },
    { error: undefined },
  );

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="text-xl font-bold block">
            Clonary
          </Link>
          <p className="text-sm text-muted-foreground">
            Create your account with an access code
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Access Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="Enter your access code"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
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
            {pending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
