import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Briefcase, MessageCircle, Trophy, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { fromJsonArray } from "@/lib/db";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  skills: string;
}

interface Stats {
  totalProposals: number;
  activeContracts: number;
  pendingReviews: number;
  walletBalance: number;
}

interface Job {
  id: string;
  title: string;
  category: string;
  budget_mode: string;
  budget_min: number | null;
  budget_max: number | null;
  skills: string;
  created_at: string;
}

interface Proposal {
  id: string;
  status: string;
  bid_amount: number;
  bid_type: string;
  created_at: string;
  job_id: string;
  job_title?: string;
  job_category?: string;
}

async function getFreelancerStats(db: ReturnType<typeof getDB>, profileId: string): Promise<Stats> {
  if (!db) return { totalProposals: 0, activeContracts: 0, pendingReviews: 0, walletBalance: 0 };

  const [proposalsResult, contractsResult, walletResult, reviewsResult] = await Promise.all([
    db.prepare("SELECT COUNT(*) as count FROM proposals WHERE freelancer_id = ?").bind(profileId).first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM contracts WHERE freelancer_id = ? AND status IN ('active', 'submitted')").bind(profileId).first<{ count: number }>(),
    db.prepare("SELECT type, amount, status FROM wallet_transactions WHERE user_id = ? AND status IN ('pending', 'cleared')").bind(profileId).all<{ type: string; amount: number; status: string }>(),
    db.prepare("SELECT COUNT(*) as count FROM contracts WHERE freelancer_id = ? AND status = 'completed'").bind(profileId).first<{ count: number }>(),
  ]);

  const balance = walletResult.results?.reduce((acc, tx) => {
    const sign = tx.type === "withdrawal" ? -1 : 1;
    return acc + sign * Number(tx.amount ?? 0);
  }, 0) ?? 0;

  return {
    totalProposals: proposalsResult?.count ?? 0,
    activeContracts: contractsResult?.count ?? 0,
    pendingReviews: reviewsResult?.count ?? 0,
    walletBalance: Math.max(balance, 0),
  };
}

async function getRecommendedJobs(db: ReturnType<typeof getDB>): Promise<Job[]> {
  if (!db) return [];

  const result = await db
    .prepare("SELECT id, title, category, budget_mode, budget_min, budget_max, skills, created_at FROM jobs WHERE status = 'open' ORDER BY created_at DESC LIMIT 5")
    .all<Job>();

  return result.results ?? [];
}

async function getRecentProposals(db: ReturnType<typeof getDB>, profileId: string): Promise<Proposal[]> {
  if (!db) return [];

  const result = await db
    .prepare(`
      SELECT p.id, p.status, p.bid_amount, p.bid_type, p.created_at, p.job_id, j.title as job_title, j.category as job_category
      FROM proposals p
      LEFT JOIN jobs j ON p.job_id = j.id
      WHERE p.freelancer_id = ?
      ORDER BY p.created_at DESC
      LIMIT 4
    `)
    .bind(profileId)
    .all<Proposal>();

  return result.results ?? [];
}

export default async function FreelancerDashboardPage() {
  const auth = await getCurrentUser();

  if (!auth?.profile) {
    redirect("/signin");
  }

  const db = getDB();
  const profile = auth.profile as Profile;
  
  const [stats, jobs, proposals] = await Promise.all([
    getFreelancerStats(db, profile.id),
    getRecommendedJobs(db),
    getRecentProposals(db, profile.id),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <Badge className="w-fit bg-accent/20 text-accent">Welcome back</Badge>
        <div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Your freelance cockpit</h1>
          <p className="mt-2 max-w-2xl text-base text-muted">Track proposals, discover curated jobs, and manage your portfolio in one command centre.</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Briefcase className="h-6 w-6 text-accent" />} label="Active proposals" value={stats.totalProposals} />
        <StatCard icon={<Trophy className="h-6 w-6 text-accent" />} label="Contracts in progress" value={stats.activeContracts} />
        <StatCard icon={<MessageCircle className="h-6 w-6 text-accent" />} label="Pending reviews" value={stats.pendingReviews} />
        <StatCard icon={<Wallet className="h-6 w-6 text-accent" />} label="Wallet balance (BDT)" value={stats.walletBalance} currency />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recommended for you</h2>
              <p className="text-sm text-muted">Based on your skills and recent activity</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/freelancer/jobs">
                View all jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <EmptyState message="Add more skills to your profile to receive tailored job suggestions." />
            ) : (
              jobs.map((job) => {
                const skills = fromJsonArray(job.skills);
                return (
                  <Link
                    key={job.id}
                    href={`/freelancer/jobs/${job.id}`}
                    className="block rounded-[var(--radius-md)] border border-card-border/60 bg-card/60 p-5 transition hover:border-accent/40 hover:bg-accent/5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <Badge variant="muted">{job.category}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      Budget {job.budget_mode === "fixed" ? "৳" : "$"} {job.budget_min ?? "—"} - {job.budget_max ?? "—"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="outline" className="border-accent/30 text-muted">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Quick tips</h2>
            <p className="mt-1 text-sm text-muted">Boost your win rate by polishing your profile.</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>• Refresh your portfolio with your latest outcomes.</li>
              <li>• Tailor each proposal with context about the client&apos;s goals.</li>
              <li>• Share your availability in proposals for quicker responses.</li>
            </ul>
          </div>
          <Button asChild>
            <Link href="/freelancer/portfolio">Update portfolio</Link>
          </Button>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent proposals</h2>
            <p className="text-sm text-muted">Track client responses and follow up quickly.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/freelancer/proposals">Manage proposals</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proposals.length === 0 ? (
            <Card className="border-dashed text-sm text-muted">
              <p>No proposals yet. Start pitching by exploring open jobs.</p>
            </Card>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{proposal.job_title || "Job"}</h3>
                  <Badge variant="muted">{proposal.status}</Badge>
                </div>
                <p className="text-sm text-muted">
                  Bid {proposal.bid_type === "hourly" ? "$" : "৳"}
                  {proposal.bid_amount}
                </p>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href={`/freelancer/jobs/${proposal.job_id}`}>View job</Link>
                </Button>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, currency }: { icon: React.ReactNode; label: string; value: number; currency?: boolean }) {
  return (
    <Card className="space-y-2 border border-card-border/60 bg-card/70">
      <div className="flex items-center justify-between">
        {icon}
        <Badge variant="muted">{label}</Badge>
      </div>
      <p className="text-3xl font-semibold text-foreground">{currency ? `৳${value.toLocaleString()}` : value}</p>
      <p className="text-xs uppercase tracking-wide text-muted">Updated in real time</p>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-card-border/70 bg-foreground/5 p-6 text-sm text-muted">
      {message}
    </div>
  );
}
