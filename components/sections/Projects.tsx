"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Arrow, ArrowUpRight } from "@/components/icons/Icons";
import { ProjectArtwork, type ArtworkKind } from "@/components/projects/ProjectArtwork";
import { featuredProjects, otherWork, type FeaturedProject } from "@/data/portfolio";
import { site } from "@/lib/site";

const categories = ["work", "research", "awards"] as const;
type Category = typeof categories[number];
const categoryLabels = { work: "Work", research: "Research", awards: "Awards" };
const researchArtwork: ArtworkKind[] = ["cml", "wasserstein", "aster", "gcinf"];
const awardArtwork: ArtworkKind[] = ["usaco", "speed", "cvrp"];
const researchProjects = otherWork.slice(0, researchArtwork.length);
const awardProjects = otherWork.slice(researchArtwork.length);
const categoryCounts = { work: featuredProjects.length, research: researchProjects.length, awards: awardProjects.length };

function prepareFigures(root: ParentNode | null) {
  root?.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(image => {
    image.fetchPriority = "low";
    image.loading = "eager";
    void image.decode().catch(() => {});
  });
}

// The role and date live in the summary so they stay under the title when an
// entry is open, instead of dropping below the whole description.
function FeaturedEntry({ project }: { project: FeaturedProject }) {
  return (
    <article className="portfolio-entry" data-project={project.demo}>
      <ProjectArtwork kind={project.demo} />
      <details className="portfolio-details">
        <summary>
          <h3>{project.demo === "amazon" ? (
            <Image className="portfolio-company-logo" src="/images/amazon/amazon-logo.svg" alt={project.name} width={96} height={32} />
          ) : project.name}</h3>
          <span className="portfolio-more" aria-hidden="true" />
          <span className="portfolio-meta">{project.eyebrow}</span>
          <span className="portfolio-meta portfolio-date">{project.date}</span>
        </summary>
        <div className="portfolio-description">
          <p className="portfolio-lead">{project.summary}</p>
          <ul className="portfolio-metrics" aria-label={`${project.name} metrics`}>
            {project.metrics.map(metric => <li key={metric.label}><strong>{metric.value}</strong> <span>{metric.label}</span></li>)}
          </ul>
          {project.details?.map(detail => <p key={detail}>{detail}</p>)}
          <p className="portfolio-stack"><span>Stack</span> {project.stack}</p>
          {(project.href || project.secondaryHref) && (
            <div className="portfolio-links">
              {project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel}<ArrowUpRight /></a>}
              {project.secondaryHref && <a href={project.secondaryHref} target="_blank" rel="noopener noreferrer">{project.secondaryLabel}<ArrowUpRight /></a>}
            </div>
          )}
        </div>
      </details>
    </article>
  );
}

function ResearchEntry({ item, artwork }: { item: typeof otherWork[number]; artwork: ArtworkKind }) {
  return (
    <article className="portfolio-entry" data-project={artwork}>
      <ProjectArtwork kind={artwork} />
      <details className="portfolio-details">
        <summary>
          <h3>{item.title}</h3>
          <span className="portfolio-more" aria-hidden="true" />
          {item.meta && <span className="portfolio-meta">{item.meta}</span>}
        </summary>
        <div className="portfolio-description">
          <p>{item.detail}</p>
          {item.href && <div className="portfolio-links"><a href={item.href} target="_blank" rel="noopener noreferrer">{artwork === "gcinf" ? "Read the paper" : "Explore the project"}<ArrowUpRight /></a></div>}
        </div>
      </details>
    </article>
  );
}

function AwardEntry({ item, artwork }: { item: typeof otherWork[number]; artwork: ArtworkKind }) {
  const award = item.award;
  if (!award) return null;
  const href = item.href || (artwork === "speed" ? site.links.f1cfd : undefined);
  return (
    <article className="portfolio-entry award-entry" data-project={artwork}>
      <header className="award-heading">
        <div className="award-heading-copy">
          <div className="award-label-row">
            <p className="award-distinction">{award.highlight || award.distinction}</p>
            <time className="award-year" dateTime={award.year}>{award.year}</time>
          </div>
          <h3 className="award-project-title">{item.title}</h3>
          {artwork !== "usaco" && <p className="award-organization">{award.organization}</p>}
          {item.meta && <p className="award-subject">{item.meta}</p>}
        </div>
        {artwork === "speed" && <Image
          className="award-medal"
          src="/images/awards/cwsf-gold-medal-v2.webp"
          alt="Recreated gold Au science fair medal with a purple ribbon"
          width={375} height={600} sizes="52px" loading="lazy" unoptimized
        />}
      </header>
      <ProjectArtwork kind={artwork} />
      <details className="portfolio-details">
        <summary aria-label={`Details about ${item.title}`}><span>View details</span><span className="portfolio-more" aria-hidden="true" /></summary>
        <div className="portfolio-description">
          <p>{item.detail}</p>
          {href && <div className="portfolio-links"><a href={href} target="_blank" rel="noopener noreferrer">{artwork === "speed" ? "Read the paper" : "Explore the project"}<ArrowUpRight /></a></div>}
        </div>
      </details>
    </article>
  );
}

export function Projects() {
  const [category, setCategory] = useState<Category>("work");
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navigationFrame = useRef(0);
  const nextCategories = [1, 2].map(offset => categories[(categories.indexOf(category) + offset) % categories.length]);
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
    function readLocation() {
      cancelAnimationFrame(navigationFrame.current);
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setCategory("work");
        return;
      }
      if (!categories.includes(hash as Category)) return;
      setCategory(hash as Category);
      // Hidden category deep links land at the shared gallery navigation.
      navigationFrame.current = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" }));
    }
    readLocation();
    window.addEventListener("hashchange", readLocation);
    window.addEventListener("popstate", readLocation);
    return () => {
      cancelAnimationFrame(navigationFrame.current);
      window.removeEventListener("hashchange", readLocation);
      window.removeEventListener("popstate", readLocation);
    };
  }, []);

  function selectCategory(next: Category, scrollToStart = false) {
    const position = { top: window.scrollY, left: window.scrollX };
    prepareCategory(next);
    setCategory(next);
    if (window.location.hash !== `#${next}`) window.history.pushState(window.history.state, "", `#${next}`);
    cancelAnimationFrame(navigationFrame.current);
    // Keep menu switches in place after the panel's height changes. Continuation
    // links explicitly navigate to the beginning of the next category.
    navigationFrame.current = requestAnimationFrame(() => {
      if (scrollToStart) sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ ...position, behavior: "instant" });
      tabRefs.current[categories.indexOf(next)]?.focus({ preventScroll: true });
    });
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
  }

  return (
    <section ref={sectionRef} className="portfolio-gallery" id="work" data-scroll-section data-scroll-label="WORK" aria-label="Work, research, and awards">
      <noscript><nav className="portfolio-fallback" aria-label="Portfolio categories"><a href="#work">Work</a><a href="#research">Research</a><a href="#awards">Awards</a></nav></noscript>
      <div className="portfolio-navigation">
        <nav className="portfolio-tabs" role="tablist" aria-label="Portfolio categories">
          {categories.map((name, index) => (
            <a key={name} ref={element => { tabRefs.current[index] = element; }} href={`#${name}`} id={`gallery-tab-${name}`} role="tab"
              aria-selected={category === name} aria-controls={name === "work" ? "portfolio-work" : name} tabIndex={category === name ? 0 : -1}
              aria-describedby={`gallery-count-${name}`}
              onPointerEnter={() => prepareCategory(name)} onFocus={() => prepareCategory(name)}
              onClick={event => { event.preventDefault(); selectCategory(name); }} onKeyDown={event => handleKey(event, index)}>
              {categoryLabels[name]}<span className="portfolio-tab-count" aria-hidden="true">{categoryCounts[name]}</span>
              <span id={`gallery-count-${name}`} hidden>{categoryCounts[name]} {name === "awards" ? "awards" : "projects"}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="portfolio-panel" id="portfolio-work" role="tabpanel" aria-labelledby="gallery-tab-work" hidden={category !== "work"}>
        <div className="portfolio-grid">{featuredProjects.map(project => <FeaturedEntry project={project} key={project.name} />)}</div>
      </div>
      <div className="portfolio-panel" id="research" role="tabpanel" aria-labelledby="gallery-tab-research" hidden={category !== "research"}>
        <div className="portfolio-grid">{researchProjects.map((item, index) => <ResearchEntry item={item} artwork={researchArtwork[index]} key={item.title} />)}</div>
      </div>
      <div className="portfolio-panel" id="awards" role="tabpanel" aria-labelledby="gallery-tab-awards" hidden={category !== "awards"}>
        <div className="portfolio-grid">
          {awardProjects.map((item, index) => <AwardEntry item={item} artwork={awardArtwork[index]} key={item.title} />)}
        </div>
      </div>
      <nav className="portfolio-continuation" aria-label="Explore more projects">
        {nextCategories.map((name, index) => (
          <a key={name} href={`#${name}`} className={index === 0 ? "portfolio-next" : undefined}
            onPointerEnter={() => prepareCategory(name)} onFocus={() => prepareCategory(name)}
            onClick={event => { event.preventDefault(); selectCategory(name, true); }}>
            View {categoryLabels[name]}{index === 0 && <Arrow size={18} />}
          </a>
        ))}
      </nav>
      <noscript>
        <style>{`.portfolio-navigation, .portfolio-continuation { display: none; } .portfolio-panel[hidden] { display: block !important; } .portfolio-panel + .portfolio-panel { margin-top: 48px; }`}</style>
      </noscript>
    </section>
  );
}
