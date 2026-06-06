"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".v2-scroll-reveal";
/** How far past the viewport an element must travel before it re-arms (so it
 *  animates again next time). Expressed as a share of the viewport height, this
 *  buffer sits well outside the reveal edge — small scrolls near the edge can't
 *  toggle it, which is what was causing flicker. */
const REARM_MARGIN = "40%";

export function ScrollRevealController() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observed = new WeakSet<Element>();

    const revealImmediately = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        element.dataset.revealVisible = "true";
      });
    };

    if (reduceMotion) {
      revealImmediately(document);
      return;
    }

    // Reveals as soon as the element edges into view.
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.revealVisible = "true";
          // once=true: lock it visible and stop watching entirely.
          if (element.dataset.revealOnce !== "false") {
            revealObserver.unobserve(element);
            rearmObserver.unobserve(element);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    // Re-arms (hides again) only once the element is well past the viewport,
    // i.e. outside an expanded root. The gap to the reveal edge is the
    // hysteresis that prevents edge flicker.
    const rearmObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          if (element.dataset.revealOnce === "false") {
            element.dataset.revealVisible = "false";
          }
        });
      },
      {
        rootMargin: `${REARM_MARGIN} 0px ${REARM_MARGIN} 0px`,
        threshold: 0,
      },
    );

    const observe = (root: ParentNode) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        revealObserver.observe(element);
        rearmObserver.observe(element);
      });
    };

    observe(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL_SELECTOR) && !observed.has(node)) {
            observed.add(node);
            revealObserver.observe(node);
            rearmObserver.observe(node);
          }
          observe(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
      rearmObserver.disconnect();
    };
  }, []);

  return null;
}
