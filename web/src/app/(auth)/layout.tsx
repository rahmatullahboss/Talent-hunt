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
        <div className="auth-showcase-intro">
          <h2>Built for the next generation of Bangladeshi professionals</h2>
          <p>
            Join a curated community of experts, explore hand-picked projects, and grow your career with trusted local support.
          </p>
        </div>
        <div className="auth-showcase-cards">
          <div className="auth-showcase-card">
            <span>🌱</span>
            <h3>Faster client matches</h3>
            <p>Smart briefs pair you with the right opportunity in under 48 hours.</p>
          </div>
          <div className="auth-showcase-card">
            <span>🤝</span>
            <h3>Local expert support</h3>
            <p>Work with a Dhaka-based success partner who knows your goals.</p>
          </div>
        </div>
        <ul className="auth-showcase-list">
          <li>Instant project recommendations based on your skills</li>
          <li>Escrow-style milestone tracking & transparent reviews</li>
          <li>Direct support from a dedicated Bangladesh-based team</li>
        </ul>
      </div>
    </div>
  );
}
