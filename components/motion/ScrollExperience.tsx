"use client";

import { useEffect, useMemo, useState } from "react";

type Milestone = {
  label: string;
  progress: number;
};

export function ScrollExperience() {
  const ticks = useMemo(() => Array.from({ length: 54 }), []);
  const [progress, setProgress] = useState(0);
  const [activeLabel, setActiveLabel] = useState("INTRO");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const sectionNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    );

    root.classList.add("motion-ready");

    let animationFrame = 0;

    const measureMilestones = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable <= 0) {
        setMilestones([]);
        return;
      }

      const viewportAnchor = window.innerHeight * 0.43;
      const nextMilestones = sectionNodes.map((section) => {
        const targetScroll = section.offsetTop - viewportAnchor;
        const sectionProgress = Math.min(
          1,
          Math.max(0, targetScroll / scrollable),
        );

        return {
          label: section.dataset.scrollLabel ?? "SECTION",
          progress: sectionProgress,
        };
      });

      setMilestones(nextMilestones);
    };

    const updateScrollState = () => {
      animationFrame = 0;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clampedProgress = Math.min(1, Math.max(0, nextProgress));
      setProgress(clampedProgress);

      if (sectionNodes.length > 0) {
        const viewportAnchor = window.innerHeight * 0.43;
        let closest = sectionNodes[0];
        let closestDistance = Number.POSITIVE_INFINITY;

        for (const section of sectionNodes) {
          const rect = section.getBoundingClientRect();
          const sectionAnchor = Math.max(
            rect.top,
            Math.min(viewportAnchor, rect.bottom),
          );
          const distance = Math.abs(sectionAnchor - viewportAnchor);

          if (distance < closestDistance) {
            closest = section;
            closestDistance = distance;
          }
        }

        setActiveLabel(closest.dataset.scrollLabel ?? "INTRO");
      }
    };

    const onScroll = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateScrollState);
      }
    };

    const onResize = () => {
      measureMilestones();
      onScroll();
    };

    measureMilestones();
    updateScrollState();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    for (const node of revealNodes) {
      revealObserver.observe(node);
    }

    return () => {
      root.classList.remove("motion-ready");
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const goToSection = (label: string) => {
    const target = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
    ).find((section) => section.dataset.scrollLabel === label);

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const markerTop = progress * 100;
  const activeTick = progress * (ticks.length - 1);

  return (
    <nav className="scroll-ruler" aria-label="Page sections">
      <div className="ruler-track" aria-hidden="true">
        {ticks.map((_, index) => {
          const distance = Math.abs(index - activeTick);
          const near = distance <= 4;
          const core = distance <= 1.25;

          return (
            <span
              className={[
                "ruler-tick",
                index % 7 === 0 ? "ruler-tick-long" : "",
                near ? "ruler-tick-near" : "",
                core ? "ruler-tick-core" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={index}
            />
          );
        })}
      </div>

      <div
        className="ruler-marker"
        style={{ top: `${markerTop}%` }}
        aria-hidden="true"
      >
        <i />
      </div>

      <div className="ruler-milestones">
        {milestones.map((milestone) => (
          <button
            type="button"
            className={
              milestone.label === activeLabel
                ? "ruler-milestone is-active"
                : "ruler-milestone"
            }
            style={{ top: `${4 + milestone.progress * 92}%` }}
            onClick={() => goToSection(milestone.label)}
            key={milestone.label}
          >
            {milestone.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
