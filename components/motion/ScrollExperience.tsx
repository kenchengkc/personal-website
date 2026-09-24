"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Milestone = { label: string; title: string; parent: string | null; number: number; position: number; labelY: number };
const TITLES: Record<string, string> = {
  INTRO: "Introduction", COLUMBIA: "Education", SKILLS: "Skills",
  WORK: "Selected Work", AMAZON: "Amazon", QUANTIV: "Quantiv",
  RETRIEVAL: "SEC Retrieval", EMBERS: "Embers", RESEARCH: "Research",
  PAPERS: "Publications", CONTACT: "Contact",
};
const TICKS = Array.from({ length: 54 }, (_, i) => i);

export function ScrollExperience() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const percentRef = useRef<HTMLSpanElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [activeLabel, setActiveLabel] = useState("INTRO");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    let frame = 0;
    let active = "";
    let disposed = false;
    let positions: number[] = [];
    let scrollable = 0;
    let needsMeasure = true;
    const observed = new WeakSet<Element>();

    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    function measure() {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-section]"));
      sectionsRef.current = sections;
      const scroller = document.scrollingElement ?? root;
      positions = sections.map(section => section.getBoundingClientRect().top + scroller.scrollTop);
      scrollable = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const height = trackRef.current?.getBoundingClientRect().height ?? 0;
      setTrackHeight(height);
      const stops = positions.map(position => scrollable ? Math.max(0, Math.min(1, position / scrollable)) : 0);
      // Keep the true stops fixed. Only displace labels when nearby headings
      // would overlap; connectors preserve their exact locations on the scale.
      const gap = window.innerHeight <= 520 ? 28 : 36;
      const labelPositions = stops.map(position => position * height);
      for (let i = 1; i < labelPositions.length; i++) {
        labelPositions[i] = Math.max(labelPositions[i], labelPositions[i - 1] + gap);
      }
      for (let i = labelPositions.length - 1; i >= 0; i--) {
        labelPositions[i] = Math.min(labelPositions[i], i === labelPositions.length - 1 ? height : labelPositions[i + 1] - gap);
      }
      let number = 0;
      const nextMilestones = sections.map((section, index) => {
        const label = section.dataset.scrollLabel ?? "SECTION";
        const parent = section.parentElement?.closest<HTMLElement>("[data-scroll-section]")?.dataset.scrollLabel ?? null;
        if (!parent) number++;
        return { label, title: TITLES[label] ?? label, parent, number, position: stops[index], labelY: labelPositions[index] };
      });
      setMilestones(previous => JSON.stringify(previous) === JSON.stringify(nextMilestones) ? previous : nextMilestones);
      document.querySelectorAll("[data-reveal]").forEach(element => {
        if (observed.has(element)) return;
        observed.add(element);
        revealObserver.observe(element);
      });
      needsMeasure = false;
    }

    function update() {
      frame = 0;
      if (needsMeasure) measure();
      const scroller = document.scrollingElement ?? root;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, scroller.scrollTop / scrollable)) : 0;
      navRef.current?.style.setProperty("--scroll-progress", String(progress));
      if (percentRef.current) percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      // The last heading crossed wins, so a child project supersedes Work.
      const anchor = scroller.scrollTop + 1;
      let index = 0;
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] <= anchor) index = i;
      }
      if (progress === 1) index = positions.length - 1;
      const next = sectionsRef.current[index]?.dataset.scrollLabel ?? "INTRO";
      if (next !== active) {
        active = next;
        setActiveLabel(next);
      }
    }

    function schedule() {
      if (!frame && !disposed) frame = requestAnimationFrame(update);
    }
    function invalidate() {
      needsMeasure = true;
      schedule();
    }

    // Layout may change after hydration, fonts, responsive demos, or route changes.
    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(document.body);
    const mutationObserver = new MutationObserver(records => {
      if (records.some(record => record.target instanceof Element && !navRef.current?.contains(record.target))) invalidate();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", invalidate);
    document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      revealObserver.disconnect();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", invalidate);
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  function goToSection(label: string) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sectionsRef.current.find(section => section.dataset.scrollLabel === label)
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  }

  const activeParent = milestones.find(item => item.label === activeLabel)?.parent;
  return (
    <nav ref={navRef} className="scroll-ruler" aria-label="Page sections" style={{ visibility: milestones.length === 0 ? "hidden" : undefined }}>
      <div ref={trackRef} className="ruler-track" aria-hidden="true">
        {TICKS.map(index => <span key={index} className={`ruler-tick${index % 7 === 0 ? " ruler-tick-long" : ""}`} />)}
        <div className="ruler-marker"><i /></div>
      </div>
      <svg className="ruler-connectors" viewBox={`0 0 30 ${trackHeight || 1}`} preserveAspectRatio="none" aria-hidden="true">
        {milestones.map(milestone => (
          <g key={milestone.label} className={milestone.label === activeLabel ? "is-active" : undefined}>
            <path d={`M 8 ${milestone.position * trackHeight} H 22 L 30 ${milestone.labelY}`} />
            <circle className="ruler-stop" data-label={milestone.label} cx="22" cy={milestone.position * trackHeight} r="1.5" />
          </g>
        ))}
      </svg>
      <div className="ruler-contents">
        <span className="ruler-heading">On This Page</span>
        <ol className="ruler-milestones">
          {milestones.map(milestone => (
            <li className="ruler-section" key={milestone.label} style={{ top: milestone.labelY }}>
              <button
                type="button"
                className={`ruler-milestone${milestone.parent ? " ruler-subsection" : ""}${milestone.label === activeLabel ? " is-active" : ""}${milestone.label === activeParent ? " is-parent-active" : ""}`}
                aria-current={milestone.label === activeLabel ? "location" : undefined}
                aria-label={milestone.parent ? `${TITLES[milestone.parent] ?? milestone.parent}: ${milestone.title}` : undefined}
                onClick={() => goToSection(milestone.label)}
              >
                {!milestone.parent && <span className="ruler-number" aria-hidden="true">{String(milestone.number).padStart(2, "0")}</span>}
                {milestone.title}
              </button>
            </li>
          ))}
        </ol>
        <div className="ruler-progress-label"><span>Page</span><span ref={percentRef}>0%</span></div>
      </div>
    </nav>
  );
}
