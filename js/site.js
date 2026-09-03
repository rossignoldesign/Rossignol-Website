(function () {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".hero-video, .mid-banner-video").forEach(function (video) {
    if (reduced) video.pause();
  });

  const banner = document.querySelector(".hero-banner");
  const heading = document.querySelector(".hero-ether");

  function fitHeroEther() {
    if (!heading) return;
    const column = heading.closest(".hero-copy") || heading;
    const target = column.clientWidth;
    if (target < 80) return;
    heading.style.width = "max-content";
    heading.style.fontSize = "40px";
    const natural = heading.scrollWidth;
    if (!natural) {
      heading.style.width = "";
      return;
    }
    heading.style.fontSize = (40 * target) / natural + "px";
    const corrected = heading.scrollWidth;
    if (corrected) {
      heading.style.fontSize = parseFloat(heading.style.fontSize) * (target / corrected) + "px";
    }
    heading.style.width = "";
  }

  if (!heading) {
    if (banner) banner.classList.add("is-ready");
    return;
  }

  if (!reduced) {
    const LETTER_STAGGER_MS = 36;
    const GROUP_GAP_MS = 1000;
    const LETTER_DURATION_MS = 1450;
    const DIGEST_MS = 360;
    const FOLLOW_STAGGER_MS = 520;

    let headingEnd = 0;

    heading.querySelectorAll("[data-ether-group]").forEach(function (line) {
      const group = Number(line.getAttribute("data-ether-group") || 0);
      const groupDelay = group * GROUP_GAP_MS;
      const text = line.textContent || "";
      line.setAttribute("aria-hidden", "true");
      line.textContent = "";
      let letterIndex = 0;
      text.split(/(\s+)/).forEach(function (token) {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          const space = document.createElement("span");
          space.className = "cs-ether-space";
          space.textContent = "\u00a0";
          line.appendChild(space);
          return;
        }
        const word = document.createElement("span");
        word.className = "cs-ether-word";
        Array.from(token).forEach(function (char) {
          const span = document.createElement("span");
          const phase = letterIndex++;
          const delay = groupDelay + (letterIndex - 1) * LETTER_STAGGER_MS;
          span.className = "cs-ether-letter cs-ether-letter--" + (phase % 2 === 0 ? "a" : "b");
          span.style.animationDelay = delay + "ms";
          span.textContent = char;
          headingEnd = Math.max(headingEnd, delay + LETTER_DURATION_MS);
          word.appendChild(span);
        });
        line.appendChild(word);
      });
    });

    if (banner) {
      banner.querySelectorAll(".hero-follow-item").forEach(function (item, index) {
        item.style.animationDelay = headingEnd + DIGEST_MS + index * FOLLOW_STAGGER_MS + "ms";
      });
      requestAnimationFrame(function () {
        banner.classList.add("is-ready");
      });
    }
  } else if (banner) {
    banner.classList.add("is-ready");
  }

  fitHeroEther();
  window.addEventListener("resize", fitHeroEther);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeroEther);
  }
})();
