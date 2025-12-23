"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateFreelancerProfileAction, type ProfileActionState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/auth/session";
import { fromJsonArray } from "@/lib/db";

const initialState: ProfileActionState = { status: "idle" };

export function FreelancerProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState(updateFreelancerProfileAction, initialState);
  const [isPending, startTransition] = useTransition();
  const skills = fromJsonArray(profile.skills);

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    } else if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="fullName">
            Full name
          </label>
          <Input id="fullName" name="fullName" defaultValue={profile.full_name} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="title">
            Professional headline
          </label>
          <Input id="title" name="title" defaultValue={profile.title ?? ""} placeholder="Senior React engineer" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="location">
            Location
          </label>
          <Input id="location" name="location" defaultValue={profile.location ?? ""} placeholder="Chattogram, Bangladesh" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="hourlyRate">
            Hourly rate (USD)
          </label>
          <Input id="hourlyRate" name="hourlyRate" type="number" min={0} step="1" defaultValue={profile.hourly_rate ?? undefined} placeholder="30" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="bio">
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          rows={6}
          defaultValue={profile.bio ?? ""}
          placeholder="Summarize your experience, domains you specialise in, and the results you help clients achieve."
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="skills">
          Skills (comma separated)
        </label>
        <Input id="skills" name="skills" defaultValue={skills.join(", ")} placeholder="React, Tailwind, GraphQL" required />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="website">
          Portfolio or personal website (optional)
        </label>
        <Input id="website" name="website" defaultValue={profile.website ?? ""} placeholder="https://yourportfolio.com" />
      </div>

      <Button type="submit" loading={isPending}>
        Save profile
      </Button>
    </form>
  );
}
