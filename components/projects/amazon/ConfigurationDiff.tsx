import { FileCode2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { files as configurations, type FileId, type Value } from "./forecast";
import "./configuration-diff.css";

type Props = {
  id: FileId;
  files: readonly FileId[];
  authorName: string;
  original: Value;
  value: Value | null;
  baseVersion: number;
  locked: boolean;
  onFile: (id: FileId) => void;
  onValue: (value: Value | null) => void;
};

const contextFields = {
  input: [["source", "sales"], ["timezone", "UTC"]],
  window: [["cadence", "weekly"], ["timezone", "UTC"]],
  delivery: [["dataset", "demand"], ["partition", "run_id"]],
} as const;

function DiffLine({ line, kind = "context", children }: {
  line: number;
  kind?: "context" | "delete" | "add" | "draft";
  children: ReactNode;
}) {
  const oldLine = kind === "add" ? "" : line;
  const newLine = kind === "delete" ? "" : line;
  const sign = kind === "add" ? "+" : kind === "delete" ? "-" : "";
  return <div className="fd-row" data-kind={kind} data-old-line={oldLine} data-new-line={newLine}>
    <span className="fd-old" aria-hidden="true">{oldLine}</span>
    <span className="fd-new" aria-hidden="true">{newLine}</span>
    <span className="fd-sign">{sign}</span>
    <code className="fd-code">{children}</code>
  </div>;
}

function Property({ name, comma = true, children }: { name: string; comma?: boolean; children: ReactNode }) {
  return <>{'  '}<span className="fd-key">{JSON.stringify(name)}</span>{": "}{children}{comma && ","}</>;
}

function EditedValue({ id, value, onValue }: Pick<Props, "id" | "value" | "onValue">) {
  const config = configurations[id];
  // Keep the invalid text visible while the parent disables pushing this draft.
  const [invalidText, setInvalidText] = useState("");
  const label = `New value for ${config.key}`;

  if (config.kind === "enum") {
    return <>{'"'}<select aria-label={label} value={value ?? ""}
      style={{ width: `${String(value ?? "").length + .15}ch` }}
      onChange={event => onValue(event.currentTarget.value)}>
      {config.options?.map(option => <option key={option} value={option}>{option}</option>)}
    </select>{'"'}</>;
  }

  const text = value === null ? invalidText : String(value);
  return <input type="number" inputMode="numeric" step={1} min={config.min} max={config.max}
    aria-label={label} aria-invalid={value === null} value={text}
    style={{ width: `${Math.max(1.25, text.length + .15)}ch` }}
    onChange={event => {
      const input = event.currentTarget;
      if (input.validity.valid && Number.isFinite(input.valueAsNumber)) {
        onValue(input.valueAsNumber);
      } else {
        setInvalidText(input.value);
        onValue(null);
      }
    }} />;
}

export function ConfigurationDiff({ id, files, authorName, original, value, baseVersion, locked, onFile, onValue }: Props) {
  const config = configurations[id];
  const [above, below] = contextFields[id];
  const changed = value !== null && value !== original;
  const editKind = changed ? "add" : value === null ? "draft" : "context";

  return <section className="amazon-diff" aria-label="Configuration file diff">
    <div className="fd-head">
      <label className="fd-file">
        <FileCode2 aria-hidden="true" size={15} />
        <span className="fd-path" aria-hidden="true">config/</span>
        <select aria-label="Configuration file" value={id} disabled={locked}
          onChange={event => onFile(event.currentTarget.value as FileId)}>
          {files.map(file => <option key={file} value={file}>{configurations[file].name}</option>)}
        </select>
      </label>
      <div className="fd-counts">
        <span className="fd-revisions">v{baseVersion}{changed && ` → v${baseVersion + 1}`}</span>
        {changed ? <>
          <span className="fd-count-add" aria-label="One added line">+1</span>
          <span className="fd-count-del" aria-label="One removed line">−1</span>
        </> : <span>{value === null ? "Edit in progress" : "No changes"}</span>}
      </div>
    </div>
    {changed && <div className="fd-hunk"><span>@@ -1,5 +1,5 @@</span></div>}
    <div className="fd-lines" role="group" aria-label="Unified diff with original and revised line numbers">
      <DiffLine line={1}>{"{"}</DiffLine>
      <DiffLine line={2}><Property name={above[0]}><span className="fd-literal">{JSON.stringify(above[1])}</span></Property></DiffLine>
      {changed && <DiffLine line={3} kind="delete"><Property name={config.key}><span className="fd-token">{JSON.stringify(original)}</span></Property></DiffLine>}
      <DiffLine line={3} kind={editKind}><Property name={config.key}>
        <span className="fd-token">{locked ? JSON.stringify(value) : <EditedValue key={id} id={id} value={value} onValue={onValue} />}</span>
      </Property></DiffLine>
      <DiffLine line={4}><Property name={below[0]} comma={false}><span className="fd-literal">{JSON.stringify(below[1])}</span></Property></DiffLine>
      <DiffLine line={5}>{"}"}</DiffLine>
    </div>
    <p className="fd-attribution">{locked ? "Pushed by" : "Editing as"} {authorName}</p>
  </section>;
}
