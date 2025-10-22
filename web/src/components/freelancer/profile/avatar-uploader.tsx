"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/database";

interface AvatarUploaderProps {
  profile: Tables<"profiles">;
}

export function AvatarUploader({ profile }: AvatarUploaderProps) {
  const supabase = createSupabaseBrowserClient();
  const [preview, setPreview] = useState<string | null>(profile.avatar_url);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 2MB.");
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Could not generate public URL.");
      }

      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
      if (updateError) {
        throw updateError;
      }

      setPreview(publicUrl);
      toast.success("Profile photo updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload avatar.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-card-border bg-foreground/5">
        {preview ? (
          <Image src={preview} alt={profile.full_name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">No photo</div>
        )}
      </div>
      <div>
        <input type="file" accept="image/*" id="avatar" className="hidden" onChange={handleFileChange} />
        <Button type="button" variant="outline" onClick={() => document.getElementById("avatar")?.click()} loading={loading}>
          Upload photo
        </Button>
        <p className="mt-1 text-xs text-muted">Recommended: square image, under 2MB.</p>
      </div>
    </div>
  );
}
