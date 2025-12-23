'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { toJsonArray } from "@/lib/db";

const schema = z.object({
  fullName: z.string().min(3, "Please provide your full name."),
  title: z.string().min(3, "Add a clear headline for your expertise."),
  location: z.string().min(2, "Add your location."),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be positive.").optional(),
  bio: z.string().min(30, "Share more about your experience (min 30 characters)."),
  skills: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string()).min(1, "Add at least one skill.")),
  website: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined))
    .refine((value) => !value || /^https?:\/\//.test(value), "Website must start with http or https."),
});

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateFreelancerProfileAction(_: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    title: formData.get("title"),
    location: formData.get("location"),
    hourlyRate: formData.get("hourlyRate"),
    bio: formData.get("bio"),
    skills: formData.get("skills"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid profile data.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can update this profile." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    await db
      .prepare(
        `UPDATE profiles SET 
         full_name = ?, title = ?, location = ?, hourly_rate = ?, bio = ?, skills = ?, website = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(
        parsed.data.fullName,
        parsed.data.title,
        parsed.data.location,
        parsed.data.hourlyRate ?? null,
        parsed.data.bio,
        toJsonArray(parsed.data.skills),
        parsed.data.website ?? null,
        auth.profile.id
      )
      .run();

    revalidatePath("/freelancer/profile");
    revalidatePath("/freelancer/dashboard");

    return { status: "success", message: "Profile updated successfully." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update profile." };
  }
}
