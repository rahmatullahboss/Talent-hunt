export function SiteFooter() {
  const columns = [
    {
      title: "For Clients",
      links: [
        { label: "How to hire", href: "/#marketplace" },
        { label: "Talent Marketplace", href: "/#marketplace" },
        { label: "Project catalog", href: "/#solutions" },
        { label: "Talent scout", href: "/#enterprise" },
      ],
    },
    {
      title: "For Talent",
      links: [
        { label: "Find opportunities", href: "/jobs" },
        { label: "Talent resources", href: "/talent" },
        { label: "Help center", href: "/support" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
      ],
    },
  ];

  return (
    <footer className="bg-foreground py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:flex-row md:justify-between">
        <div className="max-w-md space-y-4">
          <p className="text-2xl font-semibold">TalentHunt</p>
          <p className="text-sm leading-relaxed text-gray-400">
            Connecting forward-thinking teams with trusted Bangladeshi freelancers and agencies to build what&apos;s next.
          </p>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} TalentHunt BD. All rights reserved.</p>
        </div>
        <div className="grid flex-1 gap-10 text-sm md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="font-semibold">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="transition hover:text-accent" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
