import type { FeaturedProject } from "@/data/portfolio";
import { AmazonDemo } from "./AmazonDemo";
import { QuantivDemo } from "./QuantivDemo";
import { FdreDemo } from "./FdreDemo";
import { EmbersDemo } from "./EmbersDemo";

export function ProjectDemo({ kind }: { kind: FeaturedProject["demo"] }) {
  switch (kind) {
    case "amazon": return <AmazonDemo />;
    case "quantiv": return <QuantivDemo />;
    case "fdre": return <FdreDemo />;
    case "embers": return <EmbersDemo />;
  }
}
