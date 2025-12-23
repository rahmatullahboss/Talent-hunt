'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

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
  id: z.string(),
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
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can manage portfolio items." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    const itemId = generateId();
    await db
      .prepare(
        `INSERT INTO portfolio_items (id, profile_id, title, description, external_link, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(itemId, auth.profile.id, parsed.data.title, parsed.data.description, parsed.data.externalLink ?? null, parsed.data.imageUrl ?? null)
      .run();

    revalidatePath("/freelancer/portfolio");
    revalidatePath("/freelancer/dashboard");

    return { status: "success", message: "Portfolio item added." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to add portfolio item." };
  }
}

export async function deletePortfolioItemAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = deleteSchema.safeParse({
    id: formData.get("itemId"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid portfolio item reference." };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile || (auth.profile as { role: string }).role !== "freelancer") {
    return { status: "error", message: "Only freelancers can manage portfolio items." };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available." };
  }

  try {
    await db
      .prepare("DELETE FROM portfolio_items WHERE id = ? AND profile_id = ?")
      .bind(parsed.data.id, auth.profile.id)
      .run();

    revalidatePath("/freelancer/portfolio");

    return { status: "success", message: "Portfolio item removed." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to delete portfolio item." };
  }
}
