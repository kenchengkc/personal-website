"use client";

import { useEffect } from "react";

export function ScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    root.classList.add("motion-ready");

    let animationFrame = 0;

    const updateProgress = () => {
      animationFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty(
        "--page-progress",
        String(Math.min(1, Math.max(0, progress))),
      );
    };

    const onScroll = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    for (const node of revealNodes) {
      observer.observe(node);
    }

    return () => {
      root.classList.remove("motion-ready");
      root.style.removeProperty("--page-progress");
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  );
}
