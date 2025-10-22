import Link from "next/link";

const footerLinks = [
  {
    title: "For Clients",
    links: [
      { label: "Find freelancers", href: "/freelancers" },
      { label: "Talent Marketplace", href: "/#marketplace" },
      { label: "Project catalog", href: "/#catalog" },
      { label: "Enterprise suite", href: "/#enterprise" },
    ],
  },
  {
    title: "For Talent",
    links: [
      { label: "Find work", href: "/jobs" },
      { label: "Talent resources", href: "/talent" },
      { label: "Community", href: "/community" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[#00140c] text-[#c4f2c2]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-semibold text-white">
              TalentHunt
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[#9bd691]">
              We bring Upwork-quality experiences to Bangladeshi freelancers and the teams who hire them—complete with local expertise, payment protection, and concierge support.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-[#74c36f]">
              <span className="rounded-full bg-white/5 px-3 py-1">Hire confidently</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Pay securely</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Scale globally</span>
            </div>
          </div>
          <div className="grid gap-10 text-sm font-medium text-[#c4f2c2] sm:grid-cols-2 md:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-3">
                <p className="text-base font-semibold text-white">{column.title}</p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link className="transition hover:text-white" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-[#74c36f] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TalentHunt BD. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/cookies" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
