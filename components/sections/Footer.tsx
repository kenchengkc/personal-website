import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <span>Ken Cheng · {new Date().getFullYear()}</span>
      <span>{site.location}</span>
    </footer>
  );
}
