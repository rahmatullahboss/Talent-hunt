"use client";

import { useState, useCallback } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AIGenerateButtonProps {
  contentType: "bio" | "job_description" | "proposal" | "message";
  context: string;
  onGenerate: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function AIGenerateButton({
  contentType,
  context,
  onGenerate,
  disabled = false,
  className = "",
}: AIGenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!context.trim()) {
      toast.error("Please fill in some context first");
      return;
    }

    setIsGenerating(true);
    let generatedText = "";

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          context,
          instructions: instructions.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        generatedText += chunk;
        onGenerate(generatedText);
      }

      setIsOpen(false);
      setInstructions("");
      toast.success("Content generated!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate");
    } finally {
      setIsGenerating(false);
    }
  }, [contentType, context, instructions, onGenerate]);

  const handleQuickGenerate = useCallback(() => {
    setInstructions("");
    handleGenerate();
  }, [handleGenerate]);

  const contentTypeLabels = {
    bio: "bio",
    job_description: "job description",
    proposal: "proposal",
    message: "message",
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleQuickGenerate}
          disabled={disabled || isGenerating || !context.trim()}
          className="gap-1.5 text-accent hover:text-accent border-accent/30 hover:border-accent/50 hover:bg-accent/5"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              AI Generate
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isGenerating}
          className="text-muted hover:text-foreground"
        >
          + Add instructions
        </Button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-card-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Extra Instructions
            </h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <Textarea
            placeholder={`E.g., "Focus on 5 years of React experience" or "Highlight my photography skills"`}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="mb-3 h-20 resize-none text-sm"
            disabled={isGenerating}
          />
          
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || !context.trim()}
            className="w-full gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating {contentTypeLabels[contentType]}...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate with instructions
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
