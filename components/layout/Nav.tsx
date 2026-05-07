"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "HOME" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <span className="font-mono font-bold text-lg tracking-widest">
            KC
          </span>
          <span className="h-2 w-2 rounded-full bg-accent transition-transform group-hover:scale-125" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-2 text-xs font-mono tracking-widest transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-white"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-accent" />
                )}
              </Link>
            );
          })}
          <a
            href={site.resumePath}
            download
            className="ml-3 btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={12} /> RESUME
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-muted hover:text-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-bg">
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-sm font-mono tracking-widest border-b border-[var(--color-border)] ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <a
              href={site.resumePath}
              download
              className="mt-4 btn justify-center"
            >
              <Download size={12} /> RESUME PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
