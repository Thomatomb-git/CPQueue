"use client";

import * as React from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const { error } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        error(res.error, "Login Failed");
        setLoading(false);
      }
    } catch {
      // In Next.js, redirect() throws an error that gets caught if unhandled,
      // but in Client Component calling Server Action returning redirect, navigation happens.
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-xs text-zinc-400 font-medium">
          Continue practicing and conquer your post-contest problem queue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>SIGN IN</span>
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t-2 border-zinc-800 pt-4 text-center text-xs font-mono text-zinc-400">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-[#FACC15] hover:underline"
        >
          Register now
        </Link>
      </div>
    </Card>
  );
}
