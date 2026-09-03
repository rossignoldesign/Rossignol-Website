(function () {
  const ReactLib = window.React;
  const ReactDOMLib = window.ReactDOM;
  if (!ReactLib || !ReactDOMLib || !document.getElementById("case-studies-root")) return;

  const { createElement: h, useEffect, useId, useRef, useState } = ReactLib;

  const caseStudiesData = [
    {
      id: "educational-kt",
      title: "Educational Content",
      tagline:
        "Distilling complex knowledge into accessible forms that respect cognitive load, improve effective uptake, and drive impact. Direct to camera host engagement, simple language, and digestible graphics.",
      videos: [
        {
          id: "mint-elsie-mcgill",
          title: "Royal Canadian Mint - Case Study",
          tagline: "Educating wide audiences while raising brand reputation",
          clientType: "Crown Corporation & Public Institution",
          summary:
            "Developed in partnership with CBC, this national campaign translated the historical legacy of pioneering aeronautical engineer Elsie MacGill into an interactive, fully bilingual media experience. By pairing custom animation with editorial storytelling hosted by opinion leader Liz Plank, the initiative elevated public awareness of Canadian STEM innovation while reinforcing the Mint’s role as a steward of national history and progressive values.",
          points: [
            {
              heading: "Experimental Multi-Format Translation",
              body: "Combined custom visual animation, interactive digital timelines, and an engaging host-driven narrative to distill dense historical archives into high-uptake public content.",
            },
            {
              heading: "Bilingual Accessibility & Ecosystem Distribution",
              body: "Fully produced in both English and French to maximize equitable nationwide reach, supported by a programmatic ad suite driving direct traffic to a custom CBC web integration.",
            },
            {
              heading: "Institutional Reputation & Equity Alignment",
              body: "Strengthened public trust and institutional brand equity by linking a commemorative currency launch to larger societal conversations around gender equity, STEM representation, and civic leadership.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1222393877?share=copy&fl=sv&fe=ci",
          thumbnailUrl: "public/work/elsie-macgill-poster.png",
          webIntegrationUrl: "public/integrations/elsie-macgill/index.html",
        },
        {
          id: "cbc-why-buy",
          title: "CBC: Why Buy? - Partnership Campaign",
          tagline: "Fostering partnerships through proof of impact",
          clientType: "National Broadcaster & Media Institution",
          summary:
            "Commissioned by CBC senior leadership, this high-impact B2B communication strategy was designed to articulate the unique value proposition of CBC’s internal creative agency and drive revenue-critical brand partnerships. Shot across iconic sets at CBC’s Toronto headquarters—including The National, Dragons’ Den, and the deep archives—the video distilled complex media offerings into a resonant narrative for enterprise decision-makers.",
          points: [
            {
              heading: "Executive B2B Narrative Distillation",
              body: "Reframed intricate commercial partnership products and media inventory into an accessible, benefits-driven strategy that speaks directly to corporate buyers.",
            },
            {
              heading: "Institutional Authority & Production Scale",
              body: "Leveraged iconic flagship sets and archival assets to showcase CBC’s visual scale, creative excellence, and deep cultural footprint.",
            },
            {
              heading: "High-Stakes Stakeholder Mobilization",
              body: "Aligned internal agency capabilities with revenue-critical sales goals, translating complex institutional offerings into an engaging narrative that builds long-term commercial trust.",
            },
          ],
          vimeoUrl: "https://vimeo.com/961653242",
        },
        {
          id: "flash-forest",
          title: "Flash Forest - Capital Raising Campaign",
          tagline: "Distilling complex problems into actionable solutions",
          clientType: "ClimateTech & Hardware Startup",
          summary:
            "Serving as the centerpiece video for Flash Forest’s launch campaign, this initiative distilled complex autonomous drone technology into an urgent, human-centered narrative addressing global biodiversity loss. By translating high-tech ecological engineering into a clear mission to plant two billion trees, the content went viral globally, far surpassing initial fundraising goals and positioning the startup for rapid international scaling.",
          points: [
            {
              heading: "Translating Technical Innovation",
              body: "Distilled complex autonomous hardware and ecological science into an accessible, high-resonance story that clearly articulated the technology's real-world environmental impact.",
            },
            {
              heading: "Multi-Platform Virality & Global Reach",
              body: "Sparked widespread earned media coverage across international news outlets, turning a technical product launch into a globally trending environmental movement.",
            },
            {
              heading: "Capital Mobilization & Institutional Impact",
              body: "Exceeded the initial $100,000 fundraising target to help unlock millions in follow-on venture capital, leading to international recognition including the GovTech Award for Climate Change at the World Government Summit.",
            },
          ],
          vimeoUrl: "https://vimeo.com/368216143",
        },
      ],
    },
    {
      id: "documentaries",
      title: "Documentaries",
      tagline:
        "Measuring and facilitating impact through high-resonance storytelling, documentaries elevate the voices of champions, thought leaders, and knowledge keepers. Using semi-structured interviews, cinematic b-roll, and real moments that convey authenticity and build trust.",
      videos: [
        {
          id: "tourism-australia",
          title: "Tourism Australia - Case Study",
          tagline: "Experiential learning promotes cultural exchange & mutual understanding",
          clientType: "Government Agency & Institutional Broadcaster Partnership",
          summary:
            "Produced in partnership with CBC, this campaign translated nature, culinary, and Indigenous cultural narratives into an immersive three-part docuseries streamable on CBC Gem. By leveraging influencer-led experiential storytelling, the project balanced international tourism promotion while adhering to journalistic standards at the level people expect from CBC—creating a high-uptake content package that was renewed for a second season.",
          points: [
            {
              heading: "Ethical Co-Production & Cultural Alignment",
              body: "Navigated extensive consultation frameworks to respectfully feature sensitive Indigenous cultural traditions, ensuring authentic community representation while preserving editorial integrity.",
            },
            {
              heading: "Innovative Ecosystem & Streaming Firsts",
              body: "Built a landmark branded-content model for CBC Gem—combining three 10-minute mini-documentaries with a custom web integration, YouTube placement, and targeted programmatic ad suites.",
            },
            {
              heading: "Institutional Integrity & Sustained Reach",
              body: "Harmonized government promotional goals with authentic documentary storytelling, building audience trust and measurable impact on intent to travel that secured an immediate multi-season reboot.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1222392988?fl=pl&fe=sh",
          thumbnailUrl: "public/work/come-and-say-gday-poster.jpg",
          webIntegrationUrl: "public/integrations/come-and-say-gday/index.html",
          fullEpisodeUrl: "https://www.youtube.com/watch?v=s6C5CJmY71s",
        },
        {
          id: "desjardins-jack-saddleback",
          title: "Desjardins: Jack Saddleback",
          tagline: "Storytelling shifts narratives and drives social responsibility",
          clientType: "Financial Institution (B2B Strategy & Brand Reputation)",
          summary:
            "Centered on Two-Spirited Indigenous advocate Jack Saddleback, this dual-purpose campaign elevated Desjardins' public brand reputation while driving B2B engagement for their pioneering gender-affirmation insurance product. By translating lived experience into an actionable framework for workplace inclusion, the initiative demonstrated how corporate offerings can empower other businesses to move past seasonal sentiment toward structural, year-round equity.",
          points: [
            {
              heading: "Community-Led Co-Production",
              body: "Developed through deep, iterative consultation where sensitive narratives around trans, non-binary, and Indigenous identities were authentically guided and authored by representative thought leaders from within the community.",
            },
            {
              heading: "Intersectional Policy Shift",
              body: "Reframed corporate inclusion away from temporary campaign tokenism toward sustained, 365-day policy reform—connecting 2SLGBTQ+ workplace safety directly to broader BIPOC intersectional equity.",
            },
            {
              heading: "B2B Sales Integration & Actionable Impact",
              body: "Paired public-facing educational content with Desjardins' first-of-its-kind group insurance offering, providing a clear commercial entry point for Canadian employers looking to adopt gender-affirming benefit coverage.",
            },
          ],
          vimeoUrl: "https://vimeo.com/838543753",
          thumbnailUrl: "public/work/desjardins-jack-saddleback-poster.png",
          webIntegrationUrl: "public/integrations/desjardins-meet-jack/meetchange/meet-jack.html",
        },
        {
          id: "duracell-thetis-fire-chief",
          title: "Duracell: Thetis Is. Fire Chief",
          tagline: "Amplifying the voices of outliers to help shift norms",
          clientType: "Corporate Brand & Non-Profit Partnership",
          summary:
            "Highlighting the unseen contributions of remote volunteer firefighters, this multi-platform campaign centered on female leadership, community resilience, and critical fire safety practices. By pairing high-resonance documentary storytelling with national recognition, the initiative shifted public perception while illustrating the role of reliable technology in life-saving environments.",
          points: [
            {
              heading: "Audience Alignment & Narrative Shift",
              body: "Elevates the story of a rural female Fire Chief to challenge traditional stereotypes, foster public empathy, and amplify civic engagement across remote communities.",
            },
            {
              heading: "Strategic Partner Mobilization",
              body: "Coordinated a national Lifetime Achievement Award between Duracell and the Canadian Volunteer Fire Services Association (CVFSA) to ground brand trust in authentic community impact.",
            },
            {
              heading: "Integrated Multi-Platform Translation",
              body: "Distilled core evidence and safety messaging into a cohesive media ecosystem—combining cinematic documentary film, programmatic digital ads, and custom CBC web feature integration.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1015777206",
          webIntegrationUrl: "public/integrations/duracell-the-fire-chief/the-fire-chief.html",
        },
        {
          id: "bc-games-olympian-interviews",
          title: "BC Games: Olympian Interviews",
          tagline: "Champions bring diverse audiences together and cultural cohesion",
          clientType: "Provincial Crown Corporation",
          summary:
            "Combining semi-structured interviews with Olympic champions and archival footage, this campaign highlighted the BC Games as an inclusive incubator for Canadian athletic talent. By grounding the narrative in Diversity, Equity, and Inclusion (DEI) principles and community-led insights, the initiative demonstrated the games' role in nurturing accessible regional pathways to world-class athletic achievement while driving ticket sales and public engagement.",
          points: [
            {
              heading: "Community-Engaged Knowledge Capture",
              body: "Gathered qualitative insights directly from the community of practice—athletes, coaches, and alumni—translating lived experiences and mentorship histories into public-facing knowledge about regional sport development.",
            },
            {
              heading: "DEI & Accessible Pathway Framing",
              body: "Embedded Diversity, Equity, and Inclusion as core operational philosophies, showcasing how equitable access and diverse representation in grassroots athletics build a resilient, multi-faceted provincial sports culture.",
            },
            {
              heading: "Multi-Purpose Distribution & Commercial Impact",
              body: "Deployed high-resonance video assets across targeted paid advertising campaigns to drive event attendance and ticket sales while establishing high-converting anchor media for the main BC Games digital channels.",
            },
          ],
          vimeoUrl: "https://vimeo.com/677835736",
          thumbnailUrl: "public/work/bc-games-olympian-interviews-poster.png?v=thumb",
        },
      ],
    },
    {
      id: "public-service-campaigns",
      title: "Public Service & Campaign Media",
      tagline:
        "Designed to distill main messages with clever, memorable, and high-impact conceptual design. Engage your audience with industry standard production value and strong calls to action.",
      videos: [
        {
          id: "tourisme-montreal",
          title: "Tourismé Montreal: Stop Scrolling and Start Exploring.",
          tagline: "PSAs can promote social change…",
          clientType: "Non-Profit Destination Marketing Organization",
          summary:
            "Designed to promote Montréal’s vibrant winter culture, this targeted campaign transformed passive social media consumption into real-world cultural participation. Using a self-aware PSA concept alongside motion graphics and screen compositing, the video demonstrated the utility of Tourisme Montréal’s app, encouraging users to step off social channels and explore local night markets, performances, and seasonal events.",
          points: [
            {
              heading: "Behavioral Shift & Meta Narrative Framing",
              body: "Leveraged a self-reflective \"get off your phone\" narrative strategy across social platforms, meeting digital users where they scroll to prompt direct behavioral transition into offline cultural spaces.",
            },
            {
              heading: "Technical Motion & Compositing Integration",
              body: "Used custom graphic animations and mobile UI compositing to seamlessly showcase app features within high-energy promotional scenes, lowering cognitive friction for app adoption.",
            },
            {
              heading: "Targeted Digital Conversion",
              body: "Aligned social ad placement directly with mobile app acquisition channels, optimizing user uptake to drive foot traffic and economic support for local arts and seasonal vendors.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1041048927?fl=pl&fe=sh",
        },
        {
          id: "looking-for-nests",
          title: "Looking for Nests.",
          tagline: "…and bring awareness to critical issues.",
          clientType: "Political Advocacy & Public Interest Campaign",
          summary:
            "Deployed during provincial election cycles, this campaign translated biodiversity statistics and regulatory policy gaps into an emotionally resonant call for environmental protection. By contrasting striking visuals of old-growth logging with sharp satire, the video mobilized public awareness around accelerating habitat loss to drive voter engagement and demand for legislative policy reform.",
          points: [
            {
              heading: "Data Mobilization via Satirical Framing",
              body: "Leveraged satire and striking visual contrast to transform dense endangered species statistics into accessible, memorable content that lowered cognitive friction around ecological policy issues.",
            },
            {
              heading: "Structural Critique & Public Resonance",
              body: "Highlighted the systemic failures of corporate self-regulation in forestry management, reframing complex environmental legislation into an urgent, relatable civic issue.",
            },
            {
              heading: "Civic Activation & Political Action",
              body: "Channeled high-resonance visual storytelling directly into voter mobilization, encouraging public engagement and political alignment with candidates committed to drafting robust environmental protections.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1019966510?share=copy&fl=sv&fe=ci",
          thumbnailUrl: "public/work/looking-for-nests-poster.jpg?v=1019966510",
        },
        {
          id: "changing-places-monkey-business",
          title: "Changing Places: Monkey Business.",
          tagline:
            "AI-generated doesn't have to mean slop. By using real sets and human creative teams, we can get the best of both worlds. In this 15s spot, the target vibe was authentic, surreal, and lighthearted. Downsizing can be stressful, so we needed to respectfully acknowledge that feeling, and guide it towards a wholesome outcome.",
          summary:
            "This production combined physical set design, practical effects, and human-centered AI augmentation to achieve a cohesive and engaging end result. By using physical sets as strict reference frames for compositing, and using real-human voiceover, the campaign translated a high-stress life transition into an authentic, lighthearted, and surreal narrative—avoiding the generic aesthetics common in fully automated AI outputs.",
          points: [
            {
              heading: "Conscientious Tech Integration & Hybrid Production",
              body: "Expanding production utility while preserving visual nuance, distinct brand voice, and emotional authenticity.",
            },
            {
              heading: "Human-Centered Emotional Resonance",
              body: "Our talented voice actor delivered the narrative, ensuring genuine emotional connection on a sensitive topic, where synthetic voice models fail to build real audience trust.",
            },
            {
              heading: "Legacy of Responsible Tech Adaptation",
              body: "Grounded in four decades of guiding clients through emerging media shifts, we applied a disciplined human-in-the-loop framework to ensure new technologies enhance impact without sacrificing trust or original creative intent.",
            },
          ],
          vimeoUrl: "https://vimeo.com/1222406315?share=copy&fl=sv&fe=ci",
        },
        {
          id: "hornby-organic",
          title: "Hornby Organic: Everything you need, nothing you don’t.",
          tagline: "Practical, personal, and wholesome fun builds positive brand associations.",
          clientType: "Socially Conscious Food Brand",
          summary:
            "Leveraging physical comedy and rock-climbing culture, this campaign translated Hornby Organic’s core ethos—\"Everything you need, nothing you don't\"—into a high-resonance visual metaphor. By depicting an over-geared climber paralyzed by unnecessary equipment, the spot satirized over-complication to highlight the benefits of clean, minimal ingredients for active consumers.",
          points: [
            {
              heading: "Metaphorical Narrative Distillation",
              body: "Transformed abstract product messaging into a relatable physical comedy narrative, using visual satire to make clean-ingredient nutrition intuitive and memorable.",
            },
            {
              heading: "Cultural Subculture Alignment",
              body: "Targeted outdoor and endurance communities by authentically poking fun at gear obsession, establishing immediate brand rapport and cultural credibility.",
            },
            {
              heading: "Streamlined Brand Proposition",
              body: "Simplified complex health and nutritional messaging into a single, punchy value proposition that drives product differentiation in a crowded market.",
            },
          ],
          vimeoUrl: "https://vimeo.com/412495196",
        },
      ],
    },
  ];

  function vimeoIdFromUrl(url) {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const id = parts[0] === "video" ? parts[1] : parts[0];
      return id && /^\d+$/.test(id) ? id : null;
    } catch (err) {
      return null;
    }
  }

  function toVimeoEmbedSrc(url) {
    const id = vimeoIdFromUrl(url);
    return id ? "https://player.vimeo.com/video/" + id + "?autoplay=1" : url;
  }

  function toYoutubeEmbedSrc(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      const id =
        host === "youtu.be"
          ? parsed.pathname.split("/").filter(Boolean)[0]
          : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
      return id ? "https://www.youtube.com/embed/" + id + "?rel=0" : url;
    } catch (err) {
      return url;
    }
  }

  function thumbnailFor(video) {
    if (video.thumbnailUrl) return video.thumbnailUrl;
    const id = vimeoIdFromUrl(video.vimeoUrl);
    return id ? "https://vumbnail.com/" + id + ".jpg" : undefined;
  }

  function PlayGlyph() {
    return h(
      "span",
      {
        className:
          "play-btn flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-canvas shadow-sm",
      },
      h(
        "svg",
        { width: "16", height: "18", viewBox: "0 0 16 18", fill: "currentColor", "aria-hidden": "true" },
        h("path", { d: "M3 1.5v15l12-7.5L3 1.5z" })
      )
    );
  }

  var CONNECT_COPY = "Connecting...almost there...";
  var CONNECT_STAGGER_MS = 70;
  var CONNECT_WAVE_MS = 1400;
  var CONNECT_CYCLES = 3;
  var ELSIE_PLANE_SRC = "public/integrations/elsie-macgill/data/airplane.png";
  var ELSIE_VIDEO_ID = "mint-elsie-mcgill";

  function focusWithoutScroll(el) {
    if (el) el.focus({ preventScroll: true });
  }

  function lockPageScroll() {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
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
    body.style.top = "-" + scrollY + "px";
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = scrollbar + "px";

    return function unlock(opener) {
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

  function LightboxCaption({ video, onViewWeb, onViewEpisode }) {
    const hasBrief = Boolean(video.clientType || video.summary || (video.points && video.points.length));
    const buttonClass =
      "inline-flex rounded-lg bg-terracotta px-5 py-3 text-sm font-medium tracking-wide text-canvas transition duration-300 ease-calm hover:bg-terracotta/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas";
    const ctas =
      video.webIntegrationUrl || video.fullEpisodeUrl
        ? h(
            "div",
            { className: "mt-5 flex flex-wrap gap-3" },
            video.webIntegrationUrl && onViewWeb
              ? h(
                  "button",
                  { type: "button", className: buttonClass, onClick: onViewWeb },
                  "View the full web integration"
                )
              : null,
            video.fullEpisodeUrl && onViewEpisode
              ? h(
                  "button",
                  { type: "button", className: buttonClass, onClick: onViewEpisode },
                  "Watch a Full Episode"
                )
              : null
          )
        : null;
    if (!hasBrief && !video.tagline && !video.webIntegrationUrl && !video.fullEpisodeUrl) return null;
    if (!hasBrief) {
      return h(
        "div",
        { className: "border-t border-canvas/10 px-5 py-4" },
        video.tagline
          ? h("p", { className: "text-sm font-light leading-relaxed text-canvas/85" }, video.tagline)
          : null,
        ctas
      );
    }
    return h(
      "div",
      { className: "border-t border-canvas/10 px-5 py-5 text-sm leading-relaxed text-canvas/90" },
      video.clientType
        ? h(
            "p",
            null,
            h("span", { className: "font-medium tracking-wide text-canvas" }, "Client Type: "),
            h("span", { className: "font-light text-canvas/85" }, video.clientType)
          )
        : null,
      video.summary
        ? h(
            "p",
            { className: "font-light text-canvas/85" + (video.clientType ? " mt-4" : "") },
            video.summary
          )
        : null,
      video.points && video.points.length
        ? h(
            "ul",
            { className: "mt-4 list-disc space-y-3 pl-5 marker:text-canvas/45" },
            video.points.map(function (point) {
              return h(
                "li",
                { key: point.heading },
                h("span", { className: "font-semibold text-canvas" }, point.heading + ": "),
                h("span", { className: "font-light text-canvas/85" }, point.body)
              );
            })
          )
        : null,
      ctas
    );
  }

  function VideoLightbox({ video, onClose }) {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const vimeoRef = useRef(null);
    const titleId = useId();
    const [connectOut, setConnectOut] = useState(false);
    const [panel, setPanel] = useState(null);
    const expanded = panel !== null;

    useEffect(
      function () {
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const unlock = lockPageScroll();
        focusWithoutScroll(closeRef.current);

        function onKey(event) {
          if (event.key === "Escape") {
            onClose();
            return;
          }
          if (event.key !== "Tab" || !dialogRef.current) return;
          const focusable = dialogRef.current.querySelectorAll(
            'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            focusWithoutScroll(last);
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            focusWithoutScroll(first);
          }
        }

        document.addEventListener("keydown", onKey);
        return function () {
          document.removeEventListener("keydown", onKey);
          unlock(opener);
        };
      },
      [onClose]
    );

    useEffect(
      function () {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reduced
          ? 1200
          : (CONNECT_COPY.length - 1) * CONNECT_STAGGER_MS + CONNECT_WAVE_MS * CONNECT_CYCLES;
        const timer = window.setTimeout(function () {
          setConnectOut(true);
        }, duration);
        return function () {
          window.clearTimeout(timer);
        };
      },
      []
    );

    function pauseFilm() {
      if (vimeoRef.current && vimeoRef.current.contentWindow) {
        vimeoRef.current.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
      }
    }

    function openWebIntegration() {
      pauseFilm();
      setPanel("web");
    }

    function openFullEpisode() {
      pauseFilm();
      setPanel("episode");
    }

    return h(
      "div",
      {
        className:
          "cs-modal is-open fixed inset-0 z-50 flex items-center justify-center " +
          (expanded ? "p-2 md:p-4" : "p-4 md:p-10"),
      },
      h("button", {
        type: "button",
        className: "absolute inset-0 bg-ink/80",
        "aria-label": "Close video overlay",
        onClick: onClose,
      }),
      h(
        "div",
        {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          className:
            "relative z-10 flex flex-col overflow-hidden rounded-xl border border-canvas/10 bg-teal text-canvas transition-[max-width] duration-300 ease-calm " +
            (expanded
              ? "h-[min(94vh,56rem)] max-h-[94vh] w-full max-w-[min(96vw,80rem)]"
              : "max-h-[min(92vh,56rem)] w-full max-w-4xl overflow-y-auto overflow-x-hidden"),
        },
        h(
          "div",
          { className: "flex shrink-0 items-start justify-between gap-4 border-b border-canvas/10 px-5 py-4" },
          h(
            "h2",
            { id: titleId, className: "text-lg font-semibold tracking-tight" },
            panel === "web"
              ? video.title + " — web integration"
              : panel === "episode"
                ? video.title + " — full episode"
                : video.title
          ),
          h(
            "div",
            { className: "flex shrink-0 items-center gap-2" },
            expanded
              ? h(
                  "button",
                  {
                    type: "button",
                    className:
                      "rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-canvas/80 transition duration-300 ease-calm hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                    onClick: function () {
                      setPanel(null);
                    },
                  },
                  "Back to film"
                )
              : null,
            h(
              "button",
              {
                ref: closeRef,
                type: "button",
                className:
                  "rounded-lg px-3 py-1 text-sm font-medium tracking-wide text-canvas/80 transition duration-300 ease-calm hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                "aria-label": "Close video",
                onClick: onClose,
              },
              "Close"
            )
          )
        ),
        h(
          "div",
          { className: expanded ? "hidden" : "relative aspect-video bg-teal" },
          h("iframe", {
            ref: vimeoRef,
            className: "relative z-0 h-full w-full",
            src: toVimeoEmbedSrc(video.vimeoUrl),
            title: video.title,
            allow: "autoplay; fullscreen; picture-in-picture",
            allowFullScreen: true,
          }),
          h(
            "p",
            {
              className: "cs-connect" + (connectOut ? " is-out" : ""),
              "aria-live": "polite",
              "aria-hidden": connectOut,
            },
            h(
              "span",
              { className: "cs-connect-copy" },
              CONNECT_COPY.split("").map(function (char, index) {
                return h(
                  "span",
                  {
                    key: char + "-" + index,
                    className: "cs-connect-letter",
                    style: { animationDelay: index * CONNECT_STAGGER_MS + "ms" },
                  },
                  char === " " ? "\u00a0" : char
                );
              })
            )
          )
        ),
        panel === "web" && video.webIntegrationUrl
          ? h(
              "div",
              { className: "min-h-0 flex-1 bg-ink" },
              h("iframe", {
                className: "h-full min-h-[28rem] w-full",
                src: video.webIntegrationUrl,
                title: video.title + " web integration",
                referrerPolicy: "no-referrer-when-downgrade",
              })
            )
          : panel === "episode" && video.fullEpisodeUrl
            ? h(
                "div",
                { className: "flex min-h-0 flex-1 items-center justify-center bg-ink p-4 md:p-8" },
                h("iframe", {
                  className: "aspect-video w-full max-w-5xl",
                  src: toYoutubeEmbedSrc(video.fullEpisodeUrl),
                  title: video.title + " full episode",
                  allow: "autoplay; fullscreen; picture-in-picture",
                  allowFullScreen: true,
                })
              )
            : h(LightboxCaption, {
                video: video,
                onViewWeb: openWebIntegration,
                onViewEpisode: openFullEpisode,
              })
      ),
      video.id === ELSIE_VIDEO_ID
        ? h(
            "div",
            { className: "cs-elsie-plane", "aria-hidden": "true" },
            h("img", { src: ELSIE_PLANE_SRC, alt: "" })
          )
        : null
    );
  }

  function CaseStudyCard({ video, onPlay, featured }) {
    const src = thumbnailFor(video);
    return h(
      "article",
      {
        className:
          "cs-card group flex w-[min(78vw,22rem)] shrink-0 flex-col overflow-hidden rounded-xl border border-canvas/10 bg-ink sm:w-[min(62vw,26rem)]" +
          (featured ? " is-featured" : ""),
      },
      h(
        "button",
        {
          type: "button",
          className:
            "relative aspect-video w-full overflow-hidden bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
          onClick: function () {
            onPlay(video);
          },
          "aria-label": "Play " + video.title,
        },
        src
          ? h("img", {
              src: src,
              alt: "",
              className: "h-full w-full object-cover",
            })
          : null,
        h("span", { className: "absolute inset-0 flex items-center justify-center bg-ink/20" }, h(PlayGlyph))
      ),
      h(
        "div",
        { className: "flex flex-1 flex-col bg-teal px-5 py-5 transition duration-300 ease-calm group-hover:bg-terracotta group-focus-within:bg-terracotta" },
        h(
          "h3",
          null,
          h(
            "button",
            {
              type: "button",
              className:
                "text-left text-xl font-semibold leading-snug text-canvas transition duration-300 ease-calm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas",
              onClick: function () {
                onPlay(video);
              },
            },
            video.title
          )
        )
      )
    );
  }

  function CategoryCarousel({ carousel, onPlay }) {
    const railRef = useRef(null);
    const headingId = useId();
    const [featuredIndex, setFeaturedIndex] = useState(0);

    function updateFeatured() {
      const rail = railRef.current;
      if (!rail) return;
      const cards = rail.querySelectorAll(".cs-card");
      if (!cards.length) return;
      const railBox = rail.getBoundingClientRect();
      const center = railBox.left + railBox.width / 2;
      var next = 0;
      var best = Infinity;
      cards.forEach(function (card, index) {
        const box = card.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - center);
        if (distance < best) {
          best = distance;
          next = index;
        }
      });
      setFeaturedIndex(next);
    }

    function centerCard(index, smooth) {
      const rail = railRef.current;
      if (!rail) return;
      const card = rail.querySelectorAll(".cs-card")[index];
      if (!card) return;
      const railBox = rail.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      rail.scrollTo({
        left: rail.scrollLeft + (cardBox.left + cardBox.width / 2) - (railBox.left + railBox.width / 2),
        behavior: smooth ? "smooth" : "auto",
      });
    }

    useEffect(
      function () {
        const rail = railRef.current;
        if (!rail) return;
        const frame = window.requestAnimationFrame(function () {
          centerCard(0, false);
          updateFeatured();
        });
        const later = window.setTimeout(function () {
          centerCard(0, false);
          updateFeatured();
        }, 250);
        rail.addEventListener("scroll", updateFeatured, { passive: true });
        window.addEventListener("resize", updateFeatured);
        return function () {
          window.cancelAnimationFrame(frame);
          window.clearTimeout(later);
          rail.removeEventListener("scroll", updateFeatured);
          window.removeEventListener("resize", updateFeatured);
        };
      },
      [carousel.id]
    );

    function scrollByCard(direction) {
      centerCard(
        Math.min(carousel.videos.length - 1, Math.max(0, featuredIndex + direction)),
        true
      );
    }

    return h(
      "div",
      { className: "space-y-6" },
      h(
        "div",
        { className: "mx-auto flex max-w-6xl items-end justify-between gap-6 px-6" },
        h(
          "div",
          { className: "max-w-3xl" },
          h(
            "h3",
            { id: headingId, className: "text-2xl font-semibold tracking-tight text-canvas md:text-3xl" },
            carousel.title
          ),
          h("p", { className: "mt-2 text-sm font-light leading-relaxed text-canvas/80" }, carousel.tagline)
        ),
        h(
          "div",
          { className: "hidden shrink-0 gap-2 md:flex" },
          h(
            "button",
            {
              type: "button",
              className:
                "rounded-lg border border-canvas/20 px-3 py-2 text-sm font-medium text-canvas transition duration-300 ease-calm hover:border-teal hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
              "aria-label": "Previous videos in " + carousel.title,
              onClick: function () {
                scrollByCard(-1);
              },
            },
            "←"
          ),
          h(
            "button",
            {
              type: "button",
              className:
                "rounded-lg border border-canvas/20 px-3 py-2 text-sm font-medium text-canvas transition duration-300 ease-calm hover:border-terracotta hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
              "aria-label": "Next videos in " + carousel.title,
              onClick: function () {
                scrollByCard(1);
              },
            },
            "→"
          )
        )
      ),
      h(
        "div",
        {
          ref: railRef,
          className:
            "cs-rail flex overflow-x-auto",
          "aria-labelledby": headingId,
        },
        carousel.videos.map(function (video, index) {
          return h(CaseStudyCard, {
            key: video.id,
            video: video,
            featured: index === featuredIndex,
            onPlay: onPlay,
          });
        })
      )
    );
  }

  function EtherChars({ text, play, reduced, delay }) {
    let letterIndex = 0;
    return text.split("").map(function (char, index) {
      const isSpace = char === " ";
      const phase = isSpace ? 0 : letterIndex++;
      const stagger = isSpace ? 0 : (letterIndex - 1) * 36;
      const className = isSpace
        ? "cs-ether-space"
        : "cs-ether-letter cs-ether-letter--" + (phase % 2 === 0 ? "a" : "b");
      return h(
        "span",
        {
          key: index + "-" + char,
          className: reduced ? undefined : className,
          style: reduced
            ? undefined
            : play
              ? { animationDelay: delay + stagger + "ms" }
              : { opacity: 0 },
        },
        isSpace ? "\u00a0" : char
      );
    });
  }

  function EtherHeading({ play, reduced }) {
    const words = ["Distilled", "Accessible", "Resonant"];
    return h(
      "h2",
      {
        id: "case-studies-heading",
        className: "cs-ether mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-canvas md:text-5xl",
        "aria-label": "KMb Media: Distilled, Accessible, Resonant",
      },
      h(
        "span",
        { className: "cs-ether-line", "aria-hidden": "true" },
        h(EtherChars, { text: "KMb Media:", play: play, reduced: reduced, delay: 0 })
      ),
      h(
        "span",
        { className: "cs-ether-line", "aria-hidden": "true" },
        words.map(function (word, index) {
          return h(
            "span",
            { key: word },
            index > 0
              ? h(
                  "span",
                  { className: "cs-ether-pipe" },
                  h(EtherChars, {
                    text: " | ",
                    play: play,
                    reduced: reduced,
                    delay: 1200 + index * 1000,
                  })
                )
              : null,
            h(EtherChars, {
              text: word,
              play: play,
              reduced: reduced,
              delay: 1200 + index * 1000,
            })
          );
        })
      )
    );
  }

  function CaseStudiesSection({ carousels }) {
    const sectionRef = useRef(null);
    const [active, setActive] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [reduced, setReduced] = useState(false);
    const data = carousels || caseStudiesData;

    useEffect(function () {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReduced(prefersReduced);

      let done = false;
      function reveal() {
        if (done) return;
        done = true;
        setRevealed(true);
      }

      if (prefersReduced || location.hash === "#work") {
        reveal();
        return;
      }

      const section = sectionRef.current;
      const intro = (section && section.querySelector(".cs-work-intro")) || section;
      const observer = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) {
            reveal();
            observer.disconnect();
          }
        },
        { threshold: 0.22, rootMargin: "0px 0px -12% 0px" }
      );
      if (intro) observer.observe(intro);

      const timers = [];
      function sectionInView() {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.9 && rect.bottom > 48;
      }

      function afterNavToWork() {
        function tryReveal() {
          if (sectionInView()) reveal();
        }
        tryReveal();
        timers.push(window.setTimeout(tryReveal, 420), window.setTimeout(tryReveal, 900));
      }

      function onActivate(event) {
        const target = event.target;
        if (!target || !target.closest) return;
        if (target.closest('a[href="#work"]')) afterNavToWork();
      }

      function onHash() {
        if (location.hash === "#work") afterNavToWork();
      }

      document.addEventListener("click", onActivate, true);
      window.addEventListener("hashchange", onHash);

      return function () {
        observer.disconnect();
        timers.forEach(function (id) {
          window.clearTimeout(id);
        });
        document.removeEventListener("click", onActivate, true);
        window.removeEventListener("hashchange", onHash);
      };
    }, []);

    return h(
      "section",
      {
        ref: sectionRef,
        id: "work",
        className: "cs-work bg-ink py-16 text-canvas md:py-24" + (revealed ? " is-in" : ""),
        "aria-labelledby": "case-studies-heading",
      },
      h(
        "div",
        { className: "cs-work-intro mx-auto max-w-6xl px-6" },
        h("p", { className: "text-[0.7rem] font-medium uppercase tracking-wide text-canvas/60" }, "Selected Case Studies"),
        h(EtherHeading, { play: revealed, reduced: reduced })
      ),
      h(
        "div",
        { className: "cs-work-body mt-16 space-y-16" },
        data.map(function (carousel) {
          return h(CategoryCarousel, {
            key: carousel.id,
            carousel: carousel,
            onPlay: setActive,
          });
        })
      ),
      active
        ? h(VideoLightbox, {
            video: active,
            onClose: function () {
              setActive(null);
            },
          })
        : null
    );
  }

  window.CaseStudiesSection = CaseStudiesSection;
  window.caseStudiesData = caseStudiesData;

  ReactDOMLib.createRoot(document.getElementById("case-studies-root")).render(
    h(CaseStudiesSection, { carousels: caseStudiesData })
  );
})();
