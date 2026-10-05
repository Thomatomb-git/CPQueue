import * as React from "react";
import { ShieldAlert, LogOut, Terminal, Search } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export interface DecoyScreenProps {
  username: string;
}

export const DecoyScreen: React.FC<DecoyScreenProps> = ({ username }) => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-6 px-4">
      <div className="w-full max-w-xl rounded-2xl border-[3.5px] border-white bg-[#18181B] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#EF4444] text-center">
        {/* Top Warning Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-[#EF4444] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0px_0px_#FFFFFF] mb-6">
          <ShieldAlert className="h-4 w-4 stroke-[3]" />
          <span>DECOY DETECTED</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          THIS IS A DUMMY ACCOUNT!
        </h1>

        <p className="mt-3 font-mono text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
          Great research skills finding these credentials! However, this account is an intentional dead end.
        </p>

        {/* Retro Terminal Status Box */}
        <div className="my-6 rounded-xl border-2 border-zinc-700 bg-black/80 p-4 text-left font-mono text-xs shadow-[4px_4px_0px_0px_#27272A]">
          <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-zinc-800 text-zinc-500 font-bold text-[11px]">
            <Terminal className="h-3.5 w-3.5 text-[#FACC15]" />
            <span>SESSION_AUDIT_LOG</span>
          </div>
          <div className="space-y-1.5 text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">CURRENT_USER:</span>
              <span className="font-bold text-white">@{username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ACCOUNT_TYPE:</span>
              <span className="font-bold text-[#EF4444]">DUMMY / DECOY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">FLAG_STATUS:</span>
              <span className="font-bold text-zinc-400">0/1 (NOT FOUND HERE)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-900">
              <span className="text-zinc-500">ADVICE:</span>
              <span className="font-bold text-[#FACC15]">Dig deeper...</span>
            </div>
          </div>
        </div>

        {/* Action Button: Logout */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <form action={logoutAction} className="w-full sm:w-auto">
            <Button
              type="submit"
              variant="danger"
              className="w-full sm:w-auto h-11 px-6 gap-2 text-xs uppercase tracking-wider font-mono font-black"
            >
              <LogOut className="h-4 w-4" />
              <span>LOGOUT & TRY AGAIN</span>
            </Button>
          </form>

          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500">
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span>Check other traces</span>
          </div>
        </div>
      </div>
    </div>
  );
};
