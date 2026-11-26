"use client";

import Image from "next/image";
import { FileDiff, Pencil } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { routes, type Phase, type StageState } from "./forecast";
import styles from "./configuration-routes.module.css";

type Stage = { state: StageState; version: number | null; time: string };
type Props = {
  file: string;
  version: number;
  author: number;
  readers: readonly number[];
  phase: Phase;
  stages: readonly Stage[];
  run: number;
  activeStage: number | null;
  hopIndex: number | null;
  onSelect: (index: number) => void;
  onOpenFile: () => void;
};

const shortNames = ["Ingest", "Prepare", "Forecast", "Publish"];

function destination(stage: Stage, version: number, need: string) {
  switch (stage.state) {
    case "applied": return `v${stage.version} active · ${stage.time}`;
    case "staged": return `v${version} ready · use ${stage.time}`;
    case "waiting": return `Due ${stage.time} · on v${stage.version}`;
    case "delivering": return `Delivering v${version}`;
    default: return need;
  }
}

// SVG paths and HTML labels share a coordinate system even when the window is
// scaled, enlarged, or reflows around a longer repository name.
function placePaths(plot: HTMLDivElement, author: number) {
  const bounds = plot.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const graphic = plot.querySelector("svg")!;
  graphic.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
  const relative = (element: Element) => {
    const box = element.getBoundingClientRect();
    return { x: box.left - bounds.left, y: box.top - bounds.top, w: box.width, h: box.height };
  };
  const origin = relative(plot.querySelector("[data-origin]")!);
  const button = relative(plot.querySelector(`[data-stage-index="${author}"]`)!);
  const startX = button.x + button.w / 2;
  const startY = button.y + button.h;
  const endX = origin.x + origin.w / 2;
  const endY = origin.y;
  graphic.querySelector("[data-push-path]")!.setAttribute("d",
    `M ${startX} ${startY} C ${startX} ${startY + 13} ${endX} ${endY - 13} ${endX} ${endY}`);
  const railX = origin.x + 7;
  const railY = origin.y + origin.h;
  for (const row of plot.querySelectorAll<HTMLElement>("[data-consumer]")) {
    const stops = Array.from(row.querySelectorAll("[data-service-stop]"), stop => {
      const box = relative(stop);
      return box.w ? box : relative(stop.querySelector("img")!);
    });
    const paths = graphic.querySelectorAll(`[data-lane="${row.dataset.consumer}"] path`);
    const target = relative(row.querySelector("[data-destination]")!);
    stops.forEach((stop, i) => {
      const y = stop.y + stop.h / 2;
      const previous = stops[i - 1];
      const bend = Math.max(0, Math.min(7, y - railY, stop.x - railX));
      const d = previous
        ? `M ${previous.x + previous.w} ${previous.y + previous.h / 2} L ${stop.x} ${y}`
        : `M ${railX} ${railY} V ${y - bend} Q ${railX} ${y} ${railX + bend} ${y} H ${stop.x}`;
      paths[i].setAttribute("d", d);
    });
    const last = stops[stops.length - 1];
    const x = last.x + last.w;
    const y = last.y + last.h / 2;
    const tip = target.y + target.h / 2;
    paths[stops.length].setAttribute("d", `M ${x} ${y} C ${x + 8} ${y} ${target.x - 6} ${tip} ${target.x} ${tip}`);
  }
}

export function ConfigurationRoutes({ file, version, author, readers, phase, stages, run, activeStage, hopIndex, onSelect, onOpenFile }: Props) {
  const FileAction = phase === "draft" ? Pencil : FileDiff;
  const fileLabel = phase === "draft" ? `Edit ${file}` : `View diff for ${file}`;
  const plotRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const plot = plotRef.current!;
    const dot = plot.querySelector<SVGCircleElement>("[data-packet]")!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastPath = "";
    let animation: Animation | undefined;
    const draw = () => {
      placePaths(plot, author);
      const path = plot.querySelector<SVGPathElement>("path[data-current=true]");
      const d = path?.getAttribute("d");
      if (!path || !d) {
        dot.style.visibility = "hidden";
        return;
      }
      if (d === lastPath) return;
      lastPath = d;
      animation?.cancel();
      const length = path.getTotalLength();
      const frames = Array.from({ length: 21 }, (_, i) => {
        const point = path.getPointAtLength(i * length / 20);
        return { transform: `translate(${point.x}px, ${point.y}px)` };
      });
      dot.style.visibility = "visible";
      dot.style.transform = frames[frames.length - 1].transform;
      if (!motion.matches) animation = dot.animate(frames, { duration: 430, easing: "ease-in-out" });
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(plot);
    for (const el of plot.querySelectorAll("[data-origin],[data-consumer],[data-service-stop]")) observer.observe(el);
    const onMotionChange = () => { if (motion.matches) animation?.cancel(); };
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      animation?.cancel();
    };
  }, [author, file, phase, activeStage, hopIndex]);

  return <div className={styles.map} role="group" aria-label="Forecast pipeline and AWS configuration delivery routes">
    <div className={styles.plot} ref={plotRef}>
      <svg className={styles.graphic} aria-hidden="true" preserveAspectRatio="none">
        {readers.map(index => {
          const { state } = stages[index];
          const delivered = state === "staged" || state === "applied";
          const currentStop = activeStage === index && phase === "delivering" ? hopIndex : null;
          const hops = routes[index].hops.length;
          return <g key={index} data-lane={index}>
            {Array.from({ length: hops + 1 }, (_, j) =>
              <path key={j} data-done={delivered || (currentStop !== null && j <= currentStop)}
                data-current={currentStop === j || (phase === "arrival" && activeStage === index && j === hops)} />)}
          </g>;
        })}
        <path data-push-path="" data-current={phase === "push"} />
        <circle data-packet="" r="3.5" visibility="hidden" fill={phase === "push" ? "#ffca86" : "#a5fff0"} />
      </svg>
      <div className={styles.rail} role="group" aria-label="Forecast data flow. Choose a stage to edit its configurations.">
        {routes.map(({ name }, index) => <button key={name} type="button" className={styles.stage}
          data-stage-index={index} aria-pressed={index === author} aria-label={name + (index === author ? ", revision author" : "")}
          disabled={phase !== "draft" && phase !== "complete"} onClick={() => onSelect(index)}>
          <span className={styles.fullName}>{name}</span><span className={styles.shortName}>{shortNames[index]}</span>
        </button>)}
      </div>
      <div className={styles.originRow}>
        <button type="button" data-origin="" className={styles.origin} aria-label={fileLabel} title={fileLabel} onClick={onOpenFile}>
          <span className={styles.originLabel}>Shared configuration</span>
          <span className={styles.file}>{file}</span><span className={styles.version}>v{version}</span>
          <FileAction size={12} aria-hidden="true" />
        </button>
        <span className={styles.run}>Run {run}<span className={styles.consumerCount}> · {readers.length} consumers</span></span>
      </div>
      <ul className={styles.rows} aria-label="Delivery routes by consuming repository">
        {readers.map(index => {
          const route = routes[index];
          const stage = stages[index];
          return <li key={index} className={styles.row} data-consumer={index} data-state={stage.state}>
            <div className={styles.waypoints}>
              {route.hops.map((hop, j) => <div key={hop.service} className={styles.hop}
                data-active={activeStage === index && phase === "delivering" && j === hopIndex}>
                <span data-service-stop="" className={styles.stop}>
                  <Image data-service-icon="" className={styles.icon} src={`/images/amazon/${hop.service.toLowerCase()}.svg`}
                    width={27} height={27} unoptimized alt="" />
                  <span className={styles.service}>{hop.service === "CloudFormation" ? <>Cloud<wbr />Formation</> : hop.service}</span>
                </span>
                <span className={styles.action}>{hop.action}</span>
              </div>)}
            </div>
            <div className={styles.destination} data-destination="">
              <span className={styles.repo}>{route.repo}</span>
              <span className={styles.description}>{destination(stage, version, route.need)}</span>
            </div>
          </li>;
        })}
      </ul>
    </div>
  </div>;
}
