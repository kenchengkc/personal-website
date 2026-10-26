"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** One persistent scene moves into the browser's modal layer without restarting. */
export function ArtworkWindow({ name, title = name, children }: {
  name: string;
  title?: string;
  children: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const restorePage = useRef<(() => void) | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => () => restorePage.current?.(), []);

  function expand() {
    const window = dialog.current;
    const placeholder = host.current;
    if (!window || !placeholder || window.matches(":modal")) return;
    placeholder.style.height = `${placeholder.getBoundingClientRect().height}px`;
    const page = document.documentElement;
    const overflow = page.style.overflow;
    const gutter = page.style.scrollbarGutter;
    page.style.setProperty("scrollbar-gutter", "stable");
    page.style.setProperty("overflow", "hidden");
    restorePage.current = () => {
      page.style.setProperty("overflow", overflow);
      page.style.setProperty("scrollbar-gutter", gutter);
    };
    // A nonmodal dialog must be closed before showModal. Its children stay mounted.
    window.close();
    window.showModal();
    setExpanded(true);
  }

  function restore() {
    const window = dialog.current;
    if (!window?.matches(":modal")) return;
    window.close();
    window.show();
    restorePage.current?.();
    restorePage.current = null;
    if (host.current) host.current.style.removeProperty("height");
    setExpanded(false);
    expandButton.current?.focus({ preventScroll: true });
  }

  return <div ref={host} className="artwork-window-host" data-window={name.toLowerCase()}>
    <dialog
      ref={dialog}
      open
      className="artwork-window-dialog"
      role={expanded ? "dialog" : "presentation"}
      aria-label={expanded ? `${name} enlarged preview` : undefined}
      aria-modal={expanded ? true : undefined}
      onCancel={event => { event.preventDefault(); restore(); }}
      onClick={event => {
        if (event.target !== event.currentTarget || !expanded) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) restore();
      }}
    >
      <div className="product-browser-titlebar artwork-window-titlebar">
        <div className="product-browser-dots">
          {expanded
            ? <button type="button" className="product-browser-dot" aria-label={`Close ${name} preview`} title="Close preview" onClick={restore}><span className="product-browser-light is-red" /></button>
            : <span className="product-browser-dot" aria-hidden="true"><span className="product-browser-light is-red" /></span>}
          <span className="product-browser-dot" aria-hidden="true"><span className="product-browser-light is-yellow" /></span>
          <button
            ref={expandButton}
            type="button"
            className="product-browser-dot"
            aria-label={`${expanded ? "Restore" : "Expand"} ${name} preview`}
            aria-haspopup={expanded ? undefined : "dialog"}
            aria-expanded={expanded}
            title={expanded ? "Restore preview" : "Expand preview"}
            onClick={expanded ? restore : expand}
          ><span className="product-browser-light is-green" /></button>
        </div>
        <span className="product-browser-domain">{title}</span>
      </div>
      <div className="artwork-window-content">{children}</div>
    </dialog>
  </div>;
}
