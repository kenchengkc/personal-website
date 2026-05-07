import { SectionHeader } from "@/components/common/SectionHeader";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { experiences } from "@/content/experience";

export const metadata = {
  title: "Experience — Ken Cheng",
};

export default function ExperiencePage() {
  return (
    <>
      <SectionHeader
        lap={2}
        sector={1}
        title="Experience"
        subtitle="Stints in the paddock — engineering, ML, and shipping under deadline."
      />

      <div className="grid grid-cols-1 gap-8">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} />
        ))}
      </div>
    </>
  );
}
