(function () {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".hero-video, .mid-banner-video").forEach(function (video) {
    if (reduced) video.pause();
  });

  const banner = document.querySelector(".hero-banner");
  const heading = document.querySelector(".hero-ether");
  if (!heading || reduced) {
    if (banner) banner.classList.add("is-ready");
    return;
  }

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
    Array.from(text).forEach(function (char) {
      const span = document.createElement("span");
      if (char === " ") {
        span.className = "cs-ether-space";
        span.textContent = "\u00a0";
      } else {
        const phase = letterIndex++;
        const delay = groupDelay + (letterIndex - 1) * LETTER_STAGGER_MS;
        span.className = "cs-ether-letter cs-ether-letter--" + (phase % 2 === 0 ? "a" : "b");
        span.style.animationDelay = delay + "ms";
        span.textContent = char;
        headingEnd = Math.max(headingEnd, delay + LETTER_DURATION_MS);
      }
      line.appendChild(span);
    });
  });

  if (!banner) return;

  banner.querySelectorAll(".hero-follow-item").forEach(function (item, index) {
    item.style.animationDelay = headingEnd + DIGEST_MS + index * FOLLOW_STAGGER_MS + "ms";
  });

  requestAnimationFrame(function () {
    banner.classList.add("is-ready");
  });
})();
