"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function CarPhoto({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={className}
        style={{
          aspectRatio: "16 / 9",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0000 0%, #0a0a0b 100%)",
          color: "var(--color-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          padding: 24,
          textAlign: "center",
        }}
      >
        Photo pending: save to {src}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      onError={() => setErrored(true)}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}
