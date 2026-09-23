"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUsernameAction } from "@/lib/actions/profile";
import { useToast } from "@/components/ui/toast";

export interface ProfileFormProps {
  initialUsername: string;
  email: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialUsername,
  email,
}) => {
  const [username, setUsername] = React.useState(initialUsername);
  const [loading, setLoading] = React.useState(false);
  const { error, success } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.trim() === initialUsername) return;

    setLoading(true);
    try {
      const res = await updateUsernameAction(username);
      if (res?.error) {
        error(res.error, "Gagal Memperbarui Profil");
      } else {
        success("Username berhasil diperbarui!");
      }
    } catch {
      error("Terjadi galat jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 font-mono mb-1.5">
          Email Akun
        </label>
        <Input
          type="email"
          value={email}
          disabled
          className="bg-zinc-900 border-zinc-700 text-zinc-400 cursor-not-allowed font-mono text-sm"
        />
        <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
          Email akun tidak dapat diubah secara langsung.
        </span>
      </div>

      <div>
        <label
          htmlFor="username-input"
          className="block text-xs font-black uppercase tracking-wider text-zinc-300 font-mono mb-1.5"
        >
          Username
        </label>
        <Input
          id="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
          minLength={3}
          maxLength={50}
          className="font-mono text-sm font-bold"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !username.trim() || username.trim() === initialUsername}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
