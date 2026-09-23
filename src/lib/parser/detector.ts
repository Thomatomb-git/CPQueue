import { CpPlatform } from "@/types/database";

export interface DetectionResult {
  platform: CpPlatform;
  title: string;
}

export function detectPlatformAndExtractTitle(url: string): DetectionResult {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // 1. Codeforces
    if (hostname.includes("codeforces.com")) {
      const cfRegex = /(?:contest|problemset\/problem)\/(\d+)(?:\/problem)?\/([A-Za-z0-9]+)/i;
      const match = pathname.match(cfRegex);
      if (match) {
        return {
          platform: "codeforces",
          title: `CF ${match[1]} - ${match[2].toUpperCase()}`,
        };
      }
      return {
        platform: "codeforces",
        title: `Codeforces - ${pathname.split("/").filter(Boolean).pop() || "Problem"}`,
      };
    }

    // 2. AtCoder
    if (hostname.includes("atcoder.jp")) {
      const atcoderRegex = /contests\/([^\/]+)\/tasks\/([^\/]+)/i;
      const match = pathname.match(atcoderRegex);
      if (match) {
        // match[2] can be abc350_c or similar
        const taskName = match[2].includes("_") ? match[2].split("_").pop()?.toUpperCase() : match[2];
        return {
          platform: "atcoder",
          title: `AtCoder ${match[1]} - ${taskName || match[2]}`,
        };
      }
      return {
        platform: "atcoder",
        title: `AtCoder - ${pathname.split("/").filter(Boolean).pop() || "Task"}`,
      };
    }

    // 3. TLX
    if (hostname.includes("tlx.toki.id")) {
      // e.g. /problems/troc-35/A or /courses/basic/chapters/01/problems/A
      const coursesRegex = /courses\/[^\/]+\/chapters\/[^\/]+\/problems\/([^\/]+)/i;
      const coursesMatch = pathname.match(coursesRegex);
      if (coursesMatch) {
        return {
          platform: "tlx",
          title: `TLX ${coursesMatch[1]}`,
        };
      }

      const problemMatch = pathname.match(/problems\/([^\/]+)\/([^\/]+)/i);
      if (problemMatch) {
        return {
          platform: "tlx",
          title: `TLX ${problemMatch[1]}-${problemMatch[2]}`,
        };
      }

      const singleProblemMatch = pathname.match(/problems\/([^\/]+)/i);
      if (singleProblemMatch) {
        return {
          platform: "tlx",
          title: `TLX ${singleProblemMatch[1]}`,
        };
      }

      return {
        platform: "tlx",
        title: `TLX ${pathname.split("/").filter(Boolean).pop() || "Problem"}`,
      };
    }

    // 4. VJudge
    if (hostname.includes("vjudge.net")) {
      const vjudgeRegex = /problem\/([^\/]+)/i;
      const match = pathname.match(vjudgeRegex);
      if (match) {
        return {
          platform: "vjudge",
          title: `VJudge ${match[1]}`,
        };
      }
      return {
        platform: "vjudge",
        title: `VJudge - ${pathname.split("/").filter(Boolean).pop() || "Problem"}`,
      };
    }

    // 5. Luogu
    if (hostname.includes("luogu.com.cn") || hostname.includes("luogu.com")) {
      const luoguRegex = /problem\/([A-Za-z0-9]+)/i;
      const match = pathname.match(luoguRegex);
      if (match) {
        return {
          platform: "luogu",
          title: `Luogu ${match[1].toUpperCase()}`,
        };
      }
      return {
        platform: "luogu",
        title: `Luogu - ${pathname.split("/").filter(Boolean).pop() || "Problem"}`,
      };
    }

    // 6. CSES
    if (hostname.includes("cses.fi")) {
      const csesRegex = /problemset\/task\/(\d+)/i;
      const match = pathname.match(csesRegex);
      if (match) {
        return {
          platform: "cses",
          title: `CSES Task ${match[1]}`,
        };
      }
      return {
        platform: "cses",
        title: `CSES - ${pathname.split("/").filter(Boolean).pop() || "Task"}`,
      };
    }

    // 7. Others
    const cleanHost = hostname.replace(/^www\./, "");
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments.length > 0 ? decodeURIComponent(segments[segments.length - 1]) : "problem";

    return {
      platform: "others",
      title: `${cleanHost} - ${lastSegment}`,
    };
  } catch {
    return {
      platform: "others",
      title: "Unknown Problem",
    };
  }
}
