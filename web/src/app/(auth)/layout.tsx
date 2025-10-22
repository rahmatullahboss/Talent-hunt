import type { Metadata } from "next";
import Link from "next/link";
import "./auth.css";

const stats = [
  { value: "12K+", label: "Verified Bangladeshi specialists" },
  { value: "48h", label: "Average time to shortlist" },
  { value: "4.9/5", label: "Client satisfaction" },
];

const proofPoints = [
  {
    title: "Curated talent, ready to collaborate",
    description:
      "Every profile is screened for craft, communication, and delivery so you start with confidence.",
  },
  {
    title: "Protected payments & transparent milestones",
    description: "Escrow-style billing keeps projects on track and both sides protected from kickoff to payout.",
  },
  {
    title: "Local success team by your side",
    description: "Bangladesh-based support helps you source roles, review proposals, and unblock collaboration fast.",
  },
];

export const metadata: Metadata = {
  title: {
    template: "%s | TalentHunt BD",
    default: "Access your account",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <Link href="/" className="auth-brand">
          TalentHunt <span>BD</span>
        </Link>
        <div className="auth-card">
          <div className="auth-card__headline">
            <p>Bangladesh&apos;s curated marketplace for cross-border collaboration.</p>
          </div>
          <div className="auth-content">{children}</div>
        </div>
        <dl className="auth-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="auth-stat">
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="auth-showcase">
        <div className="auth-showcase__inner">
          <h2>Grow with the same experience you felt on the homepage</h2>
          <p>
            A calm, green-forward workspace built to mirror the TalentHunt home experience so your journey stays consistent
            end to end.
          </p>
          <ul>
            {proofPoints.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
