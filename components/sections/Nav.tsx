import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#research", label: "Research" },
  { href: "/#writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand" aria-label="Ken Cheng, home">
        Ken Cheng
      </Link>

      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </nav>
    </header>
  );
}
