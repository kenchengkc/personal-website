"use client";

import { useEffect, useRef, useState } from "react";
import type { FeaturedMetric, MetricCount } from "@/data/portfolio";

function formatCount(value: number, count: MetricCount) {
  const body =
    count.decimals != null
      ? value.toFixed(count.decimals)
      : count.thousands
        ? Math.round(value).toLocaleString("en-US")
        : String(Math.round(value));

  return `${count.prefix ?? ""}${body}${count.suffix ?? ""}`;
}

export function AnimatedMetric({ metric }: { metric: FeaturedMetric }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState(
    metric.count?.from ?? null,
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const count = metric.count;
    const node = ref.current;
    if (!count || !node || hasAnimated) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDisplayValue(count.to);
      setHasAnimated(true);
      return;
    }

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;

        observer.disconnect();
        setHasAnimated(true);

        const duration = count.durationMs ?? 1600;
        let startedAt = 0;

        const step = (now: number) => {
          if (!startedAt) startedAt = now;

          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const next = count.from + (count.to - count.from) * eased;

          setDisplayValue(next);

          if (progress < 1) {
            frame = window.requestAnimationFrame(step);
          }
        };

        setDisplayValue(count.from);
        frame = window.requestAnimationFrame(step);
      },
      {
        threshold: 0.55,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [hasAnimated, metric.count]);

  return (
    <span
      ref={ref}
      className="metric-value"
      aria-hidden="true"
    >
      {metric.count && displayValue != null
        ? formatCount(displayValue, metric.count)
        : metric.value}
    </span>
  );
}
