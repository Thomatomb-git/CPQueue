"use client";

import * as React from "react";
import { Upload, Loader2, Camera } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { compressAvatarImage } from "@/lib/utils/image-compression";
import { createClient } from "@/lib/supabase/client";
import { updateAvatarAction } from "@/lib/actions/profile";
import { useToast } from "@/components/ui/toast";

export interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  username: string;
  userId: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  username,
  userId,
}) => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { error, success } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Kompresi gambar & validasi tipe/ukuran (< 2MB)
      const compressionResult = await compressAvatarImage(file);
      if (compressionResult.error) {
        error(compressionResult.error, "Format Tidak Valid");
        setUploading(false);
        return;
      }

      const compressedFile = compressionResult.file;
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // 2. Upload ke Supabase Storage bucket 'avatars'
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        error(`Gagal upload avatar: ${uploadError.message}`, "Storage Error");
        setUploading(false);
        return;
      }

      // 3. Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 4. Update avatar_url di tabel profiles
      const res = await updateAvatarAction(publicUrl);
      if (res?.error) {
        error(res.error, "Database Error");
      } else {
        setAvatarUrl(publicUrl);
        success("Foto profil berhasil diperbarui!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses gambar.";
      error(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar
          src={avatarUrl}
          name={username}
          size="lg"
          className="h-24 w-24 text-3xl border-[3.5px] shadow-[4px_4px_0px_0px_#FFFFFF]"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs"
        >
          <Camera className="h-6 w-6 mb-1" />
          <span>Ganti</span>
        </button>
      </div>

      <div className="flex flex-col items-center sm:items-start gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border-[2.5px] border-white bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#FFFFFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#FFFFFF] cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Unggah Foto Baru</span>
            </>
          )}
        </button>

        <span className="text-[11px] font-mono text-zinc-400">
          Maksimal 2 MB (Format: .jpg, .png, .webp).
        </span>
      </div>
    </div>
  );
};
