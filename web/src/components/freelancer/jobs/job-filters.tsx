"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = ["Design", "Development", "Marketing", "Writing", "Customer Support", "Data & Analytics", "Product"];
const experiences = [
  { label: "Entry level", value: "entry" },
  { label: "Mid level", value: "mid" },
  { label: "Expert", value: "expert" },
];

type Filters = {
  q: string;
  category: string;
  experience: string;
  minBudget: string;
  maxBudget: string;
};

export function JobFilters({ defaultSkills, initialSelectedSkills, initialFilters }: { defaultSkills: string[]; initialSelectedSkills: string[]; initialFilters: Filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState<string[]>(initialSelectedSkills);
  const [formState, setFormState] = useState(initialFilters);

  const updateUrl = (params: Record<string, string>) => {
    const newSearch = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearch.set(key, value);
      } else {
        newSearch.delete(key);
      }
    });
    startTransition(() => {
      router.replace(`${pathname}?${newSearch.toString()}`);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUrl({
      q: formState.q,
      category: formState.category,
      experience: formState.experience,
      minBudget: formState.minBudget,
      maxBudget: formState.maxBudget,
      skills: skills.join(","),
    });
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      }
      return [...prev, skill];
    });
  };

  const clearFilters = () => {
    setFormState({ q: "", category: "", experience: "", minBudget: "", maxBudget: "" });
    setSkills(defaultSkills.slice(0, 6));
    router.replace(pathname);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[var(--radius-lg)] border border-card-border/70 bg-card/80 p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted">Search</label>
          <Input
            placeholder="React developer, logo designer..."
            value={formState.q}
            onChange={(event) => setFormState((prev) => ({ ...prev, q: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted">Category</label>
          <select
            className="h-11 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-4 text-sm text-foreground"
            value={formState.category}
            onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted">Experience level</label>
          <select
            className="h-11 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-4 text-sm text-foreground"
            value={formState.experience}
            onChange={(event) => setFormState((prev) => ({ ...prev, experience: event.target.value }))}
          >
            <option value="">Any experience</option>
            {experiences.map((exp) => (
              <option key={exp.value} value={exp.value}>
                {exp.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted">Min budget</label>
          <Input
            type="number"
            min={0}
            placeholder="৳0"
            value={formState.minBudget}
            onChange={(event) => setFormState((prev) => ({ ...prev, minBudget: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted">Max budget</label>
          <Input
            type="number"
            min={0}
            placeholder="৳100000"
            value={formState.maxBudget}
            onChange={(event) => setFormState((prev) => ({ ...prev, maxBudget: event.target.value }))}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium text-muted">Focus on skills</p>
        <div className="flex flex-wrap gap-2">
          {defaultSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs transition ${skills.includes(skill) ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted"}`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" loading={isPending}>
          Apply filters
        </Button>
        <Button type="button" variant="ghost" onClick={clearFilters}>
          Reset
        </Button>
        {skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="muted">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </form>
  );
}
