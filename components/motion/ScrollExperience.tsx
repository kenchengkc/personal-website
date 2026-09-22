"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

type Milestone = { label: string; title: string; parent: string | null; progress: number };
const TITLES: Record<string, string> = {
  INTRO: "Introduction", COLUMBIA: "Education", SKILLS: "Skills",
  WORK: "Selected work", AMAZON: "Amazon", QUANTIV: "Quantiv",
  RETRIEVAL: "SEC retrieval", EMBERS: "Embers", RESEARCH: "Research",
  PAPERS: "Publications", CONTACT: "Contact",
};
const TICKS = Array.from({ length: 54 }, (_, i) => i);

export function ScrollExperience() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
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
      const scroller = document.scrollingElement ?? root;
      sectionsRef.current = sections;
      positions = sections.map(section => section.getBoundingClientRect().top + scroller.scrollTop);
      scrollable = Math.max(0, scroller.scrollHeight - scroller.clientHeight);

      // Place every label on the same coordinate scale as the progress marker.
      // A label sits at the midpoint of the scroll range during which its section
      // is active, so long sections receive proportionally more room on the rail.
      const anchorOffset = Math.min(180, scroller.clientHeight * 0.22);
      const starts = positions.map(position =>
        scrollable > 0
          ? Math.max(0, Math.min(1, (position - anchorOffset) / scrollable))
          : 0,
      );

      setMilestones(sections.map((section, index) => {
        const label = section.dataset.scrollLabel ?? "SECTION";
        const start = starts[index] ?? 0;
        const end = starts[index + 1] ?? 1;
        return {
          label,
          title: TITLES[label] ?? label,
          parent: section.parentElement?.closest<HTMLElement>("[data-scroll-section]")?.dataset.scrollLabel ?? null,
          progress: Math.max(0, Math.min(1, start + (end - start) * 0.5)),
        };
      }));

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
      const anchor = scroller.scrollTop + Math.min(180, scroller.clientHeight * 0.22);
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
  const topLevelMilestones = milestones.filter(item => !item.parent);
  const subsectionRails = topLevelMilestones.flatMap(parent => {
    const children = milestones.filter(item => item.parent === parent.label);
    if (children.length < 2) return [];
    return [{
      label: parent.label,
      start: children[0].progress,
      span: children[children.length - 1].progress - children[0].progress,
    }];
  });

  return (
    <nav ref={navRef} className="scroll-ruler" aria-label="Page sections" hidden={milestones.length === 0}>
      <div className="ruler-track" aria-hidden="true">
        {TICKS.map(index => <span key={index} className={`ruler-tick${index % 7 === 0 ? " ruler-tick-long" : ""}`} />)}
        <div className="ruler-marker"><i /></div>
      </div>

      <div className="ruler-contents">
        <span className="ruler-heading">On this page</span>

        <div className="ruler-scale">
          {subsectionRails.map(group => (
            <span
              className="ruler-subsection-rail"
              key={group.label}
              aria-hidden="true"
              style={{
                "--subsection-start": group.start,
                "--subsection-span": group.span,
              } as CSSProperties}
            />
          ))}

          <ol className="ruler-milestones">
            {milestones.map(milestone => {
              const topLevelIndex = topLevelMilestones.findIndex(item => item.label === milestone.label);
              const isSubsection = milestone.parent !== null;

              return (
                <li
                  className={`ruler-section${isSubsection ? " is-subsection" : ""}`}
                  key={milestone.label}
                  style={{ "--milestone-progress": milestone.progress } as CSSProperties}
                >
                  <button
                    type="button"
                    className={`ruler-milestone${isSubsection ? " ruler-subsection" : ""}${milestone.label === activeLabel ? " is-active" : ""}${milestone.label === activeParent ? " is-parent-active" : ""}`}
                    aria-current={milestone.label === activeLabel ? "location" : undefined}
                    onClick={() => goToSection(milestone.label)}
                  >
                    {!isSubsection ? (
                      <span className="ruler-number" aria-hidden="true">
                        {String(topLevelIndex + 1).padStart(2, "0")}
                      </span>
                    ) : null}
                    {milestone.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="ruler-progress-label"><span>Page</span><span ref={percentRef}>0%</span></div>
      </div>
    </nav>
  );

}
