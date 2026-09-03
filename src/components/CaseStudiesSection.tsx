import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudyCarousel, CaseStudyVideo } from "../types/case-study";
import { caseStudiesData } from "../data/case-studies";

const CALM_EASE = [0.22, 1, 0.36, 1] as const;

export function vimeoIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id = parts[parts[0] === "video" ? 1 : 0];
    return id && /^\d+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function toVimeoEmbedSrc(url: string): string {
  const id = vimeoIdFromUrl(url);
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : url;
}

function toYoutubeEmbedSrc(url: string): string {
  try {
    const parsed = new URL(url);
    const id =
      parsed.hostname.replace(/^www\./, "") === "youtu.be"
        ? parsed.pathname.split("/").filter(Boolean)[0]
        : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : url;
  } catch {
    return url;
  }
}

function thumbnailFor(video: CaseStudyVideo): string | undefined {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  const id = vimeoIdFromUrl(video.vimeoUrl);
  return id ? `https://vumbnail.com/${id}.jpg` : undefined;
}

function PlayGlyph() {
  return (
    <span className="play-btn flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-canvas shadow-sm">
      <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
        <path d="M3 1.5v15l12-7.5L3 1.5z" />
      </svg>
    </span>
  );
}

const CONNECT_COPY = "Connecting...almost there...";
const CONNECT_STAGGER_MS = 70;
const CONNECT_WAVE_MS = 1400;
const CONNECT_CYCLES = 3;
const ELSIE_PLANE_SRC = "public/integrations/elsie-macgill/data/airplane.png";
const ELSIE_VIDEO_ID = "mint-elsie-mcgill";

function focusWithoutScroll(el: HTMLElement | null | undefined) {
  el?.focus({ preventScroll: true });
}

function lockPageScroll() {
  const scrollY = window.scrollY;
  const html = document.documentElement;
  const { body } = document;
  const previous = {
    overflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    paddingRight: body.style.paddingRight,
    scrollBehavior: html.style.scrollBehavior,
  };
  const scrollbar = window.innerWidth - html.clientWidth;
  html.style.scrollBehavior = "auto";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.width = "100%";
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

  return (opener?: HTMLElement | null) => {
    body.style.overflow = previous.overflow;
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.width = previous.width;
    body.style.paddingRight = previous.paddingRight;
    window.scrollTo(0, scrollY);
    focusWithoutScroll(opener);
    window.scrollTo(0, scrollY);
    html.style.scrollBehavior = previous.scrollBehavior;
  };
}

function VideoLightbox({
  video,
  onClose,
}: {
  video: CaseStudyVideo;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const vimeoRef = useRef<HTMLIFrameElement>(null);
  const titleId = useId();
  const [connectOut, setConnectOut] = useState(false);
  const [panel, setPanel] = useState<"web" | "episode" | null>(null);
  const expanded = panel !== null;

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockPageScroll();
    focusWithoutScroll(closeRef.current);

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        focusWithoutScroll(first === last ? first : last);
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        focusWithoutScroll(first);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock(opener);
    };
  }, [onClose]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced
      ? 1200
      : (CONNECT_COPY.length - 1) * CONNECT_STAGGER_MS + CONNECT_WAVE_MS * CONNECT_CYCLES;
    const timer = window.setTimeout(() => setConnectOut(true), duration);
    return () => window.clearTimeout(timer);
  }, []);

  function pauseFilm() {
    vimeoRef.current?.contentWindow?.postMessage(JSON.stringify({ method: "pause" }), "*");
  }

  function openWebIntegration() {
    pauseFilm();
    setPanel("web");
  }

  function openFullEpisode() {
    pauseFilm();
    setPanel("episode");
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${expanded ? "p-2 md:p-4" : "p-4 md:p-10"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: CALM_EASE }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/80"
        aria-label="Close video overlay"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex flex-col overflow-hidden rounded-xl border border-canvas/10 bg-teal text-canvas transition-[max-width] duration-300 ease-calm ${
          expanded
            ? "h-[min(94vh,56rem)] max-h-[94vh] w-full max-w-[min(96vw,80rem)]"
            : "max-h-[min(92vh,56rem)] w-full max-w-4xl overflow-y-auto overflow-x-hidden"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-canvas/10 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">
            {panel === "web"
              ? `${video.title} — web integration`
              : panel === "episode"
                ? `${video.title} — full episode`
                : video.title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {expanded ? (
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-canvas/80 transition duration-300 ease-calm hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                onClick={() => setPanel(null)}
              >
                Back to film
              </button>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              className="rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-canvas/80 transition duration-300 ease-calm hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              aria-label="Close video"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <div className={expanded ? "hidden" : "relative aspect-video bg-teal"}>
          <iframe
            ref={vimeoRef}
            className="relative z-0 h-full w-full"
            src={toVimeoEmbedSrc(video.vimeoUrl)}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          <p
            className={`cs-connect${connectOut ? " is-out" : ""}`}
            aria-live="polite"
            aria-hidden={connectOut}
          >
            <span className="cs-connect-copy">
              {CONNECT_COPY.split("").map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="cs-connect-letter"
                  style={{ animationDelay: `${index * CONNECT_STAGGER_MS}ms` }}
                >
                  {char === " " ? "\u00a0" : char}
                </span>
              ))}
            </span>
          </p>
        </div>
        {panel === "web" && video.webIntegrationUrl ? (
          <div className="min-h-0 flex-1 bg-ink">
            <iframe
              className="h-full min-h-[28rem] w-full"
              src={video.webIntegrationUrl}
              title={`${video.title} web integration`}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : panel === "episode" && video.fullEpisodeUrl ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-ink p-4 md:p-8">
            <iframe
              className="aspect-video w-full max-w-5xl"
              src={toYoutubeEmbedSrc(video.fullEpisodeUrl)}
              title={`${video.title} full episode`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <LightboxCaption
            video={video}
            onViewWeb={openWebIntegration}
            onViewEpisode={openFullEpisode}
          />
        )}
      </div>
      {video.id === ELSIE_VIDEO_ID ? (
        <div className="cs-elsie-plane" aria-hidden="true">
          <img src={ELSIE_PLANE_SRC} alt="" />
        </div>
      ) : null}
    </motion.div>
  );
}

function LightboxCaption({
  video,
  onViewWeb,
  onViewEpisode,
}: {
  video: CaseStudyVideo;
  onViewWeb?: () => void;
  onViewEpisode?: () => void;
}) {
  const hasBrief = Boolean(video.clientType || video.summary || video.points?.length);
  if (!hasBrief && !video.tagline && !video.webIntegrationUrl && !video.fullEpisodeUrl) return null;

  const buttonClass =
    "inline-flex rounded-lg bg-terracotta px-5 py-3 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas";

  const ctas =
    video.webIntegrationUrl || video.fullEpisodeUrl ? (
      <div className="mt-5 flex flex-wrap gap-3">
        {video.webIntegrationUrl && onViewWeb ? (
          <button type="button" className={buttonClass} onClick={onViewWeb}>
            View the full web integration
          </button>
        ) : null}
        {video.fullEpisodeUrl && onViewEpisode ? (
          <button type="button" className={buttonClass} onClick={onViewEpisode}>
            Watch a Full Episode
          </button>
        ) : null}
      </div>
    ) : null;

  if (!hasBrief) {
    return (
      <div className="border-t border-canvas/10 px-5 py-4">
        {video.tagline ? (
          <p className="text-sm font-light leading-relaxed text-canvas/85">{video.tagline}</p>
        ) : null}
        {ctas}
      </div>
    );
  }

  return (
    <div className="border-t border-canvas/10 px-5 py-5 text-sm leading-relaxed text-canvas/90">
      {video.clientType ? (
        <p>
          <span className="font-medium tracking-wide text-canvas">Client Type: </span>
          <span className="font-light text-canvas/85">{video.clientType}</span>
        </p>
      ) : null}
      {video.summary ? (
        <p className={`font-light text-canvas/85${video.clientType ? " mt-4" : ""}`}>{video.summary}</p>
      ) : null}
      {video.points?.length ? (
        <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-canvas/45">
          {video.points.map((point) => (
            <li key={point.heading}>
              <span className="font-semibold text-canvas">{point.heading}: </span>
              <span className="font-light text-canvas/85">{point.body}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {ctas}
    </div>
  );
}

function CaseStudyCard({
  video,
  featured,
  onPlay,
}: {
  video: CaseStudyVideo;
  featured: boolean;
  onPlay: (video: CaseStudyVideo) => void;
}) {
  const src = thumbnailFor(video);

  return (
    <article
      className={`cs-card group flex w-[min(78vw,22rem)] shrink-0 flex-col overflow-hidden rounded-xl border border-canvas/10 bg-ink sm:w-[min(62vw,26rem)]${featured ? " is-featured" : ""}`}
    >
      <button
        type="button"
        className="relative aspect-video w-full overflow-hidden bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        onClick={() => onPlay(video)}
        aria-label={`Play ${video.title}`}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
          <PlayGlyph />
        </span>
      </button>
      <div className="flex flex-1 flex-col bg-teal px-5 py-5 transition duration-300 ease-calm group-hover:bg-terracotta group-focus-within:bg-terracotta">
        <h3>
          <button
            type="button"
            className="text-left text-xl font-semibold leading-snug text-canvas transition duration-300 ease-calm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
            onClick={() => onPlay(video)}
          >
            {video.title}
          </button>
        </h3>
      </div>
    </article>
  );
}

function CategoryCarousel({
  carousel,
  onPlay,
}: {
  carousel: CaseStudyCarousel;
  onPlay: (video: CaseStudyVideo) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  function updateFeatured() {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll<HTMLElement>(".cs-card");
    if (!cards.length) return;
    const railBox = rail.getBoundingClientRect();
    const center = railBox.left + railBox.width / 2;
    let next = 0;
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      if (distance < best) {
        best = distance;
        next = index;
      }
    });
    setFeaturedIndex(next);
  }

  function centerCard(index: number, smooth = true) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelectorAll<HTMLElement>(".cs-card")[index];
    if (!card) return;
    const railBox = rail.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    rail.scrollTo({
      left: rail.scrollLeft + (cardBox.left + cardBox.width / 2) - (railBox.left + railBox.width / 2),
      behavior: smooth ? "smooth" : "auto",
    });
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const frame = window.requestAnimationFrame(() => {
      centerCard(0, false);
      updateFeatured();
    });
    const later = window.setTimeout(() => {
      centerCard(0, false);
      updateFeatured();
    }, 250);
    rail.addEventListener("scroll", updateFeatured, { passive: true });
    window.addEventListener("resize", updateFeatured);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
      rail.removeEventListener("scroll", updateFeatured);
      window.removeEventListener("resize", updateFeatured);
    };
  }, [carousel.id]);

  function scrollByCard(direction: number) {
    centerCard(Math.min(carousel.videos.length - 1, Math.max(0, featuredIndex + direction)));
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6">
        <div className="max-w-3xl">
          <h3 id={headingId} className="text-2xl font-semibold tracking-tight text-canvas md:text-3xl">
            {carousel.title}
          </h3>
          <p className="mt-2 text-sm font-light leading-relaxed text-canvas/80">{carousel.tagline}</p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            className="rounded-lg border border-canvas/20 px-3 py-2 text-sm font-medium text-canvas transition duration-300 ease-calm hover:border-teal hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label={`Previous videos in ${carousel.title}`}
            onClick={() => scrollByCard(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-lg border border-canvas/20 px-3 py-2 text-sm font-medium text-canvas transition duration-300 ease-calm hover:border-terracotta hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            aria-label={`Next videos in ${carousel.title}`}
            onClick={() => scrollByCard(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="cs-rail flex overflow-x-auto"
        aria-labelledby={headingId}
      >
        {carousel.videos.map((video, index) => (
          <CaseStudyCard
            key={video.id}
            video={video}
            featured={index === featuredIndex}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
}

function EtherChars({
  text,
  play,
  reduced,
  delay,
}: {
  text: string;
  play: boolean;
  reduced: boolean;
  delay: number;
}) {
  let letterIndex = 0;
  return (
    <>
      {Array.from(text).map((char, index) => {
        const isSpace = char === " ";
        const phase = isSpace ? 0 : letterIndex++;
        const stagger = isSpace ? 0 : (letterIndex - 1) * 36;
        const className = isSpace
          ? "cs-ether-space"
          : `cs-ether-letter cs-ether-letter--${phase % 2 === 0 ? "a" : "b"}`;
        return (
          <span
            key={`${index}-${char}`}
            className={reduced ? undefined : className}
            style={
              reduced
                ? undefined
                : play
                  ? { animationDelay: `${delay + stagger}ms` }
                  : { opacity: 0 }
            }
          >
            {isSpace ? "\u00a0" : char}
          </span>
        );
      })}
    </>
  );
}

function EtherHeading({ play, reduced }: { play: boolean; reduced: boolean }) {
  const words = ["Distilled", "Accessible", "Resonant"] as const;

  return (
    <h2
      id="case-studies-heading"
      className="cs-ether mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-canvas md:text-5xl"
      aria-label="KMb Media: Distilled, Accessible, Resonant"
    >
      <span className="cs-ether-line" aria-hidden="true">
        <EtherChars text="KMb Media:" play={play} reduced={reduced} delay={0} />
      </span>
      <span className="cs-ether-line" aria-hidden="true">
        {words.map((word, index) => (
          <span key={word}>
            {index > 0 ? (
              <span className="cs-ether-pipe">
                <EtherChars text=" | " play={play} reduced={reduced} delay={1200 + index * 1000} />
              </span>
            ) : null}
            <EtherChars text={word} play={play} reduced={reduced} delay={1200 + index * 1000} />
          </span>
        ))}
      </span>
    </h2>
  );
}

export function CaseStudiesSection({
  carousels = caseStudiesData,
}: {
  carousels?: CaseStudyCarousel[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<CaseStudyVideo | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
    };

    if (prefersReduced || location.hash === "#work") {
      reveal();
      return;
    }

    const section = sectionRef.current;
    const intro = section?.querySelector(".cs-work-intro") ?? section;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -12% 0px" }
    );
    if (intro) observer.observe(intro);

    const timers: number[] = [];
    const sectionInView = () => {
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.9 && rect.bottom > 48;
    };

    const afterNavToWork = () => {
      const tryReveal = () => {
        if (sectionInView()) reveal();
      };
      tryReveal();
      timers.push(window.setTimeout(tryReveal, 420), window.setTimeout(tryReveal, 900));
    };

    const onActivate = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('a[href="#work"]')) afterNavToWork();
    };
    const onHash = () => {
      if (location.hash === "#work") afterNavToWork();
    };

    document.addEventListener("click", onActivate, true);
    window.addEventListener("hashchange", onHash);

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      document.removeEventListener("click", onActivate, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`cs-work bg-ink py-16 text-canvas md:py-24${revealed ? " is-in" : ""}`}
      aria-labelledby="case-studies-heading"
    >
      <div className="cs-work-intro mx-auto max-w-6xl px-6">
        <p className="text-[0.7rem] font-medium uppercase tracking-wide text-canvas/60">Selected Case Studies</p>
        <EtherHeading play={revealed} reduced={reduced} />
      </div>

      <div className="cs-work-body mt-16 space-y-16">
        {carousels.map((carousel) => (
          <CategoryCarousel key={carousel.id} carousel={carousel} onPlay={setActive} />
        ))}
      </div>

      <AnimatePresence>
        {active ? <VideoLightbox key={active.id} video={active} onClose={() => setActive(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
