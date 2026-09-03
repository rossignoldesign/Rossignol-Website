(function () {
  const ReactLib = window.React;
  const ReactDOMLib = window.ReactDOM;
  const mount = document.getElementById("conversion-root");
  if (!ReactLib || !ReactDOMLib || !mount) return;

  const { createElement: h, useState, useRef, useEffect, useMemo } = ReactLib;

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
  ];

  const TIMELINES = [
    "Immediate / Current Grant Cycle",
    "1–3 Months",
    "3–6 Months",
    "Planning Phase",
  ];

  const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
  ];

  const TIMES = [];
  for (let hour = 9; hour <= 17; hour += 1) {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = hour < 12 ? "AM" : "PM";
    TIMES.push({ hour: hour, label: hour12 + ":00 " + suffix });
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-ink/10 bg-canvas px-3 py-2.5 font-normal text-ink outline-none transition duration-300 ease-calm focus:border-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function letterCount(text) {
    return text.replace(/\s/g, "").length;
  }

  function EtherText(props) {
    const text = props.text;
    let phase = 0;
    return text.split("").map(function (char, index) {
      if (char === " ") {
        return h("span", { key: index, className: "cs-ether-space" });
      }
      const className =
        phase % 2 === 0 ? "schedule-ether-letter" : "schedule-ether-letter schedule-ether-letter--b";
      const delay = phase * ETHER_STAGGER;
      phase += 1;
      return h(
        "span",
        { key: index, className: className, style: { animationDelay: delay + "ms" } },
        char
      );
    });
  }

  function SchedulePicker() {
    const today = useMemo(function () {
      return new Date();
    }, []);
    const todayStart = startOfDay(today);
    const rootRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [timesOpen, setTimesOpen] = useState(false);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [pickedDate, setPickedDate] = useState(null);
    const [confirming, setConfirming] = useState("");
    const [value, setValue] = useState("");

    const cells = useMemo(
      function () {
        const first = new Date(viewYear, viewMonth, 1).getDay();
        const count = new Date(viewYear, viewMonth + 1, 0).getDate();
        const next = [];
        for (let i = 0; i < first; i += 1) next.push(null);
        for (let day = 1; day <= count; day += 1) next.push(day);
        while (next.length < 42) next.push(null);
        return next;
      },
      [viewYear, viewMonth]
    );

    useEffect(
      function () {
        if (!open) return undefined;

        function onPointer(event) {
          if (!rootRef.current || rootRef.current.contains(event.target)) return;
          setOpen(false);
          setTimesOpen(false);
          setConfirming("");
        }

        function onKey(event) {
          if (event.key === "Escape") {
            setOpen(false);
            setTimesOpen(false);
            setConfirming("");
          }
        }

        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return function () {
          document.removeEventListener("mousedown", onPointer);
          document.removeEventListener("keydown", onKey);
        };
      },
      [open]
    );

    function shiftMonth(delta) {
      const next = new Date(viewYear, viewMonth + delta, 1);
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth());
    }

    function chooseDay(day) {
      const date = new Date(viewYear, viewMonth, day);
      if (startOfDay(date) < todayStart) return;
      setPickedDate(date);
      setConfirming("");
      setTimesOpen(true);
    }

    function chooseTime(label, hour) {
      if (!pickedDate || confirming) return;
      if (startOfDay(pickedDate) === todayStart && hour <= today.getHours()) return;

      const display =
        pickedDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
        " · " +
        label;

      if (prefersReducedMotion()) {
        setValue(display);
        setOpen(false);
        setTimesOpen(false);
        return;
      }

      setConfirming(label);
      window.setTimeout(function () {
        setValue(display);
        setConfirming("");
        setOpen(false);
        setTimesOpen(false);
      }, ETHER_MS + Math.max(0, letterCount(label) - 1) * ETHER_STAGGER);
    }

    return h(
      "div",
      { className: "schedule-picker block text-sm font-medium text-ink", ref: rootRef },
      "Schedule",
      h("input", { type: "hidden", name: "schedule", value: value }),
      h(
        "button",
        {
          type: "button",
          className: fieldClass + " schedule-trigger",
          "aria-expanded": open,
          "aria-haspopup": "dialog",
          onClick: function () {
            setOpen(!open);
            if (open) {
              setTimesOpen(false);
              setConfirming("");
            }
          },
        },
        h("span", { className: value ? "text-ink" : "text-ink/45" }, value || "Select a date"),
        h("span", { "aria-hidden": "true", className: "text-ink/40" }, "▾")
      ),
      open
        ? h(
            "div",
            { className: "schedule-pop", role: "dialog", "aria-label": "Schedule a call" },
            h(
              "div",
              { className: "schedule-cal" },
              h(
                "div",
                { className: "schedule-nav" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "schedule-nav-btn",
                    "aria-label": "Previous month",
                    onClick: function () {
                      shiftMonth(-1);
                    },
                  },
                  "‹"
                ),
                h("p", { className: "schedule-month" }, MONTHS[viewMonth] + " " + viewYear),
                h(
                  "button",
                  {
                    type: "button",
                    className: "schedule-nav-btn",
                    "aria-label": "Next month",
                    onClick: function () {
                      shiftMonth(1);
                    },
                  },
                  "›"
                )
              ),
              h(
                "div",
                { className: "schedule-week" },
                WEEKDAYS.map(function (day) {
                  return h("span", { key: day }, day);
                })
              ),
              h(
                "div",
                { className: "schedule-grid" },
                cells.map(function (day, index) {
                  if (!day) return h("span", { key: "empty-" + index });
                  const date = new Date(viewYear, viewMonth, day);
                  const stamp = startOfDay(date);
                  const isPast = stamp < todayStart;
                  const isToday = stamp === todayStart;
                  const isSelected = Boolean(pickedDate && startOfDay(pickedDate) === stamp);
                  return h(
                    "button",
                    {
                      key: day,
                      type: "button",
                      disabled: isPast,
                      className:
                        "schedule-day" +
                        (isPast ? " is-past" : "") +
                        (isToday ? " is-today" : "") +
                        (isSelected ? " is-selected" : ""),
                      onClick: function () {
                        chooseDay(day);
                      },
                    },
                    h("span", { className: "schedule-day-num" }, String(day)),
                    isToday ? h("span", { className: "schedule-day-call" }, "Call today") : null
                  );
                })
              )
            ),
            h(
              "div",
              { className: "schedule-times" + (timesOpen ? " is-open" : "") },
              h(
                "div",
                { className: "schedule-times-head" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "schedule-nav-btn",
                    "aria-label": "Back to calendar",
                    onClick: function () {
                      setTimesOpen(false);
                      setConfirming("");
                    },
                  },
                  "‹"
                ),
                h(
                  "p",
                  { className: "schedule-month" },
                  pickedDate
                    ? pickedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a time"
                )
              ),
              h(
                "div",
                { className: "schedule-times-list" },
                TIMES.map(function (slot) {
                  const pastHour =
                    Boolean(pickedDate) &&
                    startOfDay(pickedDate) === todayStart &&
                    slot.hour <= today.getHours();
                  const isConfirming = confirming === slot.label;
                  return h(
                    "button",
                    {
                      key: slot.label,
                      type: "button",
                      disabled: pastHour || Boolean(confirming && !isConfirming),
                      className: "schedule-time",
                      onClick: function () {
                        chooseTime(slot.label, slot.hour);
                      },
                    },
                    isConfirming ? h(EtherText, { text: slot.label }) : slot.label
                  );
                })
              )
            )
          )
        : null
    );
  }

  const THANKS_STAGGER = 18;

  function ThanksShimmer(props) {
    var text = props.text;
    var phase = 0;
    return text.split("").map(function (char, index) {
      if (char === " ") {
        return h("span", { key: index, className: "thanks-space" });
      }
      var cls = phase % 2 === 0 ? "thanks-letter" : "thanks-letter thanks-letter--b";
      var delay = phase * THANKS_STAGGER;
      phase += 1;
      return h("span", { key: index, className: cls, style: { animationDelay: delay + "ms" } }, char);
    });
  }

  function UploadText(props) {
    var text = props.text;
    var phase = 0;
    return text.split("").map(function (char, index) {
      if (char === " ") {
        return h("span", { key: index, className: "upload-space" });
      }
      if (char === "\n") {
        return h("br", { key: index });
      }
      var cls = phase % 2 === 0 ? "upload-letter" : "upload-letter upload-letter--b";
      var delay = Math.min(phase * UPLOAD_STAGGER, UPLOAD_STAGGER_MAX);
      phase += 1;
      return h("span", { key: index, className: cls, style: { animationDelay: delay + "ms" } }, char);
    });
  }

  function collectFormText(form) {
    var parts = [];
    var els = form.elements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.tagName === "BUTTON") continue;
      if (el.type === "hidden") continue;
      var val = el.value || "";
      if (val && val !== "" && !el.disabled) {
        parts.push(val);
      }
    }
    return parts.join("  ·  ");
  }

  function FinalConversionSection() {
    var _s = useState("idle");
    var phase = _s[0];
    var setPhase = _s[1];
    var _u = useState("");
    var uploadText = _u[0];
    var setUploadText = _u[1];

    var isSubmitting = phase === "uploading" || phase === "vanishing";
    var isSuccess = phase === "done";

    function handleSubmit(event) {
      event.preventDefault();
      if (phase !== "idle") return;

      var textarea = event.target.querySelector("textarea[name=overview]");
      var text = textarea ? textarea.value : "";
      if (!text.trim()) {
        setUploadText("");
        setPhase("uploading");
        window.setTimeout(function () { setPhase("done"); }, 400);
        return;
      }

      setUploadText(text);
      setPhase("uploading");

      var charCount = text.replace(/\s/g, "").length;
      var waveMs = UPLOAD_MS + Math.min(Math.max(0, charCount - 1) * UPLOAD_STAGGER, UPLOAD_STAGGER_MAX);

      if (prefersReducedMotion()) {
        window.setTimeout(function () { setPhase("done"); }, 200);
        return;
      }

      window.setTimeout(function () {
        setPhase("vanishing");
        window.setTimeout(function () {
          setPhase("done");
        }, UPLOAD_VANISH_MS);
      }, waveMs);
    }

    return h(
      "section",
      {
        id: "contact",
        className: "border-t border-ink/10 bg-ink/[0.04] py-16 md:py-24",
        "aria-labelledby": "conversion-heading",
      },
      h(
        "div",
        { className: "mx-auto max-w-3xl px-6 text-center" },
        h("p", { className: "text-[0.7rem] font-medium uppercase tracking-wide text-teal" }, "Consultation"),
        h(
          "h2",
          { id: "conversion-heading", className: "mt-3 text-4xl font-semibold tracking-tight md:text-5xl" },
          "Schedule a free discovery call today"
        ),
        h(
          "p",
          { className: "mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-ink/80" },
          "Tell us about your organization, project, and objectives. We'll provide you with a free KMb mind map to get the ball rolling."
        )
      ),
      h(
        "div",
        { className: "mx-auto mt-12 max-w-3xl px-6" },
        isSuccess
          ? h(
              "div",
              {
                role: "status",
                "aria-live": "polite",
                className: "rounded-xl border border-teal/20 bg-canvas px-8 py-12 text-center",
              },
              h("p", { className: "text-[0.7rem] font-medium uppercase tracking-wide text-teal" }, "Received"),
              h(
                "p",
                { className: "mt-3 text-2xl font-semibold tracking-tight text-ink" },
                h(ThanksShimmer, { text: "Thank you!" }),
                " You'll receive a confirmation email shortly."
              ),
              h(
                "p",
                { className: "mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-ink/80" },
                "In the meantime, check out our blog for more resources, and try our free KMb Mind Map."
              ),
              h(
                "div",
                { className: "mt-6 flex items-center justify-center gap-4" },
                h("a", { href: "#blog", className: "rounded-lg bg-teal px-5 py-2.5 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta" }, "Blog"),
                h("a", { href: "#kmb-mind-map", className: "rounded-lg bg-teal px-5 py-2.5 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta" }, "KMb Mind Map")
              )
            )
          : h(
              "form",
              {
                className: "rounded-xl border border-ink/10 bg-canvas p-6 md:p-8",
                onSubmit: handleSubmit,
              },
              h(
                "div",
                { className: "grid grid-cols-1 gap-5 md:grid-cols-2" },
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink" },
                  "Name",
                  h("input", {
                    className: fieldClass,
                    type: "text",
                    name: "name",
                    autoComplete: "name",
                    required: true,
                  })
                ),
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink" },
                  "Email Address",
                  h("input", {
                    className: fieldClass,
                    type: "email",
                    name: "email",
                    autoComplete: "email",
                    required: true,
                  })
                ),
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink" },
                  "Organization / Institution",
                  h("input", {
                    className: fieldClass,
                    type: "text",
                    name: "organization",
                    autoComplete: "organization",
                    required: true,
                  })
                ),
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink" },
                  "Project / Grant Type",
                  h(
                    "select",
                    { className: fieldClass, name: "grantType", defaultValue: "" },
                    h("option", { value: "", disabled: true }, "Select a type"),
                    GRANT_TYPES.map(function (option) {
                      return h("option", { key: option, value: option }, option);
                    })
                  )
                ),
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink" },
                  "Estimated Timeline",
                  h(
                    "select",
                    { className: fieldClass, name: "timeline", defaultValue: "" },
                    h("option", { value: "", disabled: true }, "Select a timeline"),
                    TIMELINES.map(function (option) {
                      return h("option", { key: option, value: option }, option);
                    })
                  )
                ),
                h(SchedulePicker),
                h(
                  "label",
                  { className: "block text-sm font-medium text-ink md:col-span-2" },
                  "Brief Overview",
                  h(
                    "div",
                    { className: "upload-textarea-wrap", style: { position: "relative" } },
                    h("textarea", {
                      className: fieldClass + " min-h-[8rem]",
                      name: "overview",
                      rows: 5,
                      disabled: isSubmitting,
                      style: isSubmitting ? { color: "transparent", caretColor: "transparent" } : undefined,
                    }),
                    isSubmitting && uploadText
                      ? h(
                          "div",
                          {
                            className:
                              fieldClass +
                              " min-h-[8rem] upload-overlay" +
                              (phase === "vanishing" ? " is-vanishing" : ""),
                            "aria-hidden": "true",
                            style: {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              pointerEvents: "none",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflow: "hidden",
                            },
                          },
                          h(UploadText, { text: uploadText })
                        )
                      : null
                  )
                )
              ),
              h(
                "button",
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className:
                    "mt-6 w-full rounded-lg bg-terracotta px-5 py-3 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-wait disabled:opacity-70 md:w-auto",
                },
                isSubmitting ? "Sending…" : "Schedule a KMb Consultation"
              )
            )
      )
    );
  }

  window.FinalConversionSection = FinalConversionSection;
  ReactDOMLib.createRoot(mount).render(h(FinalConversionSection));
})();
