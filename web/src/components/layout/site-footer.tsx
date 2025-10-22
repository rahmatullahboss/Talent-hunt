export function SiteFooter() {
  const links = [
    {
      title: "TalentHunt BD",
      items: [
        { label: "About", href: "/about" },
        { label: "Press", href: "/press" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Clients",
      items: [
        { label: "Post a job", href: "/signup?role=employer" },
        { label: "Enterprise", href: "/enterprise" },
        { label: "Success stories", href: "/success" },
      ],
    },
    {
      title: "Talent",
      items: [
        { label: "Find work", href: "/jobs" },
        { label: "Talent guide", href: "/talent" },
        { label: "Community", href: "/community" },
      ],
    },
  ];

  return (
    <footer className="border-t border-card-border/60 bg-white/90 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 text-sm text-muted md:flex-row md:justify-between">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-foreground">
            TalentHunt <span className="text-accent">BD</span>
          </p>
          <p className="max-w-sm">
            Empowering Bangladeshi professionals to collaborate with global teams through trusted, transparent workspaces.
          </p>
          <p className="text-xs text-muted/80">© {new Date().getFullYear()} TalentHunt BD. All rights reserved.</p>
        </div>
        <div className="grid flex-1 gap-8 text-sm md:grid-cols-3">
          {links.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="font-semibold text-foreground">{section.title}</p>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a className="transition hover:text-accent" href={item.href}>
                      {item.label}
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
