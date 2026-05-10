"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";
import { Download } from "@/components/icons/Icons";
import { site } from "@/lib/site";

const links = [
  { id: "home", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Publications" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = ["home", "projects", "blog", "contact"];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  function onNav(id: string) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isHome) {
        // let the link navigate to /#id naturally
        return;
      }
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        setActive(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    };
  }

  function onBrand(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    e.preventDefault();
    setActive("home");
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", "/");
  }

  return (
    <header className="v2-nav">
      <div className="v2-nav-inner">
        <Link href="/#home" className="v2-brand" onClick={onBrand}>
          <span className="v2-brand-mark" aria-hidden>
            KC
          </span>
          <span className="v2-brand-name">Ken Cheng</span>
        </Link>
        <nav className="v2-nav-links">
          <div className="v2-nav-tabs">
            {links.map((l) => (
              <Link
                key={l.id}
                href={`/#${l.id}`}
                onClick={onNav(l.id)}
                className={`v2-nav-link ${
                  isHome && active === l.id ? "v2-nav-link--active" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            className="v2-btn v2-btn--ghost"
            href={site.resumePath}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={13} /> Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
