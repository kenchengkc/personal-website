import Image from "next/image";
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
    <header className="site-rail">
      <div className="rail-identity">
        <Link href="/" className="rail-brand" aria-label="Ken Cheng, home">
          <Image
            src="/images/kclogo.png"
            alt=""
            width={42}
            height={42}
            className="rail-logo"
            priority
          />
          <span>
            <strong>Ken Cheng</strong>
            <small>CS @ Columbia</small>
          </span>
        </Link>

        <span className="rail-status">
          <i aria-hidden="true" />
          Summer 2027
        </span>
      </div>

      <nav className="rail-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </nav>

      <div className="rail-links">
        <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${site.email}`}>Email</a>
      </div>
    </header>
  );
}
