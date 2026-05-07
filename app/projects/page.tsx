import { SectionHeader } from "@/components/common/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AwardBadge } from "@/components/awards/AwardBadge";
import { projects } from "@/content/projects";
import { awards } from "@/content/awards";

export const metadata = {
  title: "Projects — Ken Cheng",
};

export default function ProjectsPage() {
  return (
    <>
      <SectionHeader
        lap={3}
        sector={1}
        title="Projects & Publications"
        subtitle="Builds, research, and code I'm proud of — from quant systems to peer-reviewed ML."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <section className="mt-24">
        <SectionHeader
          lap={3}
          sector={2}
          title="Awards"
          subtitle="Trophies on the shelf."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((a) => (
            <AwardBadge key={a.id} award={a} />
          ))}
        </div>
      </section>
    </>
  );
}
