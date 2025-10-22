'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

const upsertSchema = z.object({
  title: z.string().min(3, "Give your project a descriptive title."),
  description: z.string().min(10, "Describe the impact of your work in at least 10 characters."),
  externalLink: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined))
    .refine((value) => !value || /^https?:\/\//.test(value), "Provide a valid link starting with http or https."),
  imageUrl: z
    .string()
    .optional()
    .transform((value) => (value?.length ? value : undefined)),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createPortfolioItemAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = upsertSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    externalLink: formData.get("externalLink"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid portfolio item.";
    return { status: "error", message: firstError };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can manage portfolio items." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("portfolio_items").insert({
    profile_id: auth.profile.id,
    title: parsed.data.title,
    description: parsed.data.description,
    external_link: parsed.data.externalLink ?? null,
    image_url: parsed.data.imageUrl ?? null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/freelancer/portfolio");
  revalidatePath("/freelancer/dashboard");

  return { status: "success", message: "Portfolio item added." };
}

export async function deletePortfolioItemAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = deleteSchema.safeParse({
    id: formData.get("itemId"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid portfolio item reference." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || auth.profile.role !== "freelancer") {
    return { status: "error", message: "Only freelancers can manage portfolio items." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", parsed.data.id).eq("profile_id", auth.profile.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/freelancer/portfolio");

  return { status: "success", message: "Portfolio item removed." };
}
