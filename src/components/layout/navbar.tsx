"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListOrdered, History, User, LogOut, Swords } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";
import { Profile } from "@/types/database";
import { cn } from "@/lib/utils/cn";

export interface NavbarProps {
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isQueueActive = pathname.startsWith("/queue") || pathname === "/";
  const isHistoryActive = pathname.startsWith("/history");
  const isReadOnlyAccount = profile?.username?.toLowerCase() === "isthisreal";
  const isDecoy = Boolean(profile?.is_decoy);

  return (
    <header className="sticky top-0 z-40 w-full border-b-[3px] border-white bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/queue"
          className="group flex items-center gap-2.5 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-[2.5px] border-white bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#FFFFFF] transition-all group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0px_0px_#FFFFFF]">
            <Swords className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="font-mono text-xl font-black tracking-tight text-white sm:text-2xl drop-shadow-[2px_2px_0px_#27272A]">
            CP <span className="text-[#FACC15]">QUEUE</span>
          </span>
        </Link>

        {/* If Decoy/Dummy Account: Only Show Log Out */}
        {isDecoy ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border-[2.5px] border-white bg-zinc-900 px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-red-400 shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-red-500 hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>LOG OUT</span>
            </button>
          </form>
        ) : (
          /* Normal User & isthisreal: Full Navigation Tabs & Profile Avatar */
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-2">
              <Link
                href="/queue"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border-[2.5px] border-white px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all sm:px-4 sm:py-2 sm:text-sm",
                  isQueueActive
                    ? "bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#FFFFFF]"
                    : "bg-surface text-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                )}
              >
                <ListOrdered className="h-4 w-4 stroke-[2.5]" />
                <span>QUEUE</span>
              </Link>

              <Link
                href="/history"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border-[2.5px] border-white px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all sm:px-4 sm:py-2 sm:text-sm",
                  isHistoryActive
                    ? "bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#FFFFFF]"
                    : "bg-surface text-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                )}
              >
                <History className="h-4 w-4 stroke-[2.5]" />
                <span>HISTORY</span>
              </Link>
            </nav>

            {/* Profile Avatar & Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label="User menu"
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.username || "CP"}
                  size="md"
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border-[2.5px] border-white bg-surface p-2 text-white shadow-[6px_6px_0px_0px_#FFFFFF] animate-in fade-in zoom-in-95 duration-100 z-50">
                  <div className="border-b-2 border-zinc-800 px-3 py-2">
                    <div className="text-xs text-zinc-400 font-semibold">Logged in as</div>
                    <div className="font-mono text-sm font-bold text-[#FACC15] truncate">
                      @{profile?.username || "warrior"}
                    </div>
                  </div>

                  {!isReadOnlyAccount && (
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-zinc-800 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>
                  )}

                  <div className={cn("pt-1", !isReadOnlyAccount && "border-t-2 border-zinc-800")}>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
