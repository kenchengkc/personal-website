import {
  createElement,
  forwardRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "a"
  | "span"
  | "h1"
  | "p";

type RevealVariant = "lift" | "fade" | "panel" | "scale" | "line";

type RevealStyle = CSSProperties & {
  "--reveal-delay": string;
  "--reveal-duration": string;
  "--reveal-y": string;
};

type ScrollRevealProps = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  variant?: RevealVariant;
  y?: number;
  style?: CSSProperties;
} & HTMLAttributes<HTMLElement> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "target" | "rel" | "download"
  >;

export const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(
  function ScrollReveal(
    {
      as = "div",
      children,
      className,
      delay = 0,
      duration = 0.46,
      once = false,
      variant = "lift",
      y = 18,
      style,
      ...rest
    },
    ref,
  ) {
    const Component = as as ElementType;
    const revealStyle: RevealStyle = {
      ...style,
      "--reveal-delay": `${delay}s`,
      "--reveal-duration": `${duration}s`,
      "--reveal-y": `${y}px`,
    };

    return createElement(
      Component,
      {
        ref,
        className: ["v2-scroll-reveal", className].filter(Boolean).join(" "),
        "data-reveal-visible": "false",
        "data-reveal-once": once ? "true" : "false",
        "data-reveal-variant": variant,
        style: revealStyle,
        ...rest,
      },
      children,
    );
  },
);

ScrollReveal.displayName = "ScrollReveal";
