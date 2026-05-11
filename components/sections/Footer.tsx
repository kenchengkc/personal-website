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
          <span>
            <span className="v2-brand-name">
              <Image
                src="/images/logonamewhitebold.png"
                alt="Ken Cheng"
                width={2804}
                height={561}
                className="v2-brand-name-img"
                sizes="200px"
                unoptimized
              />
            </span>
            <span className="v2-footer-brand-rest">
              {" "}
              · {new Date().getFullYear()}
            </span>
          </span>
        </div>
        <span className="v2-mono v2-mono--dim">Built in New York · F1 fan</span>
      </div>
    </footer>
  );
}
