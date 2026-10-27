"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "@/components/icons/Icons";
import { ProjectArtwork, type ArtworkKind } from "@/components/projects/ProjectArtwork";
import { featuredProjects, otherWork, type FeaturedProject } from "@/data/portfolio";
import { site } from "@/lib/site";

const categories = ["work", "research", "awards"] as const;
type Category = typeof categories[number];
const categoryLabels = { work: "Work", research: "Research", awards: "Awards" };
const researchArtwork: ArtworkKind[] = ["cml", "wasserstein", "aster", "gcinf"];
const awardArtwork: ArtworkKind[] = ["usaco", "speed", "cvrp"];

function prepareFigures(root: ParentNode | null) {
  root?.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(image => {
    image.fetchPriority = "low";
    image.loading = "eager";
    void image.decode().catch(() => {});
  });
}

function FeaturedEntry({ project }: { project: FeaturedProject }) {
  return (
    <article className="portfolio-entry" data-project={project.demo}>
      <ProjectArtwork kind={project.demo} />
      <details className="portfolio-details">
        <summary><h3>{project.name}</h3><span className="portfolio-more" aria-hidden="true">+</span></summary>
        <div className="portfolio-description">
          <p>{project.summary}</p>
          <ul className="portfolio-metrics" aria-label={`${project.name} metrics`}>
            {project.metrics.map(metric => <li key={metric.label}><strong>{metric.value}</strong> {metric.label}</li>)}
          </ul>
          {project.details?.map(detail => <p key={detail}>{detail}</p>)}
          <p className="portfolio-stack">{project.stack}</p>
          {(project.href || project.secondaryHref) && (
            <div className="portfolio-links">
              {project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel}<ArrowUpRight /></a>}
              {project.secondaryHref && <a href={project.secondaryHref} target="_blank" rel="noopener noreferrer">{project.secondaryLabel}<ArrowUpRight /></a>}
            </div>
          )}
        </div>
      </details>
      <p className="portfolio-meta">{project.eyebrow}<span>{project.date}</span></p>
    </article>
  );
}

function ResearchEntry({ item, artwork }: { item: typeof otherWork[number]; artwork: ArtworkKind }) {
  const paper = artwork === "speed" ? site.links.f1cfd : undefined;
  return (
    <article className="portfolio-entry" data-project={artwork}>
      <ProjectArtwork kind={artwork} />
      <details className="portfolio-details">
        <summary><h3>{item.title}</h3><span className="portfolio-more" aria-hidden="true">+</span></summary>
        <div className="portfolio-description">
          <p>{item.detail}</p>
          {(item.href || paper) && <div className="portfolio-links"><a href={item.href || paper} target="_blank" rel="noopener noreferrer">{artwork === "gcinf" || paper ? "Read the paper" : "Explore the project"}<ArrowUpRight /></a></div>}
        </div>
      </details>
      <p className="portfolio-meta">{item.meta}</p>
    </article>
  );
}

export function Projects() {
  const [category, setCategory] = useState<Category>("work");
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  useEffect(() => {
    // The atlas can finish decoding after window.load. Keep background figure
    // preparation behind the actual hero handoff, not just document loading.
    const brain = document.querySelector<HTMLElement>(".hero-binary-art");
    const observer = new MutationObserver(prepare);
    function prepare() {
      if (document.readyState !== "complete") return;
      if (brain && brain.dataset.ready !== "true" && brain.dataset.phase !== "complete") return;
      prepareFigures(sectionRef.current);
      observer.disconnect();
      window.removeEventListener("load", prepare);
    }
    if (brain) observer.observe(brain, { attributes: true, attributeFilter: ["data-ready", "data-phase"] });
    window.addEventListener("load", prepare, { once: true });
    prepare();
    return () => {
      observer.disconnect();
      window.removeEventListener("load", prepare);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    function readLocation() {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setCategory("work");
        return;
      }
      if (!categories.includes(hash as Category)) return;
      setCategory(hash as Category);
      cancelAnimationFrame(frame);
      // Hidden category deep links land at the shared gallery navigation.
      frame = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" }));
    }
    readLocation();
    window.addEventListener("hashchange", readLocation);
    window.addEventListener("popstate", readLocation);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", readLocation);
      window.removeEventListener("popstate", readLocation);
    };
  }, []);

  function selectCategory(next: Category) {
    prepareCategory(next);
    setCategory(next);
    if (window.location.hash !== `#${next}`) window.history.pushState(window.history.state, "", `#${next}`);
  }

  function prepareCategory(next: Category) {
    prepareFigures(document.getElementById(next === "work" ? "portfolio-work" : next));
  }

  function handleKey(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") next = (index + categories.length - 1) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault();
    selectCategory(categories[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <section ref={sectionRef} className="portfolio-gallery" id="work" data-scroll-section data-scroll-label="WORK" aria-label="Work, research, and awards">
      <noscript><nav className="portfolio-fallback" aria-label="Portfolio categories"><a href="#work">Work</a><a href="#research">Research</a><a href="#awards">Awards</a></nav></noscript>
      <nav className="portfolio-tabs" role="tablist" aria-label="Portfolio categories">
        {categories.map((name, index) => (
          <a key={name} ref={element => { tabRefs.current[index] = element; }} href={`#${name}`} id={`gallery-tab-${name}`} role="tab"
            aria-selected={category === name} aria-controls={name === "work" ? "portfolio-work" : name} tabIndex={category === name ? 0 : -1}
            onPointerEnter={() => prepareCategory(name)} onFocus={() => prepareCategory(name)}
            onClick={event => { event.preventDefault(); selectCategory(name); }} onKeyDown={event => handleKey(event, index)}>
            {categoryLabels[name]}
          </a>
        ))}
      </nav>
      <div className="portfolio-panel" id="portfolio-work" role="tabpanel" aria-labelledby="gallery-tab-work" hidden={category !== "work"}>
        <div className="portfolio-grid">{featuredProjects.map(project => <FeaturedEntry project={project} key={project.name} />)}</div>
      </div>
      <div className="portfolio-panel" id="research" role="tabpanel" aria-labelledby="gallery-tab-research" hidden={category !== "research"}>
        <div className="portfolio-grid">{otherWork.slice(0, 4).map((item, index) => <ResearchEntry item={item} artwork={researchArtwork[index]} key={item.title} />)}</div>
      </div>
      <div className="portfolio-panel" id="awards" role="tabpanel" aria-labelledby="gallery-tab-awards" hidden={category !== "awards"}>
        <div className="portfolio-grid">
          {otherWork.slice(4).map((item, index) => <ResearchEntry item={item} artwork={awardArtwork[index]} key={item.title} />)}
        </div>
      </div>
      <noscript>
        <style>{`.portfolio-tabs { display: none; } .portfolio-panel[hidden] { display: block !important; } .portfolio-panel + .portfolio-panel { margin-top: 48px; }`}</style>
      </noscript>
    </section>
  );
}
