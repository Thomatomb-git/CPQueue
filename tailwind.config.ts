import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#0F0F12",
        surface: "#18181B",
        secondary: "#27272A",
        borderRetro: "#FFFFFF",
        borderMuted: "#E4E4E7",
        textPrimary: "#FAFAFA",
        textMuted: "#A1A1AA",
        platform: {
          tlx: "#2563EB",
          vjudge: "#FACC15",
          codeforces: "#F8FAFC",
          atcoder: "#94A3B8",
          luogu: "#0EA5E9",
          cses: "#22C55E",
          others: "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "retro-white": "4px 4px 0px 0px #FFFFFF",
        "retro-white-hover": "6px 6px 0px 0px #FFFFFF",
        "retro-white-active": "1px 1px 0px 0px #FFFFFF",
        "retro-tlx": "4px 4px 0px 0px #2563EB",
        "retro-vjudge": "4px 4px 0px 0px #FACC15",
        "retro-codeforces": "4px 4px 0px 0px #F8FAFC",
        "retro-atcoder": "4px 4px 0px 0px #94A3B8",
        "retro-luogu": "4px 4px 0px 0px #0EA5E9",
        "retro-cses": "4px 4px 0px 0px #22C55E",
        "retro-others": "4px 4px 0px 0px #475569",
        "retro-red": "4px 4px 0px 0px #EF4444",
      },
    },
  },
  plugins: [],
};

export default config;
