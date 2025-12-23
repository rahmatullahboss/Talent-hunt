import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Briefcase, MessageSquare, UsersRound } from "lucide-react";
import { getCurrentUser, getDBAsync } from "@/lib/auth/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface ProposalWithJob {
  id: string;
  status: string;
  created_at: string;
  freelancer_id: string;
  job_title: string | null;
  job_id: string | null;
}

interface ContractWithJob {
  id: string;
  status: string;
  created_at: string;
  freelancer_id: string;
  job_title: string | null;
  job_id: string | null;
}

export default async function EmployerDashboardPage() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  const d1 = await getDBAsync();
  let jobs: Job[] = [];
  let proposals: ProposalWithJob[] = [];
  let contracts: ContractWithJob[] = [];

  if (d1) {
    try {
      const [jobsResult, proposalsResult, contractsResult] = await Promise.all([
        d1.prepare(`
          SELECT id, title, status, created_at
          FROM jobs
          WHERE employer_id = ?
          ORDER BY created_at DESC
        `).bind(auth.profile.id).all<Job>(),
        d1.prepare(`
          SELECT 
            p.id, p.status, p.created_at, p.freelancer_id,
            j.title as job_title, j.id as job_id
          FROM proposals p
          JOIN jobs j ON p.job_id = j.id
          WHERE j.employer_id = ?
          ORDER BY p.created_at DESC
          LIMIT 5
        `).bind(auth.profile.id).all<ProposalWithJob>(),
        d1.prepare(`
          SELECT 
            c.id, c.status, c.created_at, c.freelancer_id,
            j.title as job_title, j.id as job_id
          FROM contracts c
          JOIN jobs j ON c.job_id = j.id
          WHERE c.employer_id = ?
          ORDER BY c.created_at DESC
          LIMIT 5
        `).bind(auth.profile.id).all<ContractWithJob>(),
      ]);

      jobs = jobsResult.results ?? [];
      proposals = proposalsResult.results ?? [];
      contracts = contractsResult.results ?? [];
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  const openJobs = jobs.filter((job) => job.status === "open").length;
  const inProgress = jobs.filter((job) => job.status === "in_progress").length;
  const totalApplicants = proposals.length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <Badge className="w-fit bg-accent/20 text-accent">Employer hub</Badge>
        <div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Build your dream team faster</h1>
          <p className="mt-2 max-w-2xl text-base text-muted">Post opportunities, review proposals, and manage collaboration from one dashboard.</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Briefcase className="h-6 w-6 text-accent" />} label="Open jobs" value={openJobs} />
        <StatCard icon={<MessageSquare className="h-6 w-6 text-accent" />} label="Jobs in progress" value={inProgress} />
        <StatCard icon={<UsersRound className="h-6 w-6 text-accent" />} label="Recent proposals" value={totalApplicants} />
        <Card className="space-y-3 border border-card-border/60 bg-card/70 p-4">
          <p className="text-sm font-semibold text-foreground">Need fresh talent?</p>
          <Button asChild>
            <Link href="/employer/jobs/new">
              Post a job now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Latest proposals</h2>
            <Button asChild variant="ghost">
              <Link href="/employer/jobs">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {proposals.length === 0 ? (
              <EmptyState message="No proposals yet. Share more project details or invite freelancers directly." />
            ) : (
              proposals.map((proposal) => (
                <Card key={proposal.id} className="flex items-center justify-between border border-card-border/60 bg-card/70 p-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{proposal.job_title ?? "Contract"}</p>
                    <p className="text-xs text-muted">Received {new Date(proposal.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="muted">{proposal.status}</Badge>
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className="space-y-4 border border-card-border/70 bg-card/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Active contracts</h2>
            <Button asChild variant="ghost">
              <Link href="/employer/contracts">Manage</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {contracts.length === 0 ? (
              <EmptyState message="No active contracts. Hire a freelancer to kickstart your next project." />
            ) : (
              contracts.map((contract) => (
                <Card key={contract.id} className="flex items-center justify-between border border-card-border/60 bg-card/70 p-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{contract.job_title ?? "Contract"}</p>
                    <p className="text-xs text-muted">{new Date(contract.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="muted">{contract.status}</Badge>
                </Card>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="space-y-2 border border-card-border/60 bg-card/70 p-4">
      <div className="flex items-center justify-between">
        {icon}
        <p className="text-xs uppercase text-muted">{label}</p>
      </div>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed bg-foreground/5 p-4 text-sm text-muted">
      {message}
    </Card>
  );
}
