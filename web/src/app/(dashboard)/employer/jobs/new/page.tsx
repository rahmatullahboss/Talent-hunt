import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { JobForm } from "@/components/employer/jobs/job-form";

export default async function NewJobPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Post a new job</h1>
        <p className="text-sm text-muted">Describe your project and requirements to attract the right Bangladeshi talent.</p>
      </div>
      <Card className="border border-card-border/70 bg-card/80 p-6">
        <JobForm />
      </Card>
    </div>
  );
}
