import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { ProfileForm } from "@/components/profile/profile-form";
import { Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const username = profile?.username || user.email?.split("@")[0] || "Warrior";
  const avatarUrl = profile?.avatar_url || null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-black tracking-tight text-white sm:text-3xl">
          Pengaturan <span className="text-[#FACC15]">Profil</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-zinc-400">
          Kelola identitas petualang CP dan avatar neobrutalism Anda.
        </p>
      </div>

      {/* 1. Foto Profil (Avatar Uploader) */}
      <Card className="p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 font-mono mb-4">
          Foto Profil (Avatar)
        </h2>
        <AvatarUploader
          currentAvatarUrl={avatarUrl}
          username={username}
          userId={user.id}
        />
      </Card>

      {/* 2. Form Identitas Pengguna */}
      <Card className="p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 font-mono mb-4">
          Informasi Akun
        </h2>
        <ProfileForm initialUsername={username} email={user.email || ""} />
      </Card>

      {/* 3. Info Keamanan */}
      <div className="flex items-center gap-3 rounded-xl border-2 border-zinc-800 bg-surface/50 p-4 text-xs text-zinc-400">
        <Shield className="h-5 w-5 text-[#22C55E] shrink-0" />
        <span>
          Data Anda dilindungi oleh Row-Level Security (RLS) PostgreSQL bawaan Supabase. Hanya Anda yang dapat mengakses dan mengelola antrean soal Anda.
        </span>
      </div>
    </div>
  );
}
