import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { AvatarUploader } from "@/components/freelancer/profile/avatar-uploader";
import { FreelancerProfileForm } from "@/components/freelancer/profile/profile-form";

export default async function FreelancerProfilePage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Profile settings</h1>
        <p className="text-sm text-muted">Keep your profile fresh so employers understand your strengths at a glance.</p>
      </div>

      <Card className="space-y-6 border border-card-border/70 bg-card/80 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Profile photo</h2>
          <AvatarUploader profile={auth.profile} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Professional details</h2>
          <FreelancerProfileForm profile={auth.profile} />
        </div>
      </Card>
    </div>
  );
}
