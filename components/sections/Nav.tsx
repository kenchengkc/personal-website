"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const activeRef = useRef(active);
  activeRef.current = active;

  const [glide, setGlide] = useState<{
    x: number;
    w: number;
    ready: boolean;
  }>({ x: 0, w: 0, ready: false });

  const measureGlide = useCallback((id: string) => {
    const shell = tabsRef.current;
    const link = linkRefs.current.get(id);
    if (!shell || !link) return;
    const s = shell.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    const x = l.left - s.left;
    const w = l.width;
    setGlide((prev) => {
      if (prev.ready && Math.abs(prev.x - x) < 0.5 && Math.abs(prev.w - w) < 0.5) {
        return prev;
      }
      return { x, w, ready: true };
    });
  }, []);

  useLayoutEffect(() => {
    if (!isHome) {
      setGlide({ x: 0, w: 0, ready: false });
      return;
    }
    measureGlide(active);
  }, [active, isHome, measureGlide]);

  useLayoutEffect(() => {
    if (!isHome) return;
    const shell = tabsRef.current;
    if (!shell) return;
    const ro = new ResizeObserver(() => measureGlide(activeRef.current));
    ro.observe(shell);
    const onResize = () => measureGlide(activeRef.current);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [isHome, measureGlide]);

  useEffect(() => {
    if (!isHome) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY + 140;
        let cur = "home";
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= y) cur = id;
        }
        if (cur !== activeRef.current) {
          setActive(cur);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  function setLinkRef(id: string, el: HTMLAnchorElement | null) {
    if (el) linkRefs.current.set(id, el);
    else linkRefs.current.delete(id);
  }

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
        requestAnimationFrame(() => {
          requestAnimationFrame(() => measureGlide(id));
        });
      }
    };
  }

  function onBrand(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    e.preventDefault();
    setActive("home");
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", "/");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => measureGlide("home"));
    });
  }

  return (
    <header className="v2-nav">
      <div className="v2-nav-inner">
        <Link href="/#home" className="v2-brand" onClick={onBrand}>
          <span className="v2-brand-mark">
            <Image
              src="/images/kclogo.png"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              priority
              unoptimized
            />
          </span>
          <span className="v2-brand-name">Ken Cheng</span>
        </Link>
        <nav className="v2-nav-links">
          <div className="v2-nav-tabs" ref={tabsRef}>
            {isHome ? (
              <span
                className="v2-nav-tabs-glide"
                aria-hidden
                style={{
                  opacity: glide.ready ? 1 : 0,
                  width: glide.w,
                  transform: `translate3d(${glide.x}px, 0, 0)`,
                }}
              />
            ) : null}
            {links.map((l) => (
              <Link
                key={l.id}
                ref={(el) => setLinkRef(l.id, el)}
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
