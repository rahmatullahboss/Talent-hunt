import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Understand the rules that govern your use of TalentHunt BD.",
};

const userCommitments = [
  "Provide accurate, up-to-date account information and maintain the security of your login credentials.",
  "Comply with applicable laws, regulations, and professional standards when collaborating through the platform.",
  "Respect the confidentiality of project details, proposals, and communications shared by other members.",
  "Avoid posting unlawful, discriminatory, or infringing content, and report suspicious activity to our team.",
  "Use TalentHunt BD for legitimate freelancer and employer engagements; automated scraping or spamming is prohibited.",
];

const platformCommitments = [
  "Maintain the availability and security of the platform with commercially reasonable efforts.",
  "Provide onboarding, support, and dispute assistance to help keep projects on track.",
  "Review reported profiles, jobs, or proposals and take appropriate action, including suspension or removal when necessary.",
  "Handle personal information according to our Privacy Policy and applicable data protection laws.",
];

const paymentTerms = [
  "Freelancers agree to the budget, milestones, and payment schedules set in each contract or proposal.",
  "Employers authorize TalentHunt BD and its payment partners to hold escrow funds and release payments when milestones are approved.",
  "Service fees are outlined per engagement and may vary based on contract type or marketplace promotions.",
  "Withdrawals require identity and payment method verification to comply with Know Your Customer (KYC) requirements.",
  "Chargebacks, failed payments, or disputes may result in temporary account limitations while we investigate.",
];

const intellectualProperty = [
  "Freelancers retain ownership of pre-existing materials and grant clients a license to use deliverables as agreed in the contract.",
  "Employers own the final deliverables once payment is completed, unless otherwise stated in the project agreement.",
  "TalentHunt BD retains rights to the platform, brand, and supporting materials, which may not be copied or resold.",
];

const terminationPolicy = [
  "You may close your account at any time from your dashboard or by contacting talenthuntbd@gmail.com.",
  "We may suspend or terminate accounts that violate these terms, misuse the platform, or create security risks.",
  "Outstanding fees or disputes must be resolved before final account closure.",
];

const disputeResolution = [
  "Members should first attempt to resolve disagreements directly through messages or project updates.",
  "Either party can request TalentHunt BD mediation for project milestones, deliverables, or payment releases.",
  "If mediation fails, disputes may be escalated to binding arbitration or local courts in Bangladesh, depending on contract terms.",
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl space-y-12 px-6 py-16">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-accent/80">Terms of Service</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Guiding how we work together</h1>
          <p className="text-base text-muted md:text-lg">
            These terms govern your access to and use of TalentHunt BD. By creating an account or using the platform, you agree to the commitments and responsibilities outlined below.
          </p>
          <p className="text-sm text-muted/90">Last updated: October 23, 2025</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Acceptance of terms</h2>
          <p className="text-sm leading-relaxed text-muted">
            By using TalentHunt BD, you confirm that you are at least 18 years old (or have reached the age of majority in your jurisdiction) and have the legal authority to enter into agreements. If you use the platform on behalf of a company or organization, you confirm you have authority to bind that entity to these terms.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Your responsibilities</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {userCommitments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Our commitments</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {platformCommitments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Payments and fees</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {paymentTerms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Intellectual property</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {intellectualProperty.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-muted">
            If you believe your copyright or trademark has been infringed on TalentHunt BD, notify us at{" "}
            <Link href="mailto:talenthuntbd@gmail.com" className="text-accent hover:underline">
              talenthuntbd@gmail.com
            </Link>{" "}
            with details of the protected work and alleged violation.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Termination</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {terminationPolicy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Dispute resolution</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted">
            {disputeResolution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Changes to these terms</h2>
          <p className="text-sm leading-relaxed text-muted">
            We may update these terms occasionally to reflect new features, legal requirements, or operational changes. When we make material updates, we will provide advance notice via email or in-app messaging. Continued use of the platform after the effective date means you accept the revised terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact information</h2>
          <p className="text-sm leading-relaxed text-muted">
            Questions or concerns about these terms? Email us at{" "}
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
