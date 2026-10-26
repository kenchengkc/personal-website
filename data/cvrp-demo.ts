export type CvrpNode = {
  id: number;
  x: number;
  y: number;
  demand: number;
};

export type CvrpRoute = {
  id: string;
  stops: readonly number[];
  load: number;
  distance: number;
};

// A constructed teaching example, not a recorded research run or live C++
// solver output. Coordinates are schematic; distances have no physical unit.
export const cvrpCapacity = 8;

export const cvrpNodes = [
  { id: 0, x: 320, y: 190, demand: 0 },
  { id: 1, x: 70, y: 160, demand: 2 },
  { id: 2, x: 110, y: 80, demand: 1 },
  { id: 3, x: 180, y: 95, demand: 3 },
  { id: 4, x: 190, y: 180, demand: 1 },
  { id: 5, x: 360, y: 55, demand: 2 },
  { id: 6, x: 450, y: 65, demand: 3 },
  { id: 7, x: 540, y: 110, demand: 1 },
  { id: 8, x: 450, y: 165, demand: 1 },
  { id: 9, x: 220, y: 260, demand: 3 },
  { id: 10, x: 300, y: 300, demand: 1 },
  { id: 11, x: 410, y: 285, demand: 2 },
  { id: 12, x: 500, y: 260, demand: 2 },
] as const satisfies readonly CvrpNode[];

function route(id: string, stops: readonly number[]): CvrpRoute {
  return {
    id,
    stops,
    load: stops.slice(1, -1).reduce((sum, stop) => sum + cvrpNodes[stop].demand, 0),
    distance: stops.slice(1).reduce((sum, stop, index) => {
      const from = cvrpNodes[stops[index]];
      const to = cvrpNodes[stop];
      return sum + Math.hypot(to.x - from.x, to.y - from.y);
    }, 0),
  };
}

// The three tours were selected offline by exact dynamic programming:
// Held–Karp finds the shortest depot tour for each of the 986 nonempty subsets
// with demand <= 8; a set-partition DP selects three disjoint tours covering all
// 12 customers. Loads are 7, 7, 8; total distance is 1761.161772985639.
// This supports the final feasible plan, not a claimed column-generation trace.
export const cvrpRoutes: readonly CvrpRoute[] = [
  route("a", [0, 4, 1, 2, 3, 0]),
  route("b", [0, 5, 6, 7, 8, 0]),
  route("c", [0, 9, 10, 11, 12, 0]),
];

// A small, deliberately chosen pool for explaining route selection. Every
// candidate is capacity-feasible; overlapping alternatives are not simultaneous
// vehicle assignments. The selected tours are the same objects in this pool.
export const cvrpCandidates: readonly CvrpRoute[] = [
  route("candidate-1", [0, 1, 2, 3, 0]),
  cvrpRoutes[0],
  route("candidate-2", [0, 3, 4, 9, 0]),
  route("candidate-3", [0, 5, 6, 8, 0]),
  cvrpRoutes[1],
  route("candidate-4", [0, 8, 7, 12, 11, 0]),
  route("candidate-5", [0, 9, 10, 11, 0]),
  cvrpRoutes[2],
];
