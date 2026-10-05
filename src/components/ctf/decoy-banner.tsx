import * as React from "react";
import { ShieldAlert, Search } from "lucide-react";

export interface DecoyBannerProps {
  username: string;
}

export const DecoyBanner: React.FC<DecoyBannerProps> = ({ username }) => {
  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border-[3px] border-[#EF4444] bg-[#18181B] p-4 sm:p-5 shadow-[5px_5px_0px_0px_#EF4444] animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-white bg-[#EF4444] text-white shadow-[3px_3px_0px_0px_#FFFFFF]">
            <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Decoy Account Detected
              </span>
              <span className="rounded border-2 border-white bg-zinc-800 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-300">
                @{username}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-zinc-300">
              Nice try! You logged into a dummy account. Dig deeper...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center rounded-lg border-2 border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-xs font-bold text-zinc-400">
          <Search className="h-3.5 w-3.5 text-[#FACC15]" />
          <span>Keep Searching</span>
        </div>
      </div>
    </div>
  );
};
