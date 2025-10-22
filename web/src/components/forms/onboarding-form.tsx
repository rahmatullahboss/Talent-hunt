"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

const freelancerSchema = z.object({
  title: z.string().min(3, "Add a short professional headline"),
  bio: z.string().min(30, "Tell clients how you create impact (minimum 30 characters)"),
  skills: z
    .string()
    .refine(
      (value) => value.split(",").map((skill) => skill.trim()).filter(Boolean).length > 0,
      { message: "Add at least one skill" },
    ),
  hourlyRate: z
    .number()
    .min(0, "Hourly rate must be positive.")
    .optional(),
  location: z.string().min(2, "Add your city"),
  website: z
    .string()
    .optional()
    .transform((value) => (value && value.length ? value : undefined))
    .refine((value) => !value || /^https?:\/\//.test(value), { message: "Enter a valid URL starting with http(s)://" }),
  phone: z.string().optional(),
});

type FreelancerValues = z.infer<typeof freelancerSchema>;

const employerSchema = z.object({
  title: z.string().min(3, "Share your hiring focus or team name"),
  companyName: z.string().min(2, "Enter your organisation or team name"),
  hiringNeeds: z.string().min(20, "Describe the type of talent you seek (minimum 20 characters)"),
  location: z.string().min(2, "Add your company location"),
  website: z
    .string()
    .optional()
    .transform((value) => (value && value.length ? value : undefined))
    .refine((value) => !value || /^https?:\/\//.test(value), { message: "Enter a valid URL starting with http(s)://" }),
  phone: z.string().optional(),
});

interface EmployerValues {
  title: string;
  companyName: string;
  hiringNeeds: string;
  location: string;
  website?: string;
  phone?: string;
}

interface OnboardingFormProps {
  profile: Tables<"profiles"> | null;
}

export function OnboardingForm({ profile }: OnboardingFormProps) {
  if (!profile) {
    throw new Error("Onboarding form requires an authenticated profile");
  }

  if (profile.role === "freelancer") {
    return <FreelancerOnboardingForm profile={profile} />;
  }

  if (profile.role === "employer") {
    return <EmployerOnboardingForm profile={profile} />;
  }

  return (
    <div className="space-y-3 text-sm text-muted">
      <p>Admins do not require onboarding. Use the navigation to manage the marketplace.</p>
    </div>
  );
}

function FreelancerOnboardingForm({ profile }: { profile: Tables<"profiles"> }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const defaultSkills = useMemo(() => profile.skills?.join(", ") ?? "", [profile.skills]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreelancerValues>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      title: profile.title ?? "",
      bio: profile.bio ?? "",
      skills: defaultSkills,
      hourlyRate: profile.hourly_rate ?? undefined,
      location: profile.location ?? "",
      website: profile.website ?? "",
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = async (values: FreelancerValues) => {
    setLoading(true);
    const skillArray = values.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const { error } = await supabase
      .from("profiles")
      .update({
        title: values.title,
        bio: values.bio,
        skills: skillArray,
        hourly_rate: values.hourlyRate ?? null,
        location: values.location,
        website: values.website ?? null,
        phone: values.phone ?? null,
        onboarding_complete: true,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Your profile is ready!");
    router.push("/freelancer/dashboard");
    router.refresh();
    setLoading(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="title">
          Professional headline
        </label>
        <Input id="title" placeholder="e.g. Senior React Engineer & UI Specialist" {...register("title")} />
        {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="bio">
          Short bio
        </label>
        <Textarea id="bio" rows={5} placeholder="Highlight your strongest accomplishments and the outcomes you deliver." {...register("bio")} />
        {errors.bio ? <p className="text-sm text-red-500">{errors.bio.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="skills">
          Key skills
        </label>
        <Input id="skills" placeholder="React, Node.js, Tailwind CSS" {...register("skills")} aria-describedby="skills-help" />
        <p id="skills-help" className="text-xs text-muted">
          Separate your skills with commas so employers can discover you easily.
        </p>
        {errors.skills ? <p className="text-sm text-red-500">{errors.skills.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="hourlyRate">
            Hourly rate (USD)
          </label>
          <Input
            id="hourlyRate"
            type="number"
            min={0}
            step="1"
            placeholder="25"
            {...register("hourlyRate", {
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) {
                  return undefined;
                }

                const parsed = Number(value);
                return Number.isNaN(parsed) ? undefined : parsed;
              },
            })}
          />
          {errors.hourlyRate ? <p className="text-sm text-red-500">{errors.hourlyRate.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="location">
            Location
          </label>
          <Input id="location" placeholder="Dhaka, Bangladesh" {...register("location")} />
          {errors.location ? <p className="text-sm text-red-500">{errors.location.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="website">
            Portfolio or website (optional)
          </label>
          <Input id="website" placeholder="https://yourportfolio.com" {...register("website")} />
          {errors.website ? <p className="text-sm text-red-500">{errors.website.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="phone">
            Phone (optional)
          </label>
          <Input id="phone" placeholder="+8801XXXXXXXXX" {...register("phone")} />
          {errors.phone ? <p className="text-sm text-red-500">{errors.phone.message}</p> : null}
        </div>
      </div>

      <InfoNote />

      <Button type="submit" loading={loading}>
        Save and continue
      </Button>
    </form>
  );
}

function EmployerOnboardingForm({ profile }: { profile: Tables<"profiles"> }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployerValues>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      title: profile.title ?? profile.company_name ?? "",
      companyName: profile.company_name ?? "",
      hiringNeeds: profile.bio ?? "",
      location: profile.location ?? "",
      website: profile.website ?? "",
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = async (values: EmployerValues) => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        title: values.title,
        company_name: values.companyName,
        bio: values.hiringNeeds,
        location: values.location,
        website: values.website ?? null,
        phone: values.phone ?? null,
        onboarding_complete: true,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Your company profile is ready!");
    router.push("/employer/dashboard");
    router.refresh();
    setLoading(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="companyName">
          Company name
        </label>
        <Input id="companyName" placeholder="Your company or brand" {...register("companyName")} />
        {errors.companyName ? <p className="text-sm text-red-500">{errors.companyName.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="title">
          Hiring focus / team
        </label>
        <Input id="title" placeholder="e.g. Product Design Team" {...register("title")} />
        {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="hiringNeeds">
          What kind of talent are you looking for?
        </label>
        <Textarea id="hiringNeeds" rows={5} placeholder="Describe the skills, experience, and collaboration style you value most." {...register("hiringNeeds")} />
        {errors.hiringNeeds ? <p className="text-sm text-red-500">{errors.hiringNeeds.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="location">
            Company location
          </label>
          <Input id="location" placeholder="Dhaka, Bangladesh" {...register("location")} />
          {errors.location ? <p className="text-sm text-red-500">{errors.location.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted" htmlFor="website">
            Company website
          </label>
          <Input id="website" placeholder="https://yourcompany.com" {...register("website")} />
          {errors.website ? <p className="text-sm text-red-500">{errors.website.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="phone">
          Contact number (optional)
        </label>
        <Input id="phone" placeholder="+8801XXXXXXXXX" {...register("phone")} />
        {errors.phone ? <p className="text-sm text-red-500">{errors.phone.message}</p> : null}
      </div>

      <InfoNote />

      <Button type="submit" loading={loading}>
        Save and continue
      </Button>
    </form>
  );
}

function InfoNote() {
  return (
    <div className="rounded-[var(--radius-md)] border border-card-border bg-foreground/5 p-4 text-sm text-muted">
      <p className="flex items-center gap-2">
        <Badge variant="muted">Tip</Badge> You can update advanced profile details, upload a portfolio, and add payment preferences later from your dashboard.
      </p>
    </div>
  );
}
