(function () {
  const ReactLib = window.React;
  const ReactDOMLib = window.ReactDOM;
  if (!ReactLib || !ReactDOMLib || !document.getElementById("kmb-pillars-root")) return;

  const { createElement: h, useId, useState } = ReactLib;

  const pillarData = [
    {
      id: "strategy-grants",
      title: "KMb Consulting",
      subhead:
        "Supporting mobilization efforts through strategic plans that align research outputs with funding guidelines.",
      tags: ["KMb Planning", "Impact Mapping", "Logic Models", "Theories of Change", "Grant Proposal Support"],
      actionText: "Read Full Methodology",
      sections: [
        {
          heading: "Knowledge Mobilization & Research-to-Impact",
          body: "Knowledge Mobilization (KMb) is the strategic vehicle that moves evidence from research into real-world application. We provide end-to-end consulting, co-production, and strategic design for every phase of your KMb plan.",
        },
        {
          heading: "Theories, Models, & Frameworks",
          body: "As accredited Knowledge Translation Specialists (KTPC), we build structured logic models that translate complex findings into discrete, achievable milestones based on necessity and feasibility.",
        },
        {
          heading: "Consulting & Grant Integration",
          body: "Whether you are drafting a major grant application or designing a multi-year mobilization campaign, we help identify core objectives, frame target audience segments, and conceptualize high-resonance creative outputs that demonstrate clear impact capacity to funders.",
        },
      ],
    },
    {
      id: "media-coproduction",
      title: "Strategic Media Design",
      subhead:
        "Partnering to distill complex knowledge into accessible and resonant vehicles for impact.",
      tags: ["Educational", "Documentary", "PSA", "Interactivity", "Animation", "Graphics", "Web", "Data Visualization"],
      actionText: "Read Full Methodology",
      sections: [
        {
          heading: "Participatory Co-Production",
          body: "We work closely with academic researchers, community leaders, and lived-experience experts to design media with target audiences rather than just for them. This ensures cultural alignment, trust, and high community engagement.",
        },
        {
          heading: "Accessible & Resonant",
          body: "Design that respects cognitive load, holds attention, and resonates with a target audience is proven to improve impact.",
        },
        {
          heading: "Technical Excellence",
          body: "Supported by an in-house team and a network of specialist partners, we deliver broadcasting-standard production values across video, animation, software, and design.",
        },
      ],
    },
    {
      id: "impact-evaluation",
      title: "Impact Evaluation & Narrative Reporting",
      subhead:
        "Tracking reach, capturing qualitative feedback, and demonstrating proof of real-world change for funders.",
      tags: ["Qualitative Reporting", "Reach Analytics", "Funder Reporting", "Proof of Impact"],
      actionText: "Read Full Methodology",
      sections: [
        {
          heading: "The Full Project Lifecycle",
          body: "Knowledge mobilization does not end when media is published. We measure how target audiences consume your outputs and track the behavioral, social, or policy shifts catalyzed by your work.",
        },
        {
          heading: "Qualitative & Narrative Reporting",
          body: "Data analytics tell only part of the story. We pair quantitative reach metrics with qualitative feedback, community testimonies, and narrative storytelling to provide comprehensive reporting for institutional funders.",
        },
        {
          heading: "Proving Real-World Impact",
          body: "High-resonance KMb outputs act as catalysts for change. By contextualizing real-world outcomes back into your grant reporting, we help you demonstrate the ongoing necessity, return on investment, and real-world value of your research.",
        },
      ],
    },
  ];

  function BookGlyph() {
    return       h(
        "svg",
        {
          className: "kmb-book",
          width: "28",
          height: "34",
          viewBox: "0 0 26 34",
          fill: "none",
          "aria-hidden": "true",
        },
        h(
          "g",
          { className: "kmb-book-closed" },
          h("path", { d: "M8 6.2 L11.6 3.6 L24.4 6.4 L21 9 Z", fill: "currentColor", fillOpacity: "0.4" }),
          h("path", { d: "M8 6.2 L4.6 9.4 L4.6 28.2 L8 25.2 Z", fill: "currentColor", fillOpacity: "0.72" }),
          h("path", { d: "M8 6.2 L21 9 L21 28 L8 25.2 Z", fill: "currentColor" }),
          h("path", { d: "M21 9 L24.4 6.4 L24.4 25.4 L21 28 Z", fill: "currentColor", fillOpacity: "0.38" })
        ),
        h(
          "g",
          { className: "kmb-book-ajar" },
          h("path", { d: "M8 6.2 L11.6 3.6 L24.4 6.4 L21 9 Z", fill: "currentColor", fillOpacity: "0.35" }),
          h("path", { d: "M8 6.2 L4.6 9.4 L4.6 28.2 L8 25.2 Z", fill: "currentColor", fillOpacity: "0.72" }),
          h("path", { d: "M8 6.4 L14.4 8.4 L14.4 26.8 L8 25.2 Z", fill: "currentColor", fillOpacity: "0.2" }),
          h("path", { d: "M10.2 6.8 L23.6 8.6 L23.6 27.4 L10.2 25.6 Z", fill: "currentColor" }),
          h("path", { d: "M21 9.2 L24.8 7 L24.8 25.8 L21 27.6 Z", fill: "currentColor", fillOpacity: "0.28" })
        ),
        h(
          "g",
          { className: "kmb-book-open" },
          h("path", { d: "M1.6 14.6 L13 11.2 L13 26.4 L1.6 24.8 Z", fill: "currentColor" }),
          h("path", { d: "M13 11.2 L24.4 14.6 L24.4 24.8 L13 26.4 Z", fill: "currentColor" }),
          h("path", { d: "M3.4 15 L13 12.6 L13 25.4 L3.4 24.2 Z", fill: "currentColor", fillOpacity: "0.22" }),
          h("path", { d: "M13 12.6 L22.6 15 L22.6 24.2 L13 25.4 Z", fill: "currentColor", fillOpacity: "0.22" }),
          h("path", { d: "M13 12.6 V25.4", stroke: "currentColor", strokeWidth: "1.15", strokeLinecap: "round" })
        )
      )
  }

  function PillarCard({ pillar }) {
    const [isOpen, setIsOpen] = useState(false);
    const reactId = useId();
    const drawerId = "pillar-drawer-" + pillar.id + "-" + reactId;
    const headingId = "pillar-title-" + pillar.id + "-" + reactId;

    return h(
      "article",
      { className: "flex flex-col bg-canvas px-4 py-4 md:px-5 md:py-5" },
      h(
        "h3",
        {
          id: headingId,
          className: "text-base font-semibold leading-snug tracking-tight text-ink md:text-lg",
        },
        pillar.title
      ),
      h("p", { className: "mt-1.5 text-xs font-light leading-relaxed text-ink/80" }, pillar.subhead),
      h(
        "ul",
        { className: "mt-2.5 flex flex-wrap items-center gap-[0.3rem]", "aria-label": pillar.title + " topics" },
        pillar.tags
          .map(function (tag) {
            return h(
              "li",
              { key: tag },
              h(
                "button",
                {
                  type: "button",
                  className:
                    "rounded-[0.45rem] border px-[0.45rem] py-[0.15rem] text-[0.72rem] font-medium uppercase tracking-wide transition duration-300 ease-calm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta " +
                    (isOpen
                      ? "border-terracotta bg-terracotta text-canvas"
                      : "border-teal/20 bg-transparent text-teal hover:border-terracotta hover:bg-terracotta hover:text-canvas"),
                  "aria-expanded": isOpen,
                  "aria-controls": drawerId,
                  onClick: function () {
                    setIsOpen(function (open) {
                      return !open;
                    });
                  },
                },
                tag
              )
            );
          })
          .concat(
            h(
              "li",
              { key: "read-more", className: "ml-0.5" },
              h(
                "button",
                {
                  type: "button",
                  className:
                    "kmb-toggle flex items-center rounded-lg p-0.5 text-terracotta transition duration-300 ease-calm hover:text-terracotta/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                  "aria-expanded": isOpen,
                  "aria-controls": drawerId,
                  "aria-label": isOpen ? "Hide details for " + pillar.title : "Read more about " + pillar.title,
                  onClick: function () {
                    setIsOpen(function (open) {
                      return !open;
                    });
                  },
                },
                h(BookGlyph)
              )
            )
          )
      ),
      h(
        "div",
        Object.assign(
          {
            id: drawerId,
            role: "region",
            "aria-labelledby": headingId,
            "aria-hidden": !isOpen,
            className: "kmb-drawer" + (isOpen ? " is-open" : ""),
          },
          isOpen ? {} : { inert: "" }
        ),
        h(
          "div",
          { className: "kmb-drawer-inner" },
          h(
            "div",
            { className: "kmb-drawer-content mt-3 space-y-3 border-t border-ink/10 pt-3" },
            pillar.sections.map(function (section) {
              return h(
                "section",
                { key: section.heading },
                h(
                  "h4",
                  { className: "text-[0.65rem] font-medium uppercase tracking-wide text-teal" },
                  section.heading
                ),
                h("p", { className: "mt-1 text-xs font-light leading-relaxed text-ink/80" }, section.body)
              );
            })
          )
        )
      )
    );
  }

  function KMbPillarsSection({ pillars }) {
    const data = pillars || pillarData;
    return h(
      "section",
      {
        id: "pillars",
        className: "bg-transparent pb-16 pt-2 md:pb-20",
        "aria-labelledby": "pillars-kicker",
      },
      h(
        "div",
        { className: "mx-auto max-w-6xl px-6" },
        h(
          "p",
          {
            id: "pillars-kicker",
            className: "text-[0.7rem] font-medium uppercase tracking-wide text-canvas/60",
          },
          "Service Pillars"
        ),
        h(
          "div",
          {
            className:
              "mt-4 grid grid-cols-1 divide-y divide-ink/10 overflow-hidden rounded-xl border border-canvas/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0",
          },
          data.map(function (pillar) {
            return h(PillarCard, { key: pillar.id, pillar: pillar });
          })
        )
      )
    );
  }

  window.KMbPillarsSection = KMbPillarsSection;
  window.pillarData = pillarData;

  ReactDOMLib.createRoot(document.getElementById("kmb-pillars-root")).render(
    h(KMbPillarsSection, { pillars: pillarData })
  );
})();
