import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./auth.css";

export const metadata: Metadata = {
  title: {
    template: "%s | TalentHunt BD",
    default: "Access your account",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="auth-shell">
          <div className="auth-panel">
            <div className="auth-card">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Link href="/" className="auth-brand">
                    TalentHunt <span>BD</span>
                  </Link>
                  <div className="auth-card-copy">One login for hiring and growing your freelance career.</div>
                </div>
                <div className="auth-content">{children}</div>
              </div>
            </div>
          </div>
          <div className="auth-showcase">
            <div className="auth-showcase-panel">
              <div className="auth-showcase-header">
                <span className="auth-showcase-badge">Why TalentHunt BD</span>
                <h2>Built for the next generation of Bangladeshi professionals</h2>
                <p>
                  Join a curated community of experts, explore hand-picked projects, and grow your career with trusted local
                  support.
                </p>
              </div>
              <div className="auth-showcase-highlights">
                <div className="auth-showcase-highlight">
                  <span aria-hidden>??</span>
                  <div>
                    <h3>Faster client matches</h3>
                    <p>Smart briefs pair you with the right opportunity in under 48 hours.</p>
                  </div>
                </div>
                <div className="auth-showcase-highlight">
                  <span aria-hidden>??</span>
                  <div>
                    <h3>Local expert support</h3>
                    <p>Work with a Dhaka-based success partner who knows your goals.</p>
                  </div>
                </div>
              </div>
              <div className="auth-showcase-divider" aria-hidden />
              <ul className="auth-showcase-list">
                <li>Instant project recommendations based on your skills</li>
                <li>Escrow-style milestone tracking & transparent reviews</li>
                <li>Direct support from a dedicated Bangladesh-based team</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
