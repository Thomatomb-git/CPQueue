import * as React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Profile } from "@/types/database";
import { DecoyBanner } from "@/components/ctf/decoy-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userProfile: Profile = profile || {
    id: user.id,
    username: user.email?.split("@")[0] || "Warrior",
    avatar_url: null,
    created_at: new Date().toISOString(),
    is_decoy: false,
  };

  const isDecoy = Boolean(userProfile.is_decoy);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar profile={userProfile} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isDecoy && <DecoyBanner username={userProfile.username} />}
        {children}
      </main>
    </div>
  );
}
