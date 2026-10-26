"use client";

import { useId, type CSSProperties } from "react";
import { cvrpCandidates, cvrpCapacity, cvrpNodes, cvrpRoutes, type CvrpRoute } from "@/data/cvrp-demo";
import { AnimatedArtwork } from "./AnimatedArtwork";

const steps = [
  { label: "Generate", caption: "Explore depot-to-depot routes that fit each vehicle’s capacity." },
  { label: "Select", caption: "Choose a set of routes that serves every customer exactly once." },
  { label: "Dispatch", caption: "Three vehicles cover all 12 customers and return to the depot." },
] as const;
const routeColors: Record<string, string> = { a: "#3b64b1", b: "#bd622c", c: "#247d70" };
const customerRoutes = new Map(cvrpRoutes.flatMap(route => route.stops.slice(1, -1).map(id => [id, route.id] as const)));
const customers = cvrpNodes.filter(node => node.id !== 0);
const depot = cvrpNodes[0];

function pathFor(route: CvrpRoute) {
  return route.stops.map((id, index) => `${index === 0 ? "M" : "L"}${cvrpNodes[id].x} ${cvrpNodes[id].y}`).join(" ");
}

export function CvrpArtwork() {
  const gridId = `routing-grid-${useId().replace(/:/g, "")}`;
  return (
    <AnimatedArtwork label="Capacitated vehicle routing on an illustrative delivery network" steps={steps} duration={4300}>
      {stage => <div className="cvrp-scene" data-phase={stage}>
        <div className="cvrp-heading">
          <span>{customers.length} customers <span className="cvrp-heading-separator">/</span> 1 depot</span>
          <span>Vehicle capacity <strong>{cvrpCapacity}</strong></span>
        </div>
        <svg className="cvrp-map" viewBox="0 0 640 370" role="img" aria-label="Twelve fixed customers with demands shown inside their markers. Three selected depot-to-depot routes carry loads of seven, seven, and eight, each within the vehicle capacity of eight.">
          <defs>
            <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#dde3e9" strokeWidth=".7" /></pattern>
          </defs>
          <rect width="640" height="370" fill={`url(#${gridId})`} />
          <g className="cvrp-regions">
            {cvrpRoutes.map(route => <path key={route.id} d={`${pathFor(route)}Z`} fill={routeColors[route.id]} />)}
          </g>
          <g fill="none" strokeLinejoin="round" strokeLinecap="round">
            {cvrpCandidates.map((route, index) => {
              const selected = route.id in routeColors;
              return <path
                key={route.id}
                className={`cvrp-route ${selected ? "cvrp-selected-route" : "cvrp-alternative"}`}
                data-route-id={selected ? route.id : undefined}
                d={pathFor(route)} pathLength="100"
                style={{ "--route-color": selected ? routeColors[route.id] : "#85919f", "--candidate-delay": `${-index * .46}s` } as CSSProperties}
              />;
            })}
            {cvrpRoutes.map((route, index) => <path
              key={route.id} className="cvrp-vehicle" d={pathFor(route)} pathLength="100"
              style={{ "--route-color": routeColors[route.id], "--trip-duration": `${4.5 + index * .6}s` } as CSSProperties}
            />)}
          </g>
          {customers.map(node => <g key={node.id} className="cvrp-customer" data-customer-id={node.id} transform={`translate(${node.x} ${node.y})`} style={{ "--route-color": routeColors[customerRoutes.get(node.id)!] } as CSSProperties}>
            <title>{`Customer ${node.id}: demand ${node.demand}`}</title>
            <circle className="cvrp-node-halo" r="20" />
            <circle className="cvrp-node" r="13" />
            <text className="cvrp-demand" textAnchor="middle" dominantBaseline="central">{node.demand}</text>
          </g>)}
          <g className="cvrp-depot" data-depot transform={`translate(${depot.x} ${depot.y})`}>
            <rect x="-19" y="-19" width="38" height="38" rx="4" />
            <text textAnchor="middle" dominantBaseline="central">D</text>
            <text className="cvrp-depot-label" y="38" textAnchor="middle">Depot</text>
          </g>
          <text className="cvrp-map-note" x="24" y="350">Numbers show demand</text>
          <text className="cvrp-map-status" x="616" y="350" textAnchor="end">{stage === 0 ? `${cvrpCandidates.length} candidate routes` : `${cvrpRoutes.length} selected routes`}</text>
        </svg>
        <div className="cvrp-loads" aria-label="Route loads">
          {cvrpRoutes.map(route => <div key={route.id} className="cvrp-load" data-route-load={route.load} data-route-capacity={cvrpCapacity} style={{ "--route-color": routeColors[route.id] } as CSSProperties}>
            <div className="cvrp-load-label"><span>Route {route.id.toUpperCase()}</span><span><strong>{route.load}</strong> / {cvrpCapacity}</span></div>
            <div className="cvrp-capacity-track" aria-hidden="true"><span style={{ width: `${route.load / cvrpCapacity * 100}%` }} /></div>
          </div>)}
        </div>
        <div className="cvrp-provenance">Illustrative instance <span>Capacity-feasible routes</span></div>
      </div>}
    </AnimatedArtwork>
  );
}
