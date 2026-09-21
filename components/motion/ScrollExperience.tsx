"use client";

import { useEffect, useMemo, useState } from "react";

type MilestoneLevel = "major" | "subsection";

type Milestone = {
  label: string;
  progress: number;
  displayProgress: number;
  level: MilestoneLevel;
};

const TRACK_START = 0.04;
const TRACK_END = 0.96;
const MIN_LABEL_GAP = 0.045;

function spaceMilestones(
  milestones: Omit<Milestone, "displayProgress">[],
): Milestone[] {
  if (milestones.length === 0) return [];

  const display = milestones.map((milestone) =>
    Math.min(
      TRACK_END,
      Math.max(
        TRACK_START,
        TRACK_START + milestone.progress * (TRACK_END - TRACK_START),
      ),
    ),
  );

  for (let index = 1; index < display.length; index += 1) {
    display[index] = Math.max(
      display[index],
      display[index - 1] + MIN_LABEL_GAP,
    );
  }

  if (display[display.length - 1] > TRACK_END) {
    display[display.length - 1] = TRACK_END;

    for (let index = display.length - 2; index >= 0; index -= 1) {
      display[index] = Math.min(
        display[index],
        display[index + 1] - MIN_LABEL_GAP,
      );
    }
  }

  if (display[0] < TRACK_START) {
    const offset = TRACK_START - display[0];
    for (let index = 0; index < display.length; index += 1) {
      display[index] += offset;
    }
  }

  return milestones.map((milestone, index) => ({
    ...milestone,
    displayProgress: display[index],
  }));
}

function mapProgressToRail(progress: number, milestones: Milestone[]) {
  if (milestones.length === 0) {
    return TRACK_START + progress * (TRACK_END - TRACK_START);
  }

  if (progress <= milestones[0].progress) {
    return milestones[0].displayProgress;
  }

  const last = milestones[milestones.length - 1];
  if (progress >= last.progress) {
    return last.displayProgress;
  }

  for (let index = 0; index < milestones.length - 1; index += 1) {
    const current = milestones[index];
    const next = milestones[index + 1];

    if (progress < current.progress || progress > next.progress) continue;

    const span = Math.max(0.0001, next.progress - current.progress);
    const localProgress = (progress - current.progress) / span;

    return (
      current.displayProgress +
      (next.displayProgress - current.displayProgress) * localProgress
    );
  }

  return TRACK_START + progress * (TRACK_END - TRACK_START);
}

export function ScrollExperience() {
  const ticks = useMemo(() => Array.from({ length: 64 }), []);
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
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable <= 0) {
        setMilestones([]);
        return;
      }

      const viewportAnchor = window.innerHeight * 0.43;
      const measured = sectionNodes
        .map((section) => {
          const targetScroll = section.offsetTop - viewportAnchor;
          const sectionProgress = Math.min(
            1,
            Math.max(0, targetScroll / scrollable),
          );

          return {
            label: section.dataset.scrollLabel ?? "SECTION",
            progress: sectionProgress,
            level:
              section.dataset.scrollLevel === "subsection"
                ? ("subsection" as const)
                : ("major" as const),
          };
        })
        .sort((a, b) => a.progress - b.progress);

      setMilestones(spaceMilestones(measured));
    };

    const updateScrollState = () => {
      animationFrame = 0;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
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

  const markerProgress = mapProgressToRail(progress, milestones);
  const markerTop = markerProgress * 100;
  const activeTick = markerProgress * (ticks.length - 1);

  return (
    <nav className="scroll-ruler" aria-label="Page sections">
      <div className="ruler-track" aria-hidden="true">
        {ticks.map((_, index) => {
          const distance = Math.abs(index - activeTick);
          const near = distance <= 4;
          const core = distance <= 1.35;

          return (
            <span
              className={[
                "ruler-tick",
                index % 8 === 0 ? "ruler-tick-long" : "",
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
            className={[
              "ruler-milestone",
              milestone.level === "subsection" ? "is-subsection" : "is-major",
              milestone.label === activeLabel ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ top: `${milestone.displayProgress * 100}%` }}
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
