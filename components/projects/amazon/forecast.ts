export type FileId = "input" | "window" | "delivery";
export type Value = number | string;

type ConfigFile = {
  name: string;
  key: string;
  kind: "number" | "enum";
  initial: Value;
  sample: Value;
  readers: readonly number[];
  options?: readonly string[];
};

export const files: Record<FileId, ConfigFile> = {
  input: { name: "sales-input.json", key: "history_days", kind: "number", initial: 56, sample: 84, readers: [0, 1] },
  window: { name: "forecast-window.json", key: "horizon_weeks", kind: "number", initial: 12, sample: 16, readers: [1, 2, 3] },
  delivery: { name: "delivery.json", key: "format", kind: "enum", initial: "csv", sample: "parquet", options: ["csv", "parquet", "jsonl"], readers: [2, 3] },
};

// Illustrative deployments. Each reader has its own interface for receiving a revision.
export const routes = [
  {
    name: "Ingestion", repo: "sales-ingest", need: "Read at batch start", minute: 0,
    hops: [{ service: "S3", action: "Store manifest", detail: "S3 stores the versioned manifest for the next ingestion batch." }],
  },
  {
    name: "Preparation", repo: "feature-prep", need: "Batch-ready manifest", minute: 4,
    hops: [
      { service: "Lambda", action: "Build manifest", detail: "Lambda converts the changed JSON into the manifest this batch job reads." },
      { service: "S3", action: "Store manifest", detail: "S3 stores the generated manifest under a key specific to this revision." },
    ],
  },
  {
    name: "Forecasting", repo: "demand-model", need: "Event-driven update", minute: 12,
    hops: [
      { service: "SNS", action: "Notify subscriber", detail: "SNS sends the revision ID and effective run to the model service’s subscriber." },
      { service: "Lambda", action: "Stage revision", detail: "The subscribed Lambda stages that revision in the model service’s configuration cache." },
    ],
  },
  {
    name: "Publishing", repo: "forecast-publisher", need: "Deploy with stack", minute: 20,
    hops: [
      { service: "S3", action: "Store JSON", detail: "S3 stores the publisher’s JSON at a new revision-specific key." },
      { service: "CloudFormation", action: "Pin config key", detail: "A CloudFormation stack update pins that S3 key for the publisher’s next deployment." },
    ],
  },
];

const effects: Record<FileId, Record<number, (value: Value) => string>> = {
  input: {
    0: value => `reads ${value} days of sales history`,
    1: value => `builds features from ${value} days of sales`,
  },
  window: {
    1: value => `prepares inputs for the next ${value} weeks`,
    2: value => `predicts ${value} weeks of demand`,
    3: value => `publishes all ${value} weekly forecasts`,
  },
  delivery: {
    2: value => `writes its forecast output as ${String(value).toUpperCase()}`,
    3: value => `delivers the forecast in ${String(value).toUpperCase()} format`,
  },
};

export type Phase = "draft" | "push" | "delivering" | "arrival" | "queued" | "running" | "complete";
export type StageState = "other" | "reader" | "waiting" | "delivering" | "staged" | "applied";
export type Frame = {
  phase: Exclude<Phase, "draft">;
  clock: string;
  caption: string;
  duration: number;
  staged: readonly number[];
  stage?: number;
  hop?: number;
};

export const initialRun = 184;
export function clock(run: number, minute: number) {
  const hour = (6 + run - initialRun) % 24;
  return [hour, minute].map(value => String(value).padStart(2, "0")).join(":");
}

export function buildRelease(id: FileId, value: Value, author: number, run: number, base: number): Frame[] {
  const { name, readers } = files[id];
  const version = `v${base + 1}`;
  const target = run + 1;
  let minute = run === initialRun ? 18 : 21;
  const frames: Frame[] = [{
    phase: "push", clock: clock(run, minute), duration: 1000, staged: [],
    caption: `${routes[author].name} pushes ${version}. ${readers.length} consumer repos read this file.`,
  }];
  const staged: number[] = [];
  for (const stage of readers) {
    const route = routes[stage];
    route.hops.forEach(({ detail }, hop) => {
      frames.push({ phase: "delivering", stage, hop, clock: clock(run, ++minute), duration: 1250, staged: [...staged], caption: detail });
    });
    staged.push(stage);
    frames.push({
      phase: "arrival", stage, clock: clock(run, minute), staged: [...staged], duration: 750,
      caption: `${route.repo} has ${version} ready for run ${target}. Its current run stays on v${base}.`,
    });
  }
  frames.push({
    phase: "queued", clock: clock(run, minute), staged, duration: 1400,
    caption: `All ${readers.length} repos have ${version} ready. Run ${run} still uses v${base}.`,
  });
  routes.forEach((route, stage) => {
    const effect = effects[id][stage];
    frames.push({
      phase: "running", stage, clock: clock(target, route.minute), staged, duration: 1200,
      caption: effect ? `${route.name} loads ${version} and ${effect(value)}.` : `${route.name} starts with its own configuration. It does not read ${name}.`,
    });
  });
  frames.push({
    phase: "complete", clock: clock(target, routes[routes.length - 1].minute), staged, duration: 0,
    caption: `Run ${target} published. ${readers.length} services used ${version} of ${name}.`,
  });
  return frames;
}

export function stageState(frame: Frame | undefined, reads: boolean, index: number): StageState {
  if (!reads) return "other";
  if (!frame) return "reader";
  if (frame.phase === "complete" || (frame.phase === "running" && index <= frame.stage!)) return "applied";
  if (frame.phase === "delivering" && frame.stage === index) return "delivering";
  return frame.staged.includes(index) ? "staged" : "waiting";
}
