"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FreelancerFilters({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQuery] = useState(initialQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const reset = () => {
    setQuery("");
    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <form className="flex flex-wrap items-center gap-3" onSubmit={handleSubmit}>
      <Input
        placeholder="Search by name, skill, or headline"
        value={q}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full flex-1 min-w-[240px]"
      />
      <Button type="submit" loading={isPending}>
        Search
      </Button>
      <Button type="button" variant="ghost" onClick={reset}>
        Reset
      </Button>
    </form>
  );
}
