export type Reply = "A" | "B";
type Features = readonly [number, number, number, number, number, number];
type Token = { word: string; state: Features };

export const defaultCutoff = 20;
export const featureCount = 6;

// These small, invented activations let the whole notebook run in the browser.
export const replies: Record<Reply, readonly Token[]> = {
  A: [
    { word: "It", state: [1, -0.5, -2, 2.5, -2, 0.5] },
    { word: "covers", state: [1.5, 1, 0, 1.5, 0, 0.5] },
    { word: "defects.", state: [-0.5, 2, -3, 0.5, -0.5, 2.5] },
    { word: "Spills", state: [2.5, 1, 0, 3.5, -1.5, -0.5] },
    { word: "are", state: [0.5, 2, -3, 2.5, -2, 1.5] },
    { word: "excluded.", state: [1, 3.5, -1, 1.5, 0, 1.5] },
  ],
  B: [
    { word: "You", state: [2.5, 1.5, -5, 1, -2, 4] },
    { word: "get", state: [5, 1.5, -2.5, 2.5, -4.5, 4] },
    { word: "two", state: [3, 3.5, -2.5, 4.5, -2, 1] },
    { word: "years", state: [5, 2.5, -5.5, 1.5, -4, 6] },
    { word: "of", state: [3, 4.5, -5.5, 3.5, -1.5, 3] },
    { word: "protection.", state: [5.5, 4.5, -3, 5, -4, 3] },
  ],
};

function columnMeans(rows: readonly (readonly number[])[]) {
  return Array.from({ length: featureCount }, (_, j) => rows.reduce((sum, row) => sum + row[j], 0) / rows.length);
}

export function replyText(reply: Reply) {
  return replies[reply].map(token => token.word).join(" ");
}

export function meanActivation(reply: Reply) {
  return columnMeans(replies[reply].map(token => token.state));
}

const referenceCenters = {
  honest: [1.5, 2, -2, 1.5, -1, 1.5],
  misleading: [3.5, 3, -4, 2.5, -2, 2.5],
} satisfies Record<string, Features>;
type Group = keyof typeof referenceCenters;
const offsets: readonly Features[] = [
  [0.2, 0.3, -0.1, -0.1, 0.0, 0.1], [-0.3, 0.5, 0.3, -0.5, -1.0, 1.0],
  [0.9, -0.2, 0.2, 0.1, 0.1, -0.5], [0.7, 0.1, -1.0, 0, 0.6, -1.1],
  [-0.2, 1.2, -0.6, -0.7, -0.8, 0.4], [1.0, 0.2, -1.4, -0.2, -0.3, -0.5],
  [1.2, -0.2, -0.8, 0.6, -0.7, -0.3], [0.5, 1.2, -0.9, 0.7, -0.6, 0.5],
  [-0.8, 0.4, 1.7, -1.0, 1.2, -0.5], [1.5, 0.7, -1.3, 0.9, -1.2, 0.8],
  [1.5, 1.7, -1.5, 1.4, -1.3, 0.9], [1.9, 1.3, -1.7, 1.6, -1.3, 1.1],
];

function referenceFeatures(group: Group) {
  const spread = group === "honest" ? 1 : 1.12;
  return offsets.flatMap(offset => [-1, 1].map(sign =>
    referenceCenters[group].map((value, j) => value + sign * spread * offset[j])));
}

const honest = referenceFeatures("honest");
const misleading = referenceFeatures("misleading");
const honestMean = columnMeans(honest);
const direction = columnMeans(misleading).map((value, j) => value - honestMean[j]);

// The probe uses all six features: score = mean reply vector · difference between class means.
export function encodeScore(features: readonly number[]) {
  return features.reduce((sum, value, j) => sum + value * direction[j], 0);
}

export function scoreReply(reply: Reply) {
  return Number(encodeScore(meanActivation(reply)).toFixed(6));
}

export function decision(score: number, cutoff: number) {
  return score >= cutoff ? "Flag for review" : "Below cutoff";
}

const groups = { honest: honest.map(encodeScore), misleading: misleading.map(encodeScore) };
export const referenceCount = honest.length + misleading.length;
export const binWidth = 4;
export const histogram = Array.from({ length: 10 }, (_, i) => {
  const start = i * binWidth;
  const end = start + binWidth;
  const inBin = (score: number) => score >= start && (i === 9 ? score <= end : score < end);
  return { start, end, honest: groups.honest.filter(inBin).length, misleading: groups.misleading.filter(inBin).length };
});
