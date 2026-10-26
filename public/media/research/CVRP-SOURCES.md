# Vehicle routing animation

The network in `data/cvrp-demo.ts` is an explicitly illustrative instance, not a saved run from Ken Cheng's research. Its 12 customers have total demand 22, each vehicle has capacity 8, and three vehicles are required. Coordinate distances are schematic units, not kilometres.

The final three routes were computed offline by exact dynamic programming: find the shortest depot tour for each of the 986 nonempty capacity-feasible customer subsets using Held–Karp, then minimize the sum of three tours over disjoint partitions of all customers. The result serves each customer once, returns every vehicle to the depot, and has loads 7, 7, and 8. Its total Euclidean distance is 1761.161772985639. The eight displayed candidate routes are a curated feasible subset, not the order in which a production solver generated columns.

The explanation follows the depot, demand, capacity, route-pool, and route-selection concepts in the author's local “Methods Section of Paper - Ken Cheng” (July 16, 2023). That document describes a restricted master problem and negative-reduced-cost route generation. This visual does not fabricate dual values, machine-learning decisions, runtime measurements, or a column-generation iteration log. The project's existing runtime claim must not be interpreted as a reduction in this illustrative route distance.
