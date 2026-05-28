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
import { ChevronDown } from "lucide-react";
import { Download } from "@/components/icons/Icons";
import { site } from "@/lib/site";

const links = [
  { id: "home", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Publications" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = ["home", "projects", "blog", "contact"];

/** Narrow home: hysteresis so dense ↔ full nav doesn’t flip in one scroll band
 *  (avoids a frame where the grid squeezes and “Ken Cheng” wraps). */
const MOBILE_NAV_DENSE_ENTER = 66;
const MOBILE_NAV_DENSE_LEAVE = 78;

function mobileNavDenseFromHeroBottom(
  heroBottom: number,
  wasDense: boolean,
): boolean {
  if (wasDense) {
    return heroBottom < MOBILE_NAV_DENSE_LEAVE;
  }
  return heroBottom < MOBILE_NAV_DENSE_ENTER;
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string>("home");
  const [narrow, setNarrow] = useState(false);
  const [navDense, setNavDense] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [mnavDdTop, setMnavDdTop] = useState(62);

  const updateMnavDdTop = useCallback(() => {
    const h = headerRef.current;
    if (!h) return;
    setMnavDdTop(Math.round(h.getBoundingClientRect().bottom + 6));
  }, []);

  const tabsRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const activeRef = useRef(active);
  activeRef.current = active;

  const programmaticScrollLockRef = useRef<string | null>(null);
  const programmaticScrollTimerRef = useRef<number | null>(null);

  function releaseProgrammaticScrollLock() {
    programmaticScrollLockRef.current = null;
    if (programmaticScrollTimerRef.current != null) {
      window.clearTimeout(programmaticScrollTimerRef.current);
      programmaticScrollTimerRef.current = null;
    }
    if (isHome && narrow) {
      window.requestAnimationFrame(() => {
        const hero = document.getElementById("home");
        if (!hero) return;
        setNavDense((dense) =>
          mobileNavDenseFromHeroBottom(
            hero.getBoundingClientRect().bottom,
            dense,
          ),
        );
      });
    }
  }

  function armProgrammaticScrollLock(targetId: string) {
    if (programmaticScrollTimerRef.current != null) {
      window.clearTimeout(programmaticScrollTimerRef.current);
    }
    programmaticScrollLockRef.current = targetId;
    programmaticScrollTimerRef.current = window.setTimeout(
      releaseProgrammaticScrollLock,
      1200,
    );
  }

  const [glide, setGlide] = useState<{
    x: number;
    w: number;
    ready: boolean;
  }>({ x: 0, w: 0, ready: false });

  const ddListRef = useRef<HTMLDivElement>(null);
  const ddLinkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [ddGlide, setDdGlide] = useState<{
    y: number;
    h: number;
    ready: boolean;
  }>({ y: 0, h: 0, ready: false });

  const ddActiveId = isHome
    ? active
    : pathname.startsWith("/blog")
      ? "blog"
      : "home";

  const measureGlide = useCallback((id: string) => {
    const shell = tabsRef.current;
    const link = linkRefs.current.get(id);
    if (!shell || !link) return;
    const s = shell.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    const x = l.left - s.left;
    const w = l.width;
    setGlide((prev) => {
      if (
        prev.ready &&
        Math.abs(prev.x - x) < 0.5 &&
        Math.abs(prev.w - w) < 0.5
      ) {
        return prev;
      }
      return { x, w, ready: true };
    });
  }, []);

  const measureDdGlide = useCallback(() => {
    const shell = ddListRef.current;
    const link = ddLinkRefs.current.get(ddActiveId);
    if (!shell || !link) return;
    const sr = shell.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    const y = lr.top - sr.top;
    const h = lr.height;
    setDdGlide((prev) => {
      if (
        prev.ready &&
        Math.abs(prev.y - y) < 0.5 &&
        Math.abs(prev.h - h) < 0.5
      ) {
        return prev;
      }
      return { y, h, ready: true };
    });
  }, [ddActiveId]);

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

  useLayoutEffect(() => {
    if (!narrow || !mobileMenuOpen) return;
    measureDdGlide();
    const id = window.requestAnimationFrame(() => measureDdGlide());
    return () => window.cancelAnimationFrame(id);
  }, [narrow, mobileMenuOpen, measureDdGlide, ddActiveId]);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isHome || !narrow) {
      setNavDense(false);
      return;
    }
    const onScroll = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      setNavDense((dense) =>
        mobileNavDenseFromHeroBottom(
          hero.getBoundingClientRect().bottom,
          dense,
        ),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, narrow]);

  useLayoutEffect(() => {
    if (!narrow || !mobileMenuOpen) return;
    updateMnavDdTop();
    const h = headerRef.current;
    const ro = h ? new ResizeObserver(updateMnavDdTop) : null;
    if (h && ro) ro.observe(h);
    window.addEventListener("resize", updateMnavDdTop);
    window.addEventListener("scroll", updateMnavDdTop, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateMnavDdTop);
      window.removeEventListener("scroll", updateMnavDdTop);
    };
  }, [narrow, mobileMenuOpen, updateMnavDdTop]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onDocDown(e: Event) {
      const el = mobileWrapRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setMobileMenuOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isHome) return;
    const onScrollEnd = () => {
      // Delay lock release by 2 frames so any pending scroll-handler
      // rAFs run while the lock is still set, preventing a one-frame
      // glide jitter when the observer briefly detects the wrong section.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          releaseProgrammaticScrollLock();
        });
      });
    };
    window.addEventListener("scrollend", onScrollEnd);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (programmaticScrollLockRef.current) {
          return;
        }
        // Document-space section tops vs scroll position; bias uses live nav height.
        const navH = headerRef.current?.getBoundingClientRect().height ?? 72;
        const y = window.scrollY + navH + 28;
        let cur = "home";
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= y) cur = id;
        }
        if (cur !== activeRef.current) {
          setActive(cur);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      releaseProgrammaticScrollLock();
    };
  }, [isHome]);

  function setLinkRef(id: string, el: HTMLAnchorElement | null) {
    if (el) linkRefs.current.set(id, el);
    else linkRefs.current.delete(id);
  }

  function setDdLinkRef(id: string, el: HTMLAnchorElement | null) {
    if (el) ddLinkRefs.current.set(id, el);
    else ddLinkRefs.current.delete(id);
  }

  function onNav(id: string) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isHome) {
        setMobileMenuOpen(false);
        return;
      }
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        armProgrammaticScrollLock(id);
        setActive(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        setMobileMenuOpen(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => measureGlide(id));
        });
      }
    };
  }

  function onBrand(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    e.preventDefault();
    armProgrammaticScrollLock("home");
    setActive("home");
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", "/");
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => measureGlide("home"));
    });
  }

  const currentNavLabel =
    links.find((l) => l.id === ddActiveId)?.label ?? "About";

  return (
    <header
      ref={headerRef}
      className={["v2-nav", navDense ? "v2-nav--dense" : ""]
        .filter(Boolean)
        .join(" ")}
    >
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
            />
          </span>
          <span className="v2-brand-name">Ken Cheng</span>
        </Link>
        <nav className="v2-nav-links">
          {isHome ? (
            <>
              <div className="v2-nav-tabs v2-nav-tabs--desktop" ref={tabsRef}>
                <span
                  className="v2-nav-tabs-glide"
                  aria-hidden
                  style={{
                    opacity: glide.ready ? 1 : 0,
                    width: glide.w,
                    transform: `translate3d(${glide.x}px, 0, 0)`,
                  }}
                />
                {links.map((l) => (
                  <Link
                    key={l.id}
                    ref={(el) => setLinkRef(l.id, el)}
                    href={`/#${l.id}`}
                    onClick={onNav(l.id)}
                    className={`v2-nav-link ${
                      active === l.id ? "v2-nav-link--active" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="v2-nav-mnav" ref={mobileWrapRef}>
                <button
                  type="button"
                  className="v2-nav-mnav-trigger"
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="listbox"
                  aria-controls="v2-nav-mnav-panel"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                >
                  <span className="v2-nav-mnav-trigger-label">
                    {currentNavLabel}
                  </span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className={
                      mobileMenuOpen ? "v2-nav-mnav-chevron v2-nav-mnav-chevron--open" : "v2-nav-mnav-chevron"
                    }
                    aria-hidden
                  />
                </button>
                {mobileMenuOpen ? (
                  <div
                    id="v2-nav-mnav-panel"
                    className={[
                      "v2-nav-mnav-panel",
                      narrow ? "v2-nav-mnav-panel--dock" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={narrow ? { top: mnavDdTop } : undefined}
                    role="listbox"
                    ref={ddListRef}
                  >
                    <span
                      className="v2-nav-mnav-glide"
                      aria-hidden
                      style={{
                        opacity: ddGlide.ready ? 1 : 0,
                        top: ddGlide.y,
                        height: ddGlide.h,
                      }}
                    />
                    {links.map((l) => (
                      <Link
                        key={l.id}
                        ref={(el) => setDdLinkRef(l.id, el)}
                        href={`/#${l.id}`}
                        role="option"
                        aria-selected={ddActiveId === l.id}
                        onClick={onNav(l.id)}
                        className={`v2-nav-mnav-link ${
                          ddActiveId === l.id ? "v2-nav-mnav-link--active" : ""
                        }`}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="v2-nav-tabs v2-nav-tabs--plain">
              {links.map((l) => (
                <Link
                  key={l.id}
                  href={`/#${l.id}`}
                  className="v2-nav-link"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
          <a
            className="v2-btn v2-btn--ghost v2-btn-resume-accent v2-nav-resume"
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
