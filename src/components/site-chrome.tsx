import Link from "next/link";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Résumé" },
];

export function SiteHeader() {
  return (
    <header className="border-b u-rule">
      <nav className="mx-auto flex max-w-3xl items-baseline justify-between gap-6 px-6 py-5">
        <Link href="/" className="u-mono text-sm font-medium tracking-tight">
          alicodes.dev
        </Link>
        <ul className="u-mono flex gap-5 text-xs">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="u-soft hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t u-rule">
      <div className="u-mono mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
        <span className="u-faint">Ali Ezzeddine — Beirut, Lebanon</span>
        <div className="flex gap-4">
          <a className="u-soft hover:underline" href="mailto:ali@alicodes.dev">
            Email
          </a>
          <a className="u-soft hover:underline" href="https://github.com/AliCodesDev">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
