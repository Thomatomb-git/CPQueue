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
          Profile <span className="text-[#FACC15]">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-zinc-400">
          Manage your CP identity and neobrutalism avatar.
        </p>
      </div>

      {/* 1. Profile Photo (Avatar Uploader) */}
      <Card className="p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 font-mono mb-4">
          Profile Photo (Avatar)
        </h2>
        <AvatarUploader
          currentAvatarUrl={avatarUrl}
          username={username}
          userId={user.id}
        />
      </Card>

      {/* 2. User Identity Form */}
      <Card className="p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 font-mono mb-4">
          Account Information
        </h2>
        <ProfileForm initialUsername={username} email={user.email || ""} />
      </Card>

      {/* 3. Security Info */}
      <div className="flex items-center gap-3 rounded-xl border-2 border-zinc-800 bg-surface/50 p-4 text-xs text-zinc-400">
        <Shield className="h-5 w-5 text-[#22C55E] shrink-0" />
        <span>
          Your data is protected by Supabase's built-in PostgreSQL Row-Level Security (RLS). Only you can access and manage your problem queue.
        </span>
      </div>
    </div>
  );
}
