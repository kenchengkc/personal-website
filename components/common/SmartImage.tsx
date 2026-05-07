"use client";

import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

type Props = {
  src?: string;
  alt?: string;
  label?: string;
};

export function SmartImage({ src, alt, label }: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <ImagePlaceholder label={label} />;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="h-full w-full object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
