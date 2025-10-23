import type { Metadata } from "next";
import Link from "next/link";
import "./auth.css";

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
        <div className="auth-card">
          <Link href="/" className="auth-brand">
            TalentHunt <span>BD</span>
          </Link>
          <div className="auth-card-copy">One login for hiring and growing your freelance career.</div>
          <div className="auth-content">{children}</div>
        </div>
      </div>
      <div className="auth-showcase">
        <h2>Built for the next generation of Bangladeshi professionals</h2>
        <p>
          Join a curated community of experts, explore hand-picked projects, and grow your career with trusted local support.
        </p>
        <ul>
          <li>Instant project recommendations based on your skills</li>
          <li>Escrow-style milestone tracking & transparent reviews</li>
          <li>Direct support from a dedicated Bangladesh-based team</li>
        </ul>
      </div>
    </div>
  );
}
