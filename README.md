<div align="center">

# ⚔️ CPQueue

**The Tactile, Post-Contest Upsolve Queue for Competitive Programmers**

[![Next.js](https://img.shields.io/badge/Next.js-15_(App_Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

<br />

[Live Demo](https://cpqueue.vercel.app) · [Report Bug](https://github.com/thomatomb-git/CPQueue/issues) · [Request Feature](https://github.com/thomatomb-git/CPQueue/issues)

</div>

---

## 🎯 About The Project

After a grueling 2-hour contest on Codeforces or AtCoder, practical upsolving is what actually turns rating drops into rating gains. Yet, contest problems often end up scattered across browser bookmarks, Discord messages, or forgotten tabs.

**CPQueue** is built to solve this exact problem:
1. **Zero-friction input:** Simply paste any problem URL.
2. **Automatic detection:** Automatically parses the platform, contest ID, task code, and cleans tracking parameters.
3. **Tactile Gamification:** Built with an eye-catching **Cartoon Neobrutalism Dark Mode** interface featuring crisp hard shadows and celebration confetti when you conquer an upsolve quest.

---

## ✨ Features

- **⚡ Instant URL Parsing & Duplicate Prevention:** Paste a link from supported platforms; CPQueue automatically extracts titles (e.g., `CF 1985 - C` or `AtCoder abc350 - D`) and normalizes the URL to prevent duplicates.
- **📚 LIFO Active Queue:** Focuses on your freshest post-contest problems first (Last-In, First-Out order) with responsive grid cards.
- **🏷️ Multi-Platform Filter:** Filter your queue instantly by platform with counter badges.
- **🎉 Confetti Feedback:** Satisfying completion animations when marking problems solved.
- **📜 Compact History Log:** Tabular history view with multi-select bulk delete and "Re-queue" functionality.
- **👤 User Profiles & Avatars:** In-browser image compression before uploading custom avatars to Supabase Storage.
- **🔐 Secure Authentication:** Seamless login via **Username** or **Email** backed by Supabase Auth with Row-Level Security (RLS).

---

## 🌐 Supported Platforms

| Platform | URL Pattern Examples | Title Format |
|---|---|---|
| **Codeforces** | `/contest/1985/problem/C` or `/gym/102012/problem/D` | `CF 1985 - C` / `CF Gym 102012 - D` |
| **AtCoder** | `/contests/abc350/tasks/abc350_c` | `AtCoder abc350 - C` |
| **TLX** | `/problems/troc-35/A` or `/courses/basic/...` | `TLX troc-35-A` |
| **VJudge** | `/problem/POJ-1001` | `VJudge POJ-1001` |
| **CSES** | `/problemset/task/1068` | `CSES Task 1068` |
| **Luogu** | `/problem/P1001` | `Luogu P1001` |
| **Others** | Any valid problem URL | `{domain} - {slug}` |

---

## 🎨 Design System: Cartoon Neobrutalism

CPQueue combines high-contrast pitch-dark ergonomics with playful retro comic aesthetics:
- **Canvas:** Pitch Charcoal (`#0F0F12`) & Surface Zinc (`#18181B`)
- **Borders:** Bold `2.5px` solid borders
- **Hard Shadows:** Offset `4px 4px 0px 0px` hard drop shadows without blur
- **Tactile Feedback:** Press-down push interaction on buttons and cards

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Image Optimization:** [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row-Level Security, Storage, GoTrue Auth)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/thomatomb-git/CPQueue.git
cd CPQueue
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-side key for username resolution (keep secret, never prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Database Setup (Supabase)

Run the SQL migration scripts in your **Supabase SQL Editor** in order:
1. `supabase/migrations/20260923000000_initial_schema.sql` (Creates profiles, problems, RLS policies, and storage bucket)
2. `supabase/migrations/20261005000000_unique_username_login.sql` (Unique username index & username login RPC)
3. `supabase/migrations/20261005000001_add_is_decoy_to_profiles.sql` (Profile metadata updates)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start tracking your upsolve quests!

---

## 📦 Production Deployment

### Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add the following **Environment Variables** in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! Next.js will automatically build and optimize production assets.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

Crafted with ⚔️ by **[thomatomb-git](https://github.com/thomatomb-git)**

</div>
