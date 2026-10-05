"use client";

import * as React from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { USERNAME_MIN, USERNAME_MAX } from "@/lib/utils/username";

export default function RegisterPage() {
  const [loading, setLoading] = React.useState(false);
  const { error, success } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await registerAction(formData);
      if (res?.error) {
        error(res.error, "Registration Failed");
        setLoading(false);
      } else if (res?.needsConfirmation) {
        success(res.message, "Almost There!");
        form.reset();
        setLoading(false);
      }
    } catch {
      // In Next.js, redirect() navigates
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Create New Account
        </h2>
        <p className="mt-1 text-xs text-zinc-400 font-medium">
          Start tracking your upsolving goals and improve your CP rating.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 font-mono mb-1.5">
            Username
          </label>
          <Input
            type="text"
            name="username"
            placeholder="tourist_fan"
            required
            minLength={USERNAME_MIN}
            maxLength={USERNAME_MAX}
            pattern="[A-Za-z0-9_]+"
            title="Letters, numbers, and underscores only"
            autoCapitalize="none"
            spellCheck={false}
            disabled={loading}
          />
          <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
            {USERNAME_MIN}-{USERNAME_MAX} chars: letters, numbers, underscore.
          </span>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 font-mono mb-1.5">
            Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="name@domain.com"
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 font-mono mb-1.5">
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full h-11 gap-2 text-sm uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>REGISTER NOW</span>
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t-2 border-zinc-800 pt-4 text-center text-xs font-mono text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[#FACC15] hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </Card>
  );
}
