import { CpPlatform } from "@/types/database";

export interface PlatformConfig {
  id: CpPlatform;
  name: string;
  brandColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  shadowClass: string;
  badgeStyle: string;
}

export const PLATFORM_CONFIGS: Record<CpPlatform, PlatformConfig> = {
  tlx: {
    id: "tlx",
    name: "TLX",
    brandColor: "#2563EB",
    textColor: "text-white",
    bgColor: "bg-[#2563EB]",
    borderColor: "border-white",
    shadowClass: "shadow-[3px_3px_0px_0px_#2563EB]",
    badgeStyle: "bg-[#2563EB] text-white border-white shadow-[2px_2px_0px_0px_#2563EB]",
  },
  vjudge: {
    id: "vjudge",
    name: "VJudge",
    brandColor: "#FACC15",
    textColor: "text-black font-black",
    bgColor: "bg-[#FACC15]",
    borderColor: "border-black",
    shadowClass: "shadow-[3px_3px_0px_0px_#FACC15]",
    badgeStyle: "bg-[#FACC15] text-black font-bold border-white shadow-[2px_2px_0px_0px_#FACC15]",
  },
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    brandColor: "#F8FAFC",
    textColor: "text-black font-black",
    bgColor: "bg-[#F8FAFC]",
    borderColor: "border-zinc-300",
    shadowClass: "shadow-[3px_3px_0px_0px_#F8FAFC]",
    badgeStyle: "bg-[#F8FAFC] text-black font-bold border-white shadow-[2px_2px_0px_0px_#F8FAFC]",
  },
  atcoder: {
    id: "atcoder",
    name: "AtCoder",
    brandColor: "#94A3B8",
    textColor: "text-black font-black",
    bgColor: "bg-[#94A3B8]",
    borderColor: "border-white",
    shadowClass: "shadow-[3px_3px_0px_0px_#94A3B8]",
    badgeStyle: "bg-[#94A3B8] text-black font-bold border-white shadow-[2px_2px_0px_0px_#94A3B8]",
  },
  luogu: {
    id: "luogu",
    name: "Luogu",
    brandColor: "#0EA5E9",
    textColor: "text-white",
    bgColor: "bg-[#0EA5E9]",
    borderColor: "border-white",
    shadowClass: "shadow-[3px_3px_0px_0px_#0EA5E9]",
    badgeStyle: "bg-[#0EA5E9] text-white border-white shadow-[2px_2px_0px_0px_#0EA5E9]",
  },
  cses: {
    id: "cses",
    name: "CSES",
    brandColor: "#22C55E",
    textColor: "text-black font-black",
    bgColor: "bg-[#22C55E]",
    borderColor: "border-white",
    shadowClass: "shadow-[3px_3px_0px_0px_#22C55E]",
    badgeStyle: "bg-[#22C55E] text-black font-bold border-white shadow-[2px_2px_0px_0px_#22C55E]",
  },
  others: {
    id: "others",
    name: "Others",
    brandColor: "#475569",
    textColor: "text-white",
    bgColor: "bg-[#475569]",
    borderColor: "border-white",
    shadowClass: "shadow-[3px_3px_0px_0px_#475569]",
    badgeStyle: "bg-[#475569] text-white border-white shadow-[2px_2px_0px_0px_#475569]",
  },
};

export const ALL_PLATFORMS: CpPlatform[] = [
  "codeforces",
  "atcoder",
  "tlx",
  "vjudge",
  "luogu",
  "cses",
  "others",
];
