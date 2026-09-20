"use client";

import { useEffect, useMemo, useState } from "react";

export function ScrollExperience() {
  const ticks = useMemo(() => Array.from({ length: 44 }), []);
  const [progress, setProgress] = useState(0);
  const [activeLabel, setActiveLabel] = useState("INTRO");

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

    const updateScrollState = () => {
      animationFrame = 0;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, nextProgress)));

      if (sectionNodes.length > 0) {
        const viewportAnchor = window.innerHeight * 0.43;
        let closest = sectionNodes[0];
        let closestDistance = Number.POSITIVE_INFINITY;

        for (const section of sectionNodes) {
          const rect = section.getBoundingClientRect();
          const sectionAnchor = Math.max(rect.top, Math.min(viewportAnchor, rect.bottom));
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

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

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
      window.removeEventListener("resize", onScroll);

      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <aside className="scroll-ruler" aria-hidden="true">
      <div className="ruler-track">
        {ticks.map((_, index) => (
          <span
            className={index % 6 === 0 ? "ruler-tick ruler-tick-long" : "ruler-tick"}
            key={index}
          />
        ))}
      </div>

      <div
        className="ruler-marker"
        style={{ top: `${4 + progress * 92}%` }}
      >
        <i />
        <span>{activeLabel}</span>
      </div>
    </aside>
  );
}
