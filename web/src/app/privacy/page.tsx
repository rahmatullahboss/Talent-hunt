import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how TalentHunt BD collects, uses, and protects your information.",
};

const informationWeCollect = [
  "Profile details you provide, such as name, contact information, skills, company information, and portfolio links.",
  "Usage data including device information, browser type, pages viewed, and referral URLs.",
  "Communication records like messages, support requests, proposals, contracts, and billing details shared through the platform.",
  "Payment and payout information submitted for invoices, escrow, or withdrawal processing.",
  "Third-party authentication data when you sign in with Google or other integrated providers.",
];

const howWeUseInformation = [
  "Create and maintain your account, including tailored onboarding and profile completion.",
  "Facilitate connections between freelancers and employers, including proposals, contracts, and project collaboration.",
  "Process payments, escrow deposits, and withdrawals securely with verified partners.",
  "Provide customer support, respond to inquiries, and deliver service updates.",
  "Improve platform performance, personalize experiences, and develop new features.",
  "Detect and prevent fraud, policy violations, and security threats.",
];

const sharingInformation = [
  "With other members when you submit proposals, contracts, or messages that require profile visibility.",
  "With service providers that support hosting, analytics, payment processing, customer communications, and security monitoring.",
  "With government authorities or regulators when legally required to comply with law enforcement requests or protective orders.",
  "During a business transaction, such as a merger or acquisition, in which case you will be notified of any changes to this policy.",
];

const yourChoices = [
  "Update your profile details, notification preferences, and communication settings from your dashboard at any time.",
  "Request data access, correction, or deletion by emailing talenthuntbd@gmail.com. We may retain certain records to meet legal obligations.",
  "Opt out of marketing emails by using the unsubscribe link or updating your notification settings.",
  "Manage browser cookies through your device settings. Disabling essential cookies may impact site functionality.",
];

const policyUpdates = [
  "We will post the updated policy date at the top of this page whenever changes are made.",
  "Material changes will be communicated via email or in-app notification before they take effect.",
  "Continued use of TalentHunt BD after policy updates means you accept the revised terms.",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl space-y-12 px-6 py-16">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-accent/80">Privacy Policy</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Your trust matters to us</h1>
          <p className="text-base text-muted md:text-lg">
            TalentHunt BD is committed to protecting your personal information and being transparent about how we use it. This policy explains what we collect, why we collect it, and the choices available to you.
          </p>
          <p className="text-sm text-muted/90">Last updated: October 23, 2025</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Information we collect</h2>
          <p className="text-sm leading-relaxed text-muted">
            We collect information that helps us build a trusted marketplace for freelancers and employers. This includes:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {informationWeCollect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">How we use your information</h2>
          <p className="text-sm leading-relaxed text-muted">
            Your data powers core experiences across TalentHunt BD. We use it to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {howWeUseInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">When we share information</h2>
          <p className="text-sm leading-relaxed text-muted">
            We do not sell your personal information. We may share information in the following situations:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {sharingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Your choices and rights</h2>
          <p className="text-sm leading-relaxed text-muted">
            You stay in control of your information. Here are the options available:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {yourChoices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Data security</h2>
          <p className="text-sm leading-relaxed text-muted">
            We use encryption, access controls, continuous monitoring, and regular security reviews to help safeguard your information. Despite these measures, no online platform can guarantee absolute security, so we encourage you to use strong passwords and enable multi-factor authentication where possible.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">International data transfers</h2>
          <p className="text-sm leading-relaxed text-muted">
            TalentHunt BD is based in Bangladesh, but we may process data using infrastructure located in other countries. When we transfer data internationally, we rely on appropriate safeguards consistent with applicable data protection laws.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Updates to this policy</h2>
          <p className="text-sm leading-relaxed text-muted">
            We may revise this policy from time to time to reflect changes in our services or legal obligations:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {policyUpdates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact us</h2>
          <p className="text-sm leading-relaxed text-muted">
            Questions about this policy or your privacy rights? Email us at{" "}
            <Link href="mailto:talenthuntbd@gmail.com" className="text-accent hover:underline">
              talenthuntbd@gmail.com
            </Link>{" "}
            or call <Link href="tel:+8801639590392" className="text-accent hover:underline">+880 1639-590392</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
