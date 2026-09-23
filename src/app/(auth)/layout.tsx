import * as React from "react";
import Link from "next/link";
import { Swords } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-canvas">
      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[2.5px] border-white bg-[#FACC15] text-black shadow-[4px_4px_0px_0px_#FFFFFF]">
          <Swords className="h-7 w-7 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-white">
            CP <span className="text-[#FACC15]">QUEST</span>
          </h1>
          <p className="text-xs font-mono font-bold text-zinc-400">
            Upsolve Log & Queue Manager
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs font-mono text-zinc-500">
        Competitive Programming Upsolving Made Tactile & Fun.
      </div>
    </div>
  );
}
