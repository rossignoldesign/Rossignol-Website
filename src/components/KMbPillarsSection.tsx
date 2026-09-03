import { useId, useState } from "react";
import type { PillarData } from "../types/pillar";
import { pillarData } from "../data/pillars";

function BookGlyph() {
  return (
    <svg className="kmb-book" width="28" height="34" viewBox="0 0 26 34" fill="none" aria-hidden="true">
      <g className="kmb-book-closed">
        <path d="M8 6.2 L11.6 3.6 L24.4 6.4 L21 9 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M8 6.2 L4.6 9.4 L4.6 28.2 L8 25.2 Z" fill="currentColor" fillOpacity="0.72" />
        <path d="M8 6.2 L21 9 L21 28 L8 25.2 Z" fill="currentColor" />
        <path d="M21 9 L24.4 6.4 L24.4 25.4 L21 28 Z" fill="currentColor" fillOpacity="0.38" />
      </g>
      <g className="kmb-book-ajar">
        <path d="M8 6.2 L11.6 3.6 L24.4 6.4 L21 9 Z" fill="currentColor" fillOpacity="0.35" />
        <path d="M8 6.2 L4.6 9.4 L4.6 28.2 L8 25.2 Z" fill="currentColor" fillOpacity="0.72" />
        <path d="M8 6.4 L14.4 8.4 L14.4 26.8 L8 25.2 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M10.2 6.8 L23.6 8.6 L23.6 27.4 L10.2 25.6 Z" fill="currentColor" />
        <path d="M21 9.2 L24.8 7 L24.8 25.8 L21 27.6 Z" fill="currentColor" fillOpacity="0.28" />
      </g>
      <g className="kmb-book-open">
        <path d="M1.6 14.6 L13 11.2 L13 26.4 L1.6 24.8 Z" fill="currentColor" />
        <path d="M13 11.2 L24.4 14.6 L24.4 24.8 L13 26.4 Z" fill="currentColor" />
        <path d="M3.4 15 L13 12.6 L13 25.4 L3.4 24.2 Z" fill="currentColor" fillOpacity="0.22" />
        <path d="M13 12.6 L22.6 15 L22.6 24.2 L13 25.4 Z" fill="currentColor" fillOpacity="0.22" />
        <path d="M13 12.6 V25.4" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function PillarCard({ pillar }: { pillar: PillarData }) {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const drawerId = `pillar-drawer-${pillar.id}-${reactId}`;
  const headingId = `pillar-title-${pillar.id}-${reactId}`;

  return (
    <article className="flex flex-col bg-canvas px-4 py-4 md:px-5 md:py-5">
      <h3 id={headingId} className="text-base font-semibold leading-snug tracking-tight text-ink md:text-lg">
        {pillar.title}
      </h3>
      <p className="mt-1.5 text-xs font-light leading-relaxed text-ink/80">{pillar.subhead}</p>
      <ul className="mt-2.5 flex flex-wrap items-center gap-[0.3rem]" aria-label={`${pillar.title} topics`}>
        {pillar.tags.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              className={`rounded-[0.45rem] border px-[0.45rem] py-[0.15rem] text-[0.72rem] font-medium uppercase tracking-wide transition duration-300 ease-calm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                isOpen
                  ? "border-terracotta bg-terracotta text-canvas"
                  : "border-teal/20 bg-transparent text-teal hover:border-terracotta hover:bg-terracotta hover:text-canvas"
              }`}
              aria-expanded={isOpen}
              aria-controls={drawerId}
              onClick={() => setIsOpen((open) => !open)}
            >
              {tag}
            </button>
          </li>
        ))}
        <li className="ml-0.5">
          <button
            type="button"
            className="kmb-toggle flex items-center rounded-lg p-0.5 text-terracotta transition duration-300 ease-calm hover:text-terracotta/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            aria-expanded={isOpen}
            aria-controls={drawerId}
            aria-label={isOpen ? `Hide details for ${pillar.title}` : `Read more about ${pillar.title}`}
            onClick={() => setIsOpen((open) => !open)}
          >
            <BookGlyph />
          </button>
        </li>
      </ul>

      <div
        id={drawerId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!isOpen}
        {...(!isOpen ? { inert: "" } : {})}
        className={`kmb-drawer ${isOpen ? "is-open" : ""}`}
      >
        <div className="kmb-drawer-inner">
          <div className="kmb-drawer-content mt-3 space-y-3 border-t border-ink/10 pt-3">
            {pillar.sections.map((section) => (
              <section key={section.heading}>
                <h4 className="text-[0.65rem] font-medium uppercase tracking-wide text-teal">{section.heading}</h4>
                <p className="mt-1 text-xs font-light leading-relaxed text-ink/80">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function KMbPillarsSection({ pillars = pillarData }: { pillars?: PillarData[] }) {
  return (
    <section
      id="pillars"
      className="bg-transparent pb-16 pt-2 md:pb-20"
      aria-labelledby="pillars-kicker"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p
          id="pillars-kicker"
          className="text-[0.7rem] font-medium uppercase tracking-wide text-canvas/60"
        >
          Service Pillars
        </p>
        <div className="mt-4 grid grid-cols-1 divide-y divide-ink/10 overflow-hidden rounded-xl border border-canvas/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
