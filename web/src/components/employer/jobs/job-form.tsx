"use client";

import { useEffect, useTransition, useState, useCallback } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { createJobAction, type JobActionState } from "@/actions/jobs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIGenerateButton } from "@/components/ai/ai-generate-button";

const initialState: JobActionState = { status: "idle" };

export function JobForm() {
  const [state, formAction] = useFormState(createJobAction, initialState);
  const [isPending, startTransition] = useTransition();
  
  // Controlled state for AI generation
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");

  // AI context for job description generation
  const aiContext = `Job title: ${title}\nCategory: ${category}\nRequired skills: ${skills}`;

  // Handle AI generated description
  const handleAIDescription = useCallback((text: string) => {
    setDescription(text);
  }, []);

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
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="title">
          Job title
        </label>
        <Input 
          id="title" 
          name="title" 
          placeholder="Looking for a React Native developer" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted" htmlFor="description">
            Project description
          </label>
          <AIGenerateButton
            contentType="job_description"
            context={aiContext}
            onGenerate={handleAIDescription}
            disabled={!title.trim()}
          />
        </div>
        <Textarea
          id="description"
          name="description"
          rows={8}
          placeholder="Share the project context, expected deliverables, timeline, and collaboration style."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="category">
            Category
          </label>
          <Input 
            id="category" 
            name="category" 
            placeholder="Product Design" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="budgetMode">
            Budget type
          </label>
          <select
            id="budgetMode"
            name="budgetMode"
            className="h-11 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-4 text-sm text-foreground"
          >
            <option value="fixed">Fixed price</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="experience">
            Experience level
          </label>
          <select
            id="experience"
            name="experience"
            className="h-11 w-full rounded-[var(--radius-md)] border border-card-border bg-card px-4 text-sm text-foreground"
            defaultValue="mid"
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="budgetMin">
            Min budget (USD)
          </label>
          <Input id="budgetMin" name="budgetMin" type="number" min={0} step="10" placeholder="500" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="budgetMax">
            Max budget (USD)
          </label>
          <Input id="budgetMax" name="budgetMax" type="number" min={0} step="10" placeholder="1500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted" htmlFor="deadline">
            Deadline (optional)
          </label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="skills">
          Required skills (comma separated)
        </label>
        <Input 
          id="skills" 
          name="skills" 
          placeholder="React Native, REST APIs, Firebase" 
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required 
        />
      </div>

      <Button type="submit" loading={isPending}>
        Publish job
      </Button>
    </form>
  );
}
