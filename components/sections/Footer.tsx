import Image from "next/image";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          <span className="v2-brand-mark">
            <Image
              src="/images/kclogo.png"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              unoptimized
            />
          </span>
          <div className="v2-footer-brand-line">
            <span className="v2-brand-name">Ken Cheng</span>
            <span className="v2-footer-brand-rest">
              <span className="v2-footer-brand-sep" aria-hidden>
                {" ·"}
              </span>
              <span className="v2-footer-brand-year">
                {new Date().getFullYear()}
              </span>
            </span>
          </div>
        </div>
        <span className="v2-mono v2-mono--dim">Built in New York · F1 fan</span>
      </div>
    </footer>
  );
}
