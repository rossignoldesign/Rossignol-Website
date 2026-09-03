import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CALM_EASE = [0.22, 1, 0.36, 1] as const;
const ETHER_MS = 500;
const ETHER_STAGGER = 36;
const UPLOAD_MS = 720;
const UPLOAD_STAGGER = 18;
const UPLOAD_STAGGER_MAX = 280;
const UPLOAD_VANISH_MS = 260;

const GRANT_TYPES = [
  "Tri-Agency Grant Proposal",
  "KMb Campaign",
  "Educational / Documentary Series",
  "Strategic Consulting",
  "Other",
] as const;

const TIMELINES = [
  "Immediate / Current Grant Cycle",
  "1–3 Months",
  "3–6 Months",
  "Planning Phase",
] as const;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const TIMES = Array.from({ length: 9 }, (_, index) => {
  const hour = 9 + index;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return { hour, label: `${hour12}:00 ${suffix}` };
});

const fieldClass =
  "mt-2 w-full rounded-lg border border-ink/10 bg-canvas px-3 py-2.5 font-normal text-ink outline-none transition duration-300 ease-calm focus:border-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function letterCount(text: string) {
  return text.replace(/\s/g, "").length;
}

function EtherText({ text }: { text: string }) {
  let phase = 0;
  return (
    <>
      {Array.from(text).map((char, index) => {
        if (char === " ") {
          return <span key={index} className="cs-ether-space" />;
        }
        const className =
          phase % 2 === 0 ? "schedule-ether-letter" : "schedule-ether-letter schedule-ether-letter--b";
        const delay = phase * ETHER_STAGGER;
        phase += 1;
        return (
          <span key={index} className={className} style={{ animationDelay: `${delay}ms` }}>
            {char}
          </span>
        );
      })}
    </>
  );
}

function SchedulePicker() {
  const today = useMemo(() => new Date(), []);
  const todayStart = startOfDay(today);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [timesOpen, setTimesOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [confirming, setConfirming] = useState("");
  const [value, setValue] = useState("");

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const count = new Date(viewYear, viewMonth + 1, 0).getDate();
    const next: Array<number | null> = [];
    for (let i = 0; i < first; i += 1) next.push(null);
    for (let day = 1; day <= count; day += 1) next.push(day);
    while (next.length < 42) next.push(null);
    return next;
  }, [viewYear, viewMonth]);

  useEffect(() => {
    if (!open) return undefined;

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setTimesOpen(false);
        setConfirming("");
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setTimesOpen(false);
        setConfirming("");
      }
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function chooseDay(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    if (startOfDay(date) < todayStart) return;
    setPickedDate(date);
    setConfirming("");
    setTimesOpen(true);
  }

  function chooseTime(label: string, hour: number) {
    if (!pickedDate || confirming) return;
    if (startOfDay(pickedDate) === todayStart && hour <= today.getHours()) return;

    const display = `${pickedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} · ${label}`;

    if (prefersReducedMotion()) {
      setValue(display);
      setOpen(false);
      setTimesOpen(false);
      return;
    }

    setConfirming(label);
    window.setTimeout(() => {
      setValue(display);
      setConfirming("");
      setOpen(false);
      setTimesOpen(false);
    }, ETHER_MS + Math.max(0, letterCount(label) - 1) * ETHER_STAGGER);
  }

  return (
    <div className="schedule-picker block text-sm font-medium text-ink" ref={rootRef}>
      Schedule
      <input type="hidden" name="schedule" value={value} />
      <button
        type="button"
        className={`${fieldClass} schedule-trigger`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((current) => !current);
          if (open) {
            setTimesOpen(false);
            setConfirming("");
          }
        }}
      >
        <span className={value ? "text-ink" : "text-ink/45"}>{value || "Select a date"}</span>
        <span aria-hidden="true" className="text-ink/40">
          ▾
        </span>
      </button>
      {open ? (
        <div className="schedule-pop" role="dialog" aria-label="Schedule a call">
          <div className="schedule-cal">
            <div className="schedule-nav">
              <button
                type="button"
                className="schedule-nav-btn"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                ‹
              </button>
              <p className="schedule-month">
                {MONTHS[viewMonth]} {viewYear}
              </p>
              <button
                type="button"
                className="schedule-nav-btn"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                ›
              </button>
            </div>
            <div className="schedule-week">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="schedule-grid">
              {cells.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />;
                const date = new Date(viewYear, viewMonth, day);
                const stamp = startOfDay(date);
                const isPast = stamp < todayStart;
                const isToday = stamp === todayStart;
                const isSelected = Boolean(pickedDate && startOfDay(pickedDate) === stamp);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    className={`schedule-day${isPast ? " is-past" : ""}${isToday ? " is-today" : ""}${
                      isSelected ? " is-selected" : ""
                    }`}
                    onClick={() => chooseDay(day)}
                  >
                    <span className="schedule-day-num">{day}</span>
                    {isToday ? <span className="schedule-day-call">Call today</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={`schedule-times${timesOpen ? " is-open" : ""}`}>
            <div className="schedule-times-head">
              <button
                type="button"
                className="schedule-nav-btn"
                aria-label="Back to calendar"
                onClick={() => {
                  setTimesOpen(false);
                  setConfirming("");
                }}
              >
                ‹
              </button>
              <p className="schedule-month">
                {pickedDate
                  ? pickedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a time"}
              </p>
            </div>
            <div className="schedule-times-list">
              {TIMES.map((slot) => {
                const pastHour =
                  Boolean(pickedDate) && startOfDay(pickedDate as Date) === todayStart && slot.hour <= today.getHours();
                const isConfirming = confirming === slot.label;
                return (
                  <button
                    key={slot.label}
                    type="button"
                    disabled={pastHour || Boolean(confirming && !isConfirming)}
                    className="schedule-time"
                    onClick={() => chooseTime(slot.label, slot.hour)}
                  >
                    {isConfirming ? <EtherText text={slot.label} /> : slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const THANKS_STAGGER = 18;

function ThanksShimmer({ text }: { text: string }) {
  let phase = 0;
  return (
    <>
      {Array.from(text).map((char, index) => {
        if (char === " ") return <span key={index} className="thanks-space" />;
        const cls = phase % 2 === 0 ? "thanks-letter" : "thanks-letter thanks-letter--b";
        const delay = phase * THANKS_STAGGER;
        phase += 1;
        return (
          <span key={index} className={cls} style={{ animationDelay: `${delay}ms` }}>
            {char}
          </span>
        );
      })}
    </>
  );
}

function UploadText({ text }: { text: string }) {
  let phase = 0;
  return (
    <>
      {Array.from(text).map((char, index) => {
        if (char === " ") return <span key={index} className="upload-space" />;
        if (char === "\n") return <br key={index} />;
        const cls = phase % 2 === 0 ? "upload-letter" : "upload-letter upload-letter--b";
        const delay = Math.min(phase * UPLOAD_STAGGER, UPLOAD_STAGGER_MAX);
        phase += 1;
        return (
          <span key={index} className={cls} style={{ animationDelay: `${delay}ms` }}>
            {char}
          </span>
        );
      })}
    </>
  );
}


export function FinalConversionSection() {
  const [phase, setPhase] = useState<"idle" | "uploading" | "vanishing" | "done">("idle");
  const [uploadText, setUploadText] = useState("");

  const isSubmitting = phase === "uploading" || phase === "vanishing";
  const isSuccess = phase === "done";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "idle") return;

    const textarea = event.currentTarget.querySelector("textarea[name=overview]") as HTMLTextAreaElement | null;
    const text = textarea?.value ?? "";

    if (!text.trim()) {
      setUploadText("");
      setPhase("uploading");
      window.setTimeout(() => setPhase("done"), 400);
      return;
    }

    setUploadText(text);
    setPhase("uploading");

    const charCount = text.replace(/\s/g, "").length;
    const waveMs = UPLOAD_MS + Math.min(Math.max(0, charCount - 1) * UPLOAD_STAGGER, UPLOAD_STAGGER_MAX);

    if (prefersReducedMotion()) {
      window.setTimeout(() => setPhase("done"), 200);
      return;
    }

    window.setTimeout(() => {
      setPhase("vanishing");
      window.setTimeout(() => setPhase("done"), UPLOAD_VANISH_MS);
    }, waveMs);
  }

  return (
    <section
      id="contact"
      className="border-t border-ink/10 bg-ink/[0.04] py-16 md:py-24"
      aria-labelledby="conversion-heading"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[0.7rem] font-medium uppercase tracking-wide text-teal">Consultation</p>
        <h2 id="conversion-heading" className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Schedule a free discovery call today
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-ink/80">
          Tell us about your organization, project, and objectives. We'll provide you with a free KMb mind map to get
          the ball rolling.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl px-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="thanks"
              role="status"
              aria-live="polite"
              className="rounded-xl border border-teal/20 bg-canvas px-8 py-12 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: CALM_EASE }}
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-wide text-teal">Received</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                <ThanksShimmer text="Thank you!" /> You'll receive a confirmation email shortly.
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-ink/80">
                In the meantime, check out our blog for more resources, and try our free KMb Mind Map.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <a href="#blog" className="rounded-lg bg-teal px-5 py-2.5 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta">Blog</a>
                <a href="#kmb-mind-map" className="rounded-lg bg-teal px-5 py-2.5 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta">KMb Mind Map</a>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="rounded-xl border border-ink/10 bg-canvas p-6 md:p-8"
              onSubmit={handleSubmit}
              noValidate={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: CALM_EASE }}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block text-sm font-medium text-ink">
                  Name
                  <input
                    className={fieldClass}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Email Address
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Organization / Institution
                  <input
                    className={fieldClass}
                    type="text"
                    name="organization"
                    autoComplete="organization"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Project / Grant Type
                  <select className={fieldClass} name="grantType" defaultValue="">
                    <option value="" disabled>
                      Select a type
                    </option>
                    {GRANT_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-ink">
                  Estimated Timeline
                  <select className={fieldClass} name="timeline" defaultValue="">
                    <option value="" disabled>
                      Select a timeline
                    </option>
                    {TIMELINES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <SchedulePicker />
                <label className="block text-sm font-medium text-ink md:col-span-2">
                  Brief Overview
                  <div style={{ position: "relative" }}>
                    <textarea
                      className={`${fieldClass} min-h-[8rem]`}
                      name="overview"
                      rows={5}
                      disabled={isSubmitting}
                      style={isSubmitting ? { color: "transparent", caretColor: "transparent" } : undefined}
                    />
                    {isSubmitting && uploadText ? (
                      <div
                        className={`${fieldClass} min-h-[8rem] upload-overlay${
                          phase === "vanishing" ? " is-vanishing" : ""
                        }`}
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          pointerEvents: "none",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          overflow: "hidden",
                        }}
                      >
                        <UploadText text={uploadText} />
                      </div>
                    ) : null}
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-lg bg-terracotta px-5 py-3 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-wait disabled:opacity-70 md:w-auto"
              >
                {isSubmitting ? "Sending…" : "Schedule a KMb Consultation"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
