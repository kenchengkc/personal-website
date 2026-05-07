import { Trophy } from "lucide-react";
import { Tag } from "@/components/common/Tag";
import type { Award } from "@/content/awards";

export function AwardBadge({ award }: { award: Award }) {
  return (
    <div className="card-base p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <Trophy size={18} className="text-accent shrink-0" />
        <span className="telemetry">{award.date}</span>
      </div>
      <div>
        <h4 className="font-bold leading-snug">{award.title}</h4>
        <p className="mt-1 text-xs text-muted">{award.org}</p>
      </div>
      {award.description && (
        <p className="text-xs text-white/75">{award.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {award.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
