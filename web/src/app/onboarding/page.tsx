import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { OnboardingForm } from "@/components/forms/onboarding-form";

export default async function OnboardingPage() {
  const auth = await getCurrentUser();

  if (!auth?.user) {
    redirect("/signin");
  }

  if (auth.profile?.onboarding_complete) {
    switch (auth.profile.role) {
      case "freelancer":
        redirect("/freelancer/dashboard");
        break;
      case "employer":
        redirect("/employer/dashboard");
        break;
      case "admin":
        redirect("/admin/dashboard");
        break;
      default:
        redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eefbf4] via-[#f6fdf8] to-white text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
        <div className="space-y-3">
          <Badge className="bg-accent/20 text-accent">Almost there!</Badge>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Help us tailor TalentHunt BD to you</h1>
          <p className="max-w-3xl text-base text-muted/90">
            Share a few details so employers and collaborators can learn about you instantly. You can always update this information later from your dashboard.
          </p>
        </div>
        <Card className="border border-card-border/80 bg-card/95 p-8 shadow-lg shadow-foreground/5">
          <OnboardingForm profile={auth.profile} />
        </Card>
      </main>
    </div>
  );
}
