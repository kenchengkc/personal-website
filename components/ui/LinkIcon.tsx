type LinkIconName =
  | "resume"
  | "github"
  | "linkedin"
  | "mail"
  | "scholar"
  | "columbia";

const paths: Record<LinkIconName, React.ReactNode> = {
  resume: (
    <>
      <path d="M6 2.75h7l5 5V21.25H6z" />
      <path d="M13 2.75v5h5" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  github: (
    <>
      <path d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.63-.2.63-.45v-1.77c-2.57.56-3.11-1.1-3.11-1.1-.42-1.07-1.03-1.35-1.03-1.35-.84-.58.06-.57.06-.57.93.07 1.42.96 1.42.96.83 1.42 2.17 1.01 2.7.77.08-.6.32-1.01.59-1.24-2.05-.23-4.21-1.03-4.21-4.57 0-1.01.36-1.84.95-2.49-.1-.23-.41-1.18.09-2.46 0 0 .78-.25 2.54.95A8.84 8.84 0 0 1 12 7.1c.78 0 1.56.1 2.3.31 1.76-1.2 2.53-.95 2.53-.95.5 1.28.19 2.23.09 2.46.59.65.95 1.48.95 2.49 0 3.55-2.16 4.33-4.22 4.56.33.29.63.86.63 1.74v2.62c0 .25.17.54.64.45A9.25 9.25 0 0 0 12 2.75Z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="9" width="3" height="10" rx=".5" />
      <circle cx="5.5" cy="5.5" r="1.5" />
      <path d="M11 19V9h3v1.5c.9-1.2 2.1-1.8 3.5-1.8 2.6 0 3.5 1.7 3.5 4.3v6h-3v-5.3c0-1.4-.4-2.3-1.8-2.3-1.5 0-2.2 1-2.2 2.7V19z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  scholar: (
    <>
      <path d="m3 9 9-5 9 5-9 5z" />
      <path d="M7 12.2v4.3c2.9 2 7.1 2 10 0v-4.3" />
    </>
  ),
  columbia: (
    <>
      <path d="M4 20h16M6 17h12M7 17V9h10v8M5 9h14L12 4z" />
      <path d="M10 17v-5h4v5" />
    </>
  ),
};

export function LinkIcon({ name }: { name: LinkIconName }) {
  return (
    <svg
      className="link-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
