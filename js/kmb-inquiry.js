(function () {
  var TYPES = [
    { id: "institution", chip: "Institutions", article: "an", singular: "institution", plural: "institutions", row: "Institution" },
    { id: "researcher", chip: "Researchers", article: "a", singular: "researcher", plural: "researchers", row: "Researcher" },
    { id: "nonprofit", chip: "Non Profits", article: "a", singular: "non-profit", plural: "non-profits", row: "Non Profit" },
    { id: "innovator", chip: "Innovators", article: "an", singular: "innovator", plural: "innovators", row: "Innovator" },
    { id: "social-enterprise", chip: "Social Enterprises", article: "a", singular: "social enterprise", plural: "social enterprises", row: "Social Enterprise" },
    { id: "gov-agency", chip: "Gov Agencies", article: "a", singular: "government agency", plural: "government agencies", row: "Gov Agency" },
    { id: "creative-agency", chip: "Creative Agencies", article: "a", singular: "creative agency", plural: "creative agencies", row: "Creative Agency" },
    { id: "other", chip: "Other", article: "an", singular: "organization", plural: "organizations", row: "Other" },
  ];

  var SpeechEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
  var list = document.getElementById("partner-types");
  var root = document.getElementById("kmb-inquiry");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".partner-chip"));
  if (!list || !root || !chips.length) return;

  var item = root.closest(".kmb-inquiry-item");
  var rowBreak = list.querySelector(".kmb-inquiry-break");
  var spark = list.querySelector(".kmb-inquiry-spark");
  var stem = list.querySelector(".kmb-inquiry-stem");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = emptyState();
  var recognition = null;
  var wantListen = false;
  var dictatedBase = "";
  var speakHint = "";
  var sparkTimer = 0;
  var stemTimer = 0;
  var bornTimer = 0;
  var traceTimer = 0;
  var copyTimer = 0;

  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", function () {
      openAs(chip.getAttribute("data-partner"));
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && list.classList.contains("is-inquiring")) scrollOn();
  });
  window.addEventListener("resize", layoutCard);

  function emptyState() {
    return {
      id: makeId(),
      openedAt: new Date().toISOString(),
      source: "hero",
      clickedType: "",
      partnerType: "",
      clickedMismatch: false,
      step: "q1",
      kmbStance: "",
      willingToTell: "",
      problemText: "",
      reachEmail: "",
      sent: false,
      checks: 0,
      parked: false,
    };
  }

  function byId(id) {
    return TYPES.filter(function (type) {
      return type.id === id;
    })[0];
  }

  function makeId() {
    var now = new Date();
    var stamp =
      String(now.getFullYear()).slice(2) +
      pad2(now.getMonth() + 1) +
      pad2(now.getDate());
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "RD-" + stamp + "-";
    for (var i = 0; i < 4; i += 1) out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return out;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatStamp(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function ticketLabel() {
    var when = formatStamp(state.openedAt);
    return when ? state.id + " · " + when : state.id;
  }

  function inquiryUrl() {
    var endpoint = window.ROSSIGNOL_CONSULT_ENDPOINT || "";
    return endpoint.replace(/\/consult\/?$/, "/kmb-inquiry");
  }

  function activeChip() {
    return list.querySelector(".partner-chip.is-active");
  }

  function lastChipInRow(chip) {
    var top = chip.getBoundingClientRect().top;
    var same = chips.filter(function (node) {
      return Math.abs(node.getBoundingClientRect().top - top) < 8;
    });
    return same[same.length - 1] || chip;
  }

  function parkSlot() {
    if (rowBreak) list.appendChild(rowBreak);
    if (item) list.appendChild(item);
  }

  function placeSlot(chip) {
    var last = lastChipInRow(chip);
    var lastLi = last.closest("li");
    if (!lastLi) return;
    lastLi.after(rowBreak, item);
  }

  function openAs(id) {
    var type = byId(id);
    var chip = list.querySelector('.partner-chip[data-partner="' + id + '"]');
    if (!type || type.id === "other" || !chip) return;
    stopSpeak();
    window.clearTimeout(sparkTimer);
    window.clearTimeout(stemTimer);
    window.clearTimeout(bornTimer);
    window.clearTimeout(traceTimer);
    window.clearTimeout(copyTimer);
    var stayingOpen = list.classList.contains("is-open");
    state = emptyState();
    state.clickedType = type.row;
    state.partnerType = type.row;
    state.step = "q1";
    chips.forEach(function (node) {
      var on = node === chip;
      node.classList.toggle("is-active", on);
      node.setAttribute("aria-pressed", on ? "true" : "false");
    });
    placeSlot(chip);
    list.classList.add("is-inquiring");
    list.classList.remove("is-resting");
    list.classList.remove("is-ready");
    if (!stayingOpen) {
      list.classList.remove("is-open");
      list.classList.remove("is-born");
    }
    render();
    layoutCard();
    if (reduced || stayingOpen) {
      list.classList.add("is-open");
      list.classList.add("is-born");
      revealCard();
      layoutCard();
      followStem();
      playTrace("draw");
      revealCopyLater();
      return;
    }
    playSpark(chip);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        list.classList.add("is-open");
        layoutCard();
        followStem();
        window.clearTimeout(bornTimer);
        bornTimer = window.setTimeout(function () {
          list.classList.add("is-born");
          revealCard();
          layoutCard();
          playTrace("draw");
          revealCopyLater();
        }, 460);
      });
    });
  }

  function playSpark(chip) {
    layoutStem(chip, 28);
    if (!spark) return;
    var listBox = list.getBoundingClientRect();
    var chipBox = chip.getBoundingClientRect();
    spark.style.left = chipBox.left + chipBox.width / 2 - listBox.left + "px";
    spark.style.top = chipBox.bottom - listBox.top + "px";
    spark.innerHTML = '<span class="kmb-inquiry-spark-line"></span><span class="kmb-inquiry-spark-bits">01 10 01</span>';
    spark.classList.add("is-on");
    window.clearTimeout(sparkTimer);
    sparkTimer = window.setTimeout(function () {
      spark.classList.remove("is-on");
      spark.innerHTML = "";
    }, 820);
  }

  function revealCard() {
    var card = root.querySelector(".kmb-inquiry-card");
    if (card) card.classList.add("is-born");
  }

  function revealCopy() {
    list.classList.add("is-ready");
    var card = root.querySelector(".kmb-inquiry-card");
    if (card) card.classList.add("is-ready");
    var area = document.getElementById("kmb-inquiry-text");
    if (area && !wantListen) area.focus();
  }

  function revealCopyLater() {
    window.clearTimeout(copyTimer);
    if (reduced) {
      revealCopy();
      return;
    }
    copyTimer = window.setTimeout(revealCopy, 1120);
  }

  function framePath(width, height, radius, startX) {
    var r = Math.min(radius, width / 2, height / 2);
    var x = Math.max(r + 1, Math.min(width - r - 1, startX));
    var right = width - 1;
    var bottom = height - 1;
    return [
      "M", x, 1,
      "L", right - r, 1,
      "A", r, r, 0, 0, 1, right, 1 + r,
      "L", right, bottom - r,
      "A", r, r, 0, 0, 1, right - r, bottom,
      "L", 1 + r, bottom,
      "A", r, r, 0, 0, 1, 1, bottom - r,
      "L", 1, 1 + r,
      "A", r, r, 0, 0, 1, 1 + r, 1,
      "L", x, 1
    ].join(" ");
  }

  function fitTrace(card) {
    var svg = card.querySelector(".kmb-inquiry-trace");
    if (!svg) return null;
    var width = card.offsetWidth;
    var height = card.offsetHeight;
    if (width < 8 || height < 8) return null;
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    var startX = parseFloat(window.getComputedStyle(card).getPropertyValue("--connector-left")) || width / 2;
    var d = framePath(width, height, 12, startX);
    var paths = svg.querySelectorAll("path");
    Array.prototype.forEach.call(paths, function (path) {
      path.setAttribute("d", d);
    });
    var len = Math.round(paths[0].getTotalLength());
    svg.style.setProperty("--trace-len", String(len));
    return svg;
  }

  function playTrace(mode) {
    var card = root.querySelector(".kmb-inquiry-card");
    if (!card) return;
    var svg = fitTrace(card);
    if (!svg || reduced) return;
    svg.classList.remove("is-draw");
    svg.classList.remove("is-retract");
    void svg.getBoundingClientRect();
    svg.classList.add(mode === "retract" ? "is-retract" : "is-draw");
  }

  function followStem() {
    window.clearTimeout(stemTimer);
    var frames = 0;
    function tick() {
      layoutCard();
      frames += 1;
      if (frames < 28) stemTimer = window.setTimeout(tick, 32);
    }
    tick();
  }

  function closeQuiet() {
    stopSpeak();
    window.clearTimeout(sparkTimer);
    window.clearTimeout(stemTimer);
    window.clearTimeout(bornTimer);
    window.clearTimeout(traceTimer);
    window.clearTimeout(copyTimer);
    if (spark) {
      spark.classList.remove("is-on");
      spark.innerHTML = "";
    }
    hideStem();
    state = emptyState();
    chips.forEach(function (chip) {
      chip.classList.remove("is-active");
      chip.setAttribute("aria-pressed", "false");
    });
    var card = root.querySelector(".kmb-inquiry-card");
    if (card) card.classList.remove("is-born");
    list.classList.remove("is-born");
    list.classList.remove("is-open");
    window.setTimeout(function () {
      if (list.classList.contains("is-open")) return;
      list.classList.remove("is-inquiring");
      hideStem();
      root.innerHTML = "";
      parkSlot();
    }, reduced ? 0 : 780);
  }

  function scrollOn() {
    if (state.parked) return;
    parkInquiry();
  }

  function parkInquiry() {
    stopSpeak();
    if (state.step === "thanks" || state.step === "consult" || state.step === "bye") return;
    state.parked = true;
    var survey = root.querySelector(".kmb-inquiry-survey");
    if (survey && !reduced) survey.classList.add("is-putting-down");
    render(true);
  }

  function resumeInquiry() {
    if (!state.parked) return;
    state.parked = false;
    render(true);
    var area = document.getElementById("kmb-inquiry-text");
    if (area && state.step === "tell") area.focus();
  }

  function shouldSavePartial() {
    return !state.sent && (state.kmbStance || state.willingToTell || state.clickedMismatch);
  }

  function typeFromRow(row) {
    return (
      TYPES.filter(function (type) {
        return type.row === row;
      })[0] || TYPES[0]
    );
  }

  function setStep(step) {
    stopSpeak();
    state.parked = false;
    state.step = step;
    render(true);
  }

  function ensurePortal() {
    var card = root.querySelector(".kmb-inquiry-card");
    if (card) return card;
    root.innerHTML =
      '<div class="kmb-inquiry-card" role="dialog" aria-label="Knowledge mobilization inquiry">' +
      traceMarkup() +
      '<div class="kmb-inquiry-body">' +
      '<p class="kmb-inquiry-copy"></p>' +
      '<p class="kmb-inquiry-note"></p>' +
      '<div class="kmb-inquiry-fill" aria-hidden="true"></div>' +
      '<div class="kmb-inquiry-stage">' +
      '<label class="kmb-inquiry-field"><span class="sr-only">Describe the problem</span>' +
      '<textarea id="kmb-inquiry-text" maxlength="2000" placeholder="Misaligned budget, audiences, reporting…"></textarea></label>' +
      "</div>" +
      '<div class="kmb-inquiry-reach">' +
      '<p class="kmb-inquiry-reach-q">May we reach out to you in the future for an interview or survey?</p>' +
      '<label class="kmb-inquiry-field"><span class="sr-only">Email</span>' +
      '<input id="kmb-inquiry-email" type="email" autocomplete="email" maxlength="120" placeholder="Your email" /></label>' +
      "</div>" +
      surveyMarkup() +
      '<div class="kmb-inquiry-actions"></div>' +
      '<p class="kmb-inquiry-return"></p>' +
      '<div class="kmb-inquiry-foot">' +
      '<p class="kmb-inquiry-id"></p>' +
      cradleMarkup() +
      '<button type="button" class="kmb-inquiry-leave">Not now</button>' +
      "</div>" +
      "</div></div>";
    var leave = root.querySelector(".kmb-inquiry-leave");
    if (leave) leave.addEventListener("click", scrollOn);
    var area = document.getElementById("kmb-inquiry-text");
    if (area) {
      area.addEventListener("focus", function () {
        if (state.parked) resumeInquiry();
      });
    }
    var mail = document.getElementById("kmb-inquiry-email");
    if (mail) {
      mail.addEventListener("input", function () {
        state.reachEmail = mail.value.trim();
      });
      mail.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          submitReach();
        }
      });
    }
    return root.querySelector(".kmb-inquiry-card");
  }

  function render(swap) {
    var type = typeFromRow(state.partnerType || state.clickedType);
    var copy = "";
    var note = "Anonymous unless you later ask us to write back.";
    var actions = [];

    if (state.step === "q1") {
      copy = "Are you " + type.article + " " + type.singular + "?";
      actions = [
        btn("Yes", function () { tickThen("q2"); }, true),
        btn("No", function () { setStep("q1no"); }, false),
      ];
    } else if (state.step === "q1no") {
      copy = "What are you?";
      note = "We’ll follow the path that matches. Same short questions; the record still amalgamates later.";
      actions = TYPES.map(function (option) {
        return btn(option.chip, function () {
          state.partnerType = option.row;
          state.clickedMismatch = option.row !== state.clickedType;
          tickThen("q2");
        }, false);
      });
    } else if (state.step === "q2") {
      copy = "Is knowledge mobilization a priority or a challenge?";
      actions = [
        btn("A priority", function () { chooseStance("priority"); }, false),
        btn("A challenge", function () { chooseStance("challenge"); }, false),
        btn("Both", function () { chooseStance("both"); }, true),
        btn("Not really", function () {
          state.kmbStance = "no";
          parkInquiry();
        }, false),
      ];
    } else if (state.step === "q3") {
      copy = "We’re trying to understand the problems " + type.plural + " face. Interested in telling us what you think?";
      actions = [
        btn("Yes", function () {
          state.willingToTell = "yes";
          tickThen("tell");
        }, true),
        btn("No", function () {
          state.willingToTell = "no";
          parkInquiry();
        }, false),
      ];
    } else if (state.step === "tell") {
      copy = "What kinds of problems are you seeing when it comes to knowledge mobilization?";
      note = speakHint || tellSpeakNote();
      actions.push(speakBtn());
      actions.push(
        btn("Share this", function () {
          var area = document.getElementById("kmb-inquiry-text");
          stopSpeak();
          state.problemText = area ? area.value.trim() : "";
          complete("completed");
        }, true)
      );
    } else if (state.step === "thanks") {
      copy = "Thank you. This was helpful.";
      note =
        "Because this is anonymous, we will not treat it as a named source. If you later want to be interviewed or complete a fuller survey, we would like to include your perspective in the research.";
      actions.push(
        btn("Share email", function () {
          submitReach();
        }, true)
      );
    } else if (state.step === "consult") {
      copy = "Thank you. We will reach out soon.";
      note = "Your email is with us. If a conversation would help now, you are welcome to book a consultation.";
      actions.push(linkBtn("Book a consultation", "#contact", true));
    }

    var card = ensurePortal();
    var ready = list.classList.contains("is-ready") || state.parked;
    card.classList.toggle("is-born", list.classList.contains("is-born"));
    card.classList.toggle("is-ready", ready);
    card.classList.toggle("is-parked", state.parked);

    var copyEl = root.querySelector(".kmb-inquiry-copy");
    var noteEl = root.querySelector(".kmb-inquiry-note");
    if (copyEl) {
      copyEl.textContent = copy;
      copyEl.classList.toggle("is-swap", !!(swap && !reduced));
    }
    if (noteEl) noteEl.textContent = note;

    var stage = root.querySelector(".kmb-inquiry-stage");
    if (stage) stage.classList.toggle("is-open", state.step === "tell");

    var reach = root.querySelector(".kmb-inquiry-reach");
    if (reach) reach.classList.toggle("is-open", state.step === "thanks");

    var mail = document.getElementById("kmb-inquiry-email");
    if (mail && state.step === "thanks") mail.value = state.reachEmail;

    var comeBack = root.querySelector(".kmb-inquiry-return");
    if (comeBack) {
      comeBack.textContent = state.parked ? "Thank you for your input. Please come back anytime." : "";
    }

    var area = document.getElementById("kmb-inquiry-text");
    if (area) {
      if (state.step === "tell") {
        if (!wantListen) area.value = state.problemText;
      } else if (state.step === "q1" && !state.parked) {
        area.value = "";
      }
    }

    var tray = root.querySelector(".kmb-inquiry-actions");
    if (tray) {
      tray.innerHTML = "";
      actions.forEach(function (node) {
        tray.appendChild(node);
      });
    }

    var leave = root.querySelector(".kmb-inquiry-leave");
    if (leave) {
      leave.hidden = state.parked || state.step === "thanks" || state.step === "consult";
      leave.textContent = "Not now";
    }

    var paper = root.querySelector(".kmb-inquiry-survey");
    if (paper) paper.className = "kmb-inquiry-survey " + surveyPoseClass();

    var idEl = root.querySelector(".kmb-inquiry-id");
    if (idEl) idEl.textContent = ticketLabel();

    if (area && state.step === "tell" && !wantListen && ready && !state.parked) area.focus();
    layoutCard();
  }

  function layoutCard() {
    var card = root.querySelector(".kmb-inquiry-card");
    var chip = activeChip();
    if (!card || !chip || !item) return;
    var listBox = list.getBoundingClientRect();
    var chipBox = chip.getBoundingClientRect();
    var cardWidth = Math.min(card.offsetWidth || 360, listBox.width);
    var preferred = chipBox.left - listBox.left;
    var maxLeft = Math.max(0, listBox.width - cardWidth);
    var left = Math.max(0, Math.min(maxLeft, preferred));
    root.style.marginLeft = left + "px";
    var connector = chipBox.left + chipBox.width / 2 - (listBox.left + left);
    connector = Math.max(18, Math.min(cardWidth - 18, connector));
    card.style.setProperty("--connector-left", connector + "px");
    fitTrace(card);
    layoutStem(chip);
  }

  function hideStem() {
    if (!stem) return;
    stem.hidden = true;
    stem.style.height = "0px";
  }

  function layoutStem(chip, fallbackHeight) {
    if (!stem || !chip) return;
    if (!list.classList.contains("is-inquiring")) {
      hideStem();
      return;
    }
    var listBox = list.getBoundingClientRect();
    var chipBox = chip.getBoundingClientRect();
    var card = root.querySelector(".kmb-inquiry-card");
    var x = chipBox.left + chipBox.width / 2 - listBox.left;
    var top = chipBox.bottom - listBox.top;
    var height = fallbackHeight || 28;
    if (list.classList.contains("is-resting")) {
      height = 0;
    } else if (card && list.classList.contains("is-open")) {
      height = Math.max(8, card.getBoundingClientRect().top - chipBox.bottom);
    }
    stem.hidden = false;
    stem.style.left = x + "px";
    stem.style.top = top + "px";
    stem.style.height = height + "px";
  }

  function traceMarkup() {
    return (
      '<svg class="kmb-inquiry-trace" aria-hidden="true">' +
      '<defs><mask id="kmb-trace-mask"><path class="kmb-inquiry-trace-mask" /></mask></defs>' +
      '<g mask="url(#kmb-trace-mask)">' +
      '<path class="kmb-inquiry-trace-teal" />' +
      '<path class="kmb-inquiry-trace-terra" />' +
      "</g></svg>"
    );
  }

  function cradleMarkup() {
    var motion = reduced
      ? ""
      : '<animateTransform attributeName="transform" type="rotate" values="0 8 5;0 8 5;40 8 5;0 8 5;0 8 5" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 0 1 1;0 0.45 0.35 1;0.55 0 1 0.35;0 0 1 1" calcMode="spline" dur="1.8s" repeatCount="indefinite" />';
    var motionRight = reduced
      ? ""
      : '<animateTransform attributeName="transform" type="rotate" values="-40 72 5;0 72 5;0 72 5;-40 72 5" keyTimes="0;0.25;0.75;1" keySplines="0.55 0 1 0.35;0 0 1 1;0 0.45 0.35 1" calcMode="spline" dur="1.8s" repeatCount="indefinite" />';
    return (
      '<div class="kmb-inquiry-cradle" aria-hidden="true">' +
      '<svg viewBox="-8 -2 96 56" overflow="visible">' +
      '<line x1="8" y1="5" x2="72" y2="5" fill="none" stroke="#32615F" stroke-width="1" stroke-dasharray="2 3" />' +
      '<g class="arm is-left">' +
      motion +
      '<line x1="8" y1="5" x2="8" y2="34" fill="none" stroke="#983C1D" stroke-width="1" stroke-dasharray="2 3" />' +
      '<circle cx="8" cy="38" r="4" fill="#983C1D" />' +
      "</g>" +
      '<line x1="24" y1="5" x2="24" y2="34" fill="none" stroke="#32615F" stroke-width="1" stroke-dasharray="2 3" />' +
      '<circle cx="24" cy="38" r="4" fill="#32615F" />' +
      '<line x1="40" y1="5" x2="40" y2="34" fill="none" stroke="#983C1D" stroke-width="1" stroke-dasharray="2 3" />' +
      '<circle cx="40" cy="38" r="4" fill="#983C1D" />' +
      '<line x1="56" y1="5" x2="56" y2="34" fill="none" stroke="#32615F" stroke-width="1" stroke-dasharray="2 3" />' +
      '<circle cx="56" cy="38" r="4" fill="#32615F" />' +
      '<g class="arm is-right">' +
      motionRight +
      '<line x1="72" y1="5" x2="72" y2="34" fill="none" stroke="#983C1D" stroke-width="1" stroke-dasharray="2 3" />' +
      '<circle cx="72" cy="38" r="4" fill="#983C1D" />' +
      "</g></svg></div>"
    );
  }

  function showSurvey() {
    return (
      state.step === "q1" ||
      state.step === "q1no" ||
      state.step === "q2" ||
      state.step === "q3" ||
      state.step === "tell"
    );
  }

  function surveyPoseClass() {
    var n = state.step === "tell" || (state.checks || 0) >= 3 ? 3 : state.checks || 0;
    var pose = "is-n" + n;
    var done = state.parked || state.step === "thanks" || state.step === "consult";
    if (state.step === "tell" && !done) pose += " is-writing";
    if (done) pose += " is-putting-down";
    return pose;
  }

  function surveyMarkup() {
    return (
      '<span class="kmb-inquiry-survey ' +
      surveyPoseClass() +
      '" aria-hidden="true">' +
      '<svg viewBox="0 0 54 72" overflow="visible">' +
      '<rect x="3" y="6" width="46" height="60" rx="3" fill="none" stroke="#32615F" stroke-dasharray="3 3" />' +
      '<rect x="9" y="11" width="8" height="8" rx="1" fill="none" stroke="#983C1D" stroke-dasharray="2 2.5" />' +
      '<line x1="20" y1="14" x2="44" y2="14" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<line x1="20" y1="17.5" x2="40" y2="17.5" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<rect x="9" y="23" width="8" height="8" rx="1" fill="none" stroke="#983C1D" stroke-dasharray="2 2.5" />' +
      '<line x1="20" y1="26" x2="44" y2="26" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<line x1="20" y1="29.5" x2="38" y2="29.5" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<rect x="9" y="35" width="8" height="8" rx="1" fill="none" stroke="#983C1D" stroke-dasharray="2 2.5" />' +
      '<line x1="20" y1="38" x2="44" y2="38" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<line x1="20" y1="41.5" x2="36" y2="41.5" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<line x1="9" y1="50" x2="44" y2="50" stroke="#983C1D" stroke-dasharray="2 3" />' +
      '<line x1="9" y1="55" x2="42" y2="55" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<line x1="9" y1="60" x2="38" y2="60" stroke="#32615F" stroke-dasharray="2 3" />' +
      '<path class="kmb-inquiry-survey-mark mark-1" d="M10.6 15.1 L12.8 17.3 L16.5 12.8" />' +
      '<path class="kmb-inquiry-survey-mark mark-2" d="M10.6 27.1 L12.8 29.3 L16.5 24.8" />' +
      '<path class="kmb-inquiry-survey-mark mark-3" d="M10.6 39.1 L12.8 41.3 L16.5 36.8" />' +
      '<g class="kmb-inquiry-survey-pencil">' +
      '<path d="M0 0 L4.4 -2.15 L4.4 2.15 Z" fill="#0D1B31" />' +
      '<path d="M4.4 -2.15 L9.6 -3 L9.6 3 L4.4 2.15 Z" fill="#D7B48A" />' +
      '<path d="M4.4 -1.05 L9.6 -1.45 L9.6 1.45 L4.4 1.05 Z" fill="#C49A6C" />' +
      '<rect x="9.6" y="-3" width="22" height="6" fill="#983C1D" />' +
      '<line x1="9.6" y1="-1.1" x2="31.6" y2="-1.1" stroke="#F4F4E8" stroke-width="0.5" stroke-opacity="0.28" />' +
      '<line x1="9.6" y1="0" x2="31.6" y2="0" stroke="#0D1B31" stroke-width="0.4" stroke-opacity="0.16" />' +
      '<line x1="9.6" y1="1.1" x2="31.6" y2="1.1" stroke="#F4F4E8" stroke-width="0.5" stroke-opacity="0.22" />' +
      '<rect x="31.6" y="-3.15" width="5.4" height="6.3" fill="#32615F" />' +
      '<line x1="32.5" y1="-2.4" x2="32.5" y2="2.4" stroke="#F4F4E8" stroke-width="0.45" stroke-opacity="0.4" />' +
      '<line x1="35.9" y1="-2.4" x2="35.9" y2="2.4" stroke="#F4F4E8" stroke-width="0.45" stroke-opacity="0.4" />' +
      '<rect x="37" y="-3" width="6.2" height="6" rx="1.2" fill="#B45A3C" />' +
      "</g></svg></span>"
    );
  }

  function btn(label, onClick, primary) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "kmb-inquiry-yes" + (primary ? " is-primary" : "");
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function linkBtn(label, href, primary) {
    var link = document.createElement("a");
    link.className = "kmb-inquiry-yes" + (primary ? " is-primary" : "");
    link.href = href;
    link.textContent = label;
    if (href === "#contact") {
      link.addEventListener("click", function () {
        var payload = {
          email: state.reachEmail || "",
          organization: state.partnerType || "",
        };
        try {
          sessionStorage.setItem("rossignolConsultCarry", JSON.stringify(payload));
        } catch (err) {}
        window.dispatchEvent(new CustomEvent("rossignol:carry-consult", { detail: payload }));
      });
    }
    return link;
  }

  function speakBtn() {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "kmb-inquiry-yes kmb-inquiry-speak" + (wantListen ? " is-listening" : "");
    button.setAttribute("aria-pressed", wantListen ? "true" : "false");
    button.textContent = wantListen ? "Listening…" : "Speak";
    button.addEventListener("click", toggleSpeak);
    return button;
  }

  function leaveBtn(label) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "kmb-inquiry-leave";
    button.textContent = label;
    button.addEventListener("click", scrollOn);
    return button;
  }

  function tellSpeakNote() {
    if (wantListen) {
      return "Listening. Keep talking — words appear as you speak. Tap Listening to stop.";
    }
    if (SpeechEngine) {
      return "Type, or tap Speak and allow the microphone. It stays on Listening until you tap it again.";
    }
    return "Voice isn’t available in this window. Type here, or open the site in Chrome or Safari to dictate.";
  }

  function setMic(on) {
    var mic = document.querySelector(".kmb-inquiry-speak");
    if (mic) {
      mic.classList.toggle("is-listening", on);
      mic.textContent = on ? "Listening…" : "Speak";
      mic.setAttribute("aria-pressed", on ? "true" : "false");
    }
    var field = document.getElementById("kmb-inquiry-text");
    if (field) field.classList.toggle("is-recording", on);
    var noteEl = root.querySelector(".kmb-inquiry-note");
    if (noteEl && state.step === "tell" && !state.parked) {
      noteEl.textContent = speakHint || tellSpeakNote();
    }
  }

  function startRec() {
    var area = document.getElementById("kmb-inquiry-text");
    if (!area || !SpeechEngine || !wantListen) return;
    recognition = new SpeechEngine();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = function (event) {
      var field = document.getElementById("kmb-inquiry-text");
      if (!field) return;
      var finals = dictatedBase;
      var interim = "";
      for (var i = 0; i < event.results.length; i += 1) {
        var chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finals = (finals ? finals + " " : "") + chunk.trim();
          dictatedBase = finals;
        } else {
          interim += chunk;
        }
      }
      field.value = (finals + " " + interim).replace(/\s+/g, " ").trim();
    };
    recognition.onerror = function (event) {
      if (event.error === "no-speech" || event.error === "aborted") return;
      wantListen = false;
      speakHint =
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "This window cannot use the microphone. In Chrome or Safari on the live site, tap Speak, allow access, and it will stay on Listening."
          : "Voice dictation isn’t available here. Type instead, or try Chrome or Safari.";
      setMic(false);
    };
    recognition.onend = function () {
      recognition = null;
      if (wantListen) {
        window.setTimeout(startRec, 80);
      } else {
        setMic(false);
      }
    };
    try {
      recognition.start();
      setMic(true);
    } catch (err) {
      window.setTimeout(function () {
        if (wantListen) startRec();
      }, 160);
    }
  }

  function toggleSpeak() {
    var area = document.getElementById("kmb-inquiry-text");
    if (!area) return;
    if (state.parked) resumeInquiry();
    area = document.getElementById("kmb-inquiry-text");
    if (!area) return;
    if (wantListen) {
      stopSpeak();
      speakHint = "";
      setMic(false);
      return;
    }
    if (!SpeechEngine) {
      speakHint = tellSpeakNote();
      setMic(false);
      return;
    }
    speakHint = "";
    dictatedBase = area.value.replace(/\s+$/, "");
    wantListen = true;
    setMic(true);
    startRec();
  }

  function stopSpeak() {
    wantListen = false;
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {}
      recognition = null;
    }
    var area = document.getElementById("kmb-inquiry-text");
    if (area) state.problemText = area.value.trim();
  }

  function tickThen(next) {
    state.checks = Math.min(3, (state.checks || 0) + 1);
    setStep(next);
  }

  function chooseStance(value) {
    state.kmbStance = value;
    tickThen("q3");
  }

  function farewell(status) {
    send(status);
    scrollOn();
  }

  function complete(status) {
    send(status);
    var survey = root.querySelector(".kmb-inquiry-survey");
    if (survey && !reduced) survey.classList.add("is-putting-down");
    setStep("thanks");
  }

  function payload(status) {
    return {
      website: "",
      id: state.id,
      openedAt: state.openedAt,
      source: state.source,
      clickedType: state.clickedType,
      partnerType: state.partnerType,
      clickedMismatch: state.clickedMismatch,
      kmbStance: state.kmbStance,
      willingToTell: state.willingToTell,
      problemText: state.problemText.slice(0, 2000),
      email: state.reachEmail.slice(0, 120),
      status: status,
    };
  }

  function submitReach() {
    var mail = document.getElementById("kmb-inquiry-email");
    var value = mail ? mail.value.trim() : state.reachEmail;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      if (mail) mail.focus();
      return;
    }
    state.reachEmail = value;
    send("interview-opt-in", true);
    setStep("consult");
  }

  function send(status, force) {
    if (state.sent && !force) return;
    if (!force) state.sent = true;
    var url = inquiryUrl();
    if (!url || url === window.ROSSIGNOL_CONSULT_ENDPOINT) return;
    try {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(status)),
      }).catch(function () {});
    } catch (err) {}
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
