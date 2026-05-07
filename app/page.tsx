import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { QuickFacts } from "@/components/home/QuickFacts";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickFacts />

      <section className="mt-32">
        <SectionHeader
          lap={1}
          sector={3}
          title="Currently"
          subtitle="What's on the dyno right now."
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-base p-6">
            <p className="telemetry-accent">FOCUS</p>
            <h3 className="mt-2 text-xl font-bold">
              Quantiv — options analytics platform
            </h3>
            <p className="mt-3 text-muted text-sm leading-relaxed">
              Building an ML-powered system to predict implied earnings moves.
              Next.js + FastAPI, DuckDB pipeline over 1B+ option records,
              XGBoost on historical Greeks.
            </p>
            <Link
              href="/projects"
              className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              See the build <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card-base p-6">
            <p className="telemetry-accent">EDUCATION</p>
            <h3 className="mt-2 text-xl font-bold">
              Columbia University · B.S. Computer Science
            </h3>
            <p className="mt-3 text-muted text-sm leading-relaxed">
              Stats minor. Egleston Scholar (Top 1%). Expected 05/2028. New
              York, NY.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeader lap={1} sector={4} title="Get in touch" />
        <p className="text-muted max-w-xl">
          Recruiting, collaboration, or just want to talk F1? The radio is
          open.
        </p>
        <div className="mt-6">
          <Link href="/contact" className="btn btn-primary">
            OPEN RADIO <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
