const zodiacData = [
  { sign: "Aries", symbol: "♈", flavor: "Coming Soon", gem: "Fire Opal", stage: "Community shaping", color: "#ff5f54" },
  { sign: "Taurus", symbol: "♉", flavor: "Yuzu Orange Citrus", gem: "Golden Citrine", stage: "Early development", color: "#ffb63d" },
  { sign: "Gemini", symbol: "♊", flavor: "Coming Soon", gem: "Alexandrite", stage: "Community shaping", color: "#8f7cff" },
  { sign: "Cancer", symbol: "♋", flavor: "Blue Raspberry • Dragon Fruit • Hibiscus", gem: "Blue Sapphire", stage: "Flagship refinement", color: "#1b8fff" },
  { sign: "Leo", symbol: "♌", flavor: "Coming Soon", gem: "Imperial Topaz", stage: "Community shaping", color: "#ff8a2a" },
  { sign: "Virgo", symbol: "♍", flavor: "Pineapple • Watermelon • Coconut", gem: "Emerald", stage: "R&D active", color: "#24d17e" },
  { sign: "Libra", symbol: "♎", flavor: "Coming Soon", gem: "Rose Quartz", stage: "Community shaping", color: "#ff83cb" },
  { sign: "Scorpio", symbol: "♏", flavor: "Strawberry • Pineapple • Dragon Fruit", gem: "Purple Kunzite", stage: "R&D active", color: "#9a62e8" },
  { sign: "Sagittarius", symbol: "♐", flavor: "Black Cherry • Dragon Fruit • Pineapple", gem: "Pink Topaz", stage: "R&D active", color: "#ff4fa8" },
  { sign: "Capricorn", symbol: "♑", flavor: "Strawberry • Sour Watermelon", gem: "Ruby", stage: "Advanced refinement", color: "#e21843" },
  { sign: "Aquarius", symbol: "♒", flavor: "Coming Soon", gem: "Aquamarine", stage: "Community shaping", color: "#31d9e9" },
  { sign: "Pisces", symbol: "♓", flavor: "Strawberry • Açaí • Pomegranate", gem: "Deep Amethyst", stage: "R&D active", color: "#7137b8" }
];

const battleData = [
  {
    id: "packaging",
    title: "Launch packaging",
    subtitle: "Which format delivers the strongest premium experience?",
    a: ["16 oz Glass Bottle", "Luxury hand-feel and gemstone clarity"],
    b: ["16 oz Sleek Can", "Modern, portable and production-friendly"]
  },
  {
    id: "hydration-line",
    title: "Hydration launch priority",
    subtitle: "What should reach the community first?",
    a: ["Still Hydration", "Smooth, clean and non-carbonated"],
    b: ["Sparkling Hydration", "Crisp, energetic and celebration-ready"]
  },
  {
    id: "energy-line",
    title: "Energy format",
    subtitle: "Choose the next high-function experience.",
    a: ["Still Energy", "Fast, smooth and gym-friendly"],
    b: ["Sparkling Energy", "Bold carbonation with functional energy"]
  },
  {
    id: "sweetness",
    title: "Sweetness personality",
    subtitle: "How should a premium LumiSips flavor finish?",
    a: ["Bright & Crisp", "Lighter sweetness with a clean finish"],
    b: ["Juicy & Luxurious", "Fuller flavor with a rich fruit impression"]
  },
  {
    id: "wellness",
    title: "Wellness emphasis",
    subtitle: "Which benefit deserves more focus?",
    a: ["Hydration + Electrolytes", "Daily refreshment and performance support"],
    b: ["Focus + Calm Energy", "Functional clarity without a harsh edge"]
  },
  {
    id: "limited-release",
    title: "First limited release",
    subtitle: "Which seasonal idea feels launch-worthy?",
    a: ["Summer Gem Collection", "Bright tropical profiles and vivid colors"],
    b: ["Midnight Zodiac Collection", "Dark fruits, deeper gemstones and mystery"]
  },
  {
    id: "community-role",
    title: "Community access",
    subtitle: "What would make membership most valuable?",
    a: ["Early Taste Testing", "Help judge real development samples"],
    b: ["Members-Only Voting", "Shape flavors, colors and packaging first"]
  }
];

const gemstoneData = [
  {
    id: "scorpio-purple",
    title: "Scorpio Kunzite",
    prompt: "Which purple has the strongest Scorpio energy?",
    a: ["Light Purple Kunzite", "Luminous, soft and mysterious", "linear-gradient(145deg,#f0d6ff,#ba7ce8 45%,#7350b8)"],
    b: ["Medium Purple Kunzite", "Richer gemstone purple without becoming too dark", "linear-gradient(145deg,#dba9ff,#9358c8 48%,#512b82)"]
  },
  {
    id: "sagittarius-pink",
    title: "Sagittarius Topaz",
    prompt: "Which gemstone direction feels more premium?",
    a: ["Pink Topaz", "Bright, clear and energetic", "linear-gradient(145deg,#ffd0e9,#ff6fb7 48%,#d72477)"],
    b: ["Imperial Topaz", "Warm orange-gold gemstone energy", "linear-gradient(145deg,#ffd4a1,#ff8a38 50%,#c64a19)"]
  },
  {
    id: "virgo-green",
    title: "Virgo Emerald",
    prompt: "Which green best represents precision and wellness?",
    a: ["Bright Emerald", "Clean, vivid and refreshing", "linear-gradient(145deg,#a9ffd2,#1bd87e 50%,#08794a)"],
    b: ["Deep Emerald", "Rich, mature and botanical", "linear-gradient(145deg,#66db9b,#0b7749 50%,#033425)"]
  },
  {
    id: "cancer-blue",
    title: "Cancer Sapphire",
    prompt: "Which blue should lead the flagship visual identity?",
    a: ["Aquamarine Sapphire", "Bright, electric and highly refreshing", "linear-gradient(145deg,#c1ffff,#18c8ff 50%,#2469d8)"],
    b: ["Royal Blue Sapphire", "Deep, premium and emotionally powerful", "linear-gradient(145deg,#8cc8ff,#2466e8 48%,#111a78)"]
  },
  {
    id: "capricorn-red",
    title: "Capricorn Ruby",
    prompt: "Which ruby feels strongest for strawberry sour watermelon?",
    a: ["Clear Ruby", "Bright red with gemstone clarity", "linear-gradient(145deg,#ffb3bd,#f13054 50%,#ad092b)"],
    b: ["Deep Ruby", "Bold, serious and luxurious", "linear-gradient(145deg,#e76584,#8e0e35 50%,#310418)"]
  },
  {
    id: "pisces-amethyst",
    title: "Pisces Amethyst",
    prompt: "Which purple best complements strawberry, açaí and pomegranate?",
    a: ["Vibrant Amethyst", "Bright berry-purple gemstone energy", "linear-gradient(145deg,#e2a8ff,#9d4de0 52%,#6122a3)"],
    b: ["Deep Amethyst", "Dark, luxurious and jewel-toned", "linear-gradient(145deg,#b76ce8,#682595 52%,#2d0b48)"]
  }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderZodiac() {
  const grid = $("#zodiacGrid");
  if (!grid) return;

  grid.innerHTML = zodiacData.map(item => `
    <article class="zodiac-card reveal" style="--zodiac-color:${item.color}">
      <div class="zodiac-top">
        <span class="zodiac-symbol">${item.symbol}</span>
        <span class="zodiac-stage">${item.stage}</span>
      </div>
      <h3>${item.sign}</h3>
      <p>${item.flavor}</p>
      <small>${item.gem}</small>
    </article>
  `).join("");
}

function voteButton(
  group,
  battleId,
  title,
  description,
  extraClass = "vote-option",
  swatch = ""
) {
  const swatchHtml = swatch
    ? `<div class="gem-swatch" style="--gem-gradient:${swatch}"></div>`
    : "";

  return `
    <button
      class="${extraClass}"
      type="button"
      data-vote-group="${group}"
      data-battle-id="${battleId}"
      data-choice="${title}"
    >
      ${swatchHtml}
      <strong>${title}</strong>
      <span>${description}</span>
    </button>
  `;
}

function renderBattles() {
  const grid = $("#battleGrid");
  if (!grid) return;

  grid.innerHTML = battleData.map(item => `
    <article class="battle-card reveal">
      <h3>${item.title}</h3>
      <p>${item.subtitle}</p>

      <div class="battle-options">
        ${voteButton("flavor", item.id, item.a[0], item.a[1])}
        <div class="vs">VS</div>
        ${voteButton("flavor", item.id, item.b[0], item.b[1])}
      </div>
    </article>
  `).join("");
}

function renderGemstones() {
  const grid = $("#gemstoneGrid");
  if (!grid) return;

  grid.innerHTML = gemstoneData.map(item => `
    <article class="gem-battle reveal">
      <h3>${item.title}</h3>
      <p>${item.prompt}</p>

      <div class="gem-options">
        ${voteButton(
          "gemstone",
          item.id,
          item.a[0],
          item.a[1],
          "gem-option",
          item.a[2]
        )}

        ${voteButton(
          "gemstone",
          item.id,
          item.b[0],
          item.b[1],
          "gem-option",
          item.b[2]
        )}
      </div>
    </article>
  `).join("");
}

function restoreVotes() {
  $$("[data-vote-group]").forEach(button => {
    const key =
      `lumisipsVote:${button.dataset.voteGroup}:${button.dataset.battleId}`;

    if (localStorage.getItem(key) === button.dataset.choice) {
      button.classList.add("selected");
    }
  });
}

function setVoteFeedback(group, message, state = "") {
  const feedback =
    group === "gemstone"
      ? $("#gemstoneFeedback")
      : $("#battleFeedback");

  if (!feedback) return;

  feedback.textContent = message;

  if (state) {
    feedback.dataset.state = state;
  } else {
    feedback.removeAttribute("data-state");
  }
}

function handleVote(button) {
  const group = button.dataset.voteGroup;
  const battleId = button.dataset.battleId;
  const choice = button.dataset.choice;

  if (!group || !battleId || !choice) return;

  const key = `lumisipsVote:${group}:${battleId}`;

  const siblings = $$(
    `[data-vote-group="${group}"][data-battle-id="${battleId}"]`
  );

  siblings.forEach(item => item.classList.remove("selected"));

  button.classList.add("selected");
  localStorage.setItem(key, choice);

  setVoteFeedback(group, `Saving vote: ${choice}…`);

  document.dispatchEvent(
    new CustomEvent("lumisips:vote", {
      detail: {
        group,
        battleId,
        choice
      }
    })
  );
}

function setupVoteResponses() {
  document.addEventListener("lumisips:vote-saved", event => {
    const { group, choice } = event.detail || {};

    if (!group || !choice) return;

    setVoteFeedback(
      group,
      `Vote saved: ${choice}`,
      "success"
    );
  });

  document.addEventListener("lumisips:vote-error", event => {
    const { group } = event.detail || {};

    if (!group) return;

    setVoteFeedback(
      group,
      "Your selection is saved on this device, but the online vote could not be submitted. Please try again.",
      "error"
    );
  });
}

function injectCommerceSection() {
  if ($("#shop")) return;

  const roadmap = $("#roadmap");
  if (!roadmap) return;

  const section = document.createElement("section");

  section.className = "section section-dark commerce-section";
  section.id = "shop";

  section.innerHTML = `
    <div class="section-shell">

      <div class="section-heading reveal">
        <p class="eyebrow">Founder's release</p>

        <h2>Be first in line for LumiSips</h2>

        <p>
          LumiSips is moving toward pilot production. Reserve your interest
          now and get priority notice when first-release inventory becomes
          available.
        </p>
      </div>

      <div class="price-grid">

        <article class="price-card reveal">
          <span>Single</span>
          <strong>$6.99</strong>
          <small>1 bottle</small>
        </article>

        <article class="price-card reveal">
          <span>Duo</span>
          <strong>$13</strong>
          <small>2 bottles • $6.50 each</small>
        </article>

        <article class="price-card reveal">
          <span>3-Pack</span>
          <strong>$22</strong>
          <small>3 bottles</small>
        </article>

        <article class="price-card reveal">
          <span>4-Pack</span>
          <strong>$28</strong>
          <small>4 bottles • $7 each</small>
        </article>

        <article class="price-card reveal">
          <span>5-Pack</span>
          <strong>$32</strong>
          <small>5 bottles • $6.40 each</small>
        </article>

        <article class="price-card featured reveal">
          <span>6-Pack</span>
          <strong>$36</strong>
          <small>6 bottles • $6 each</small>
          <b>Best Value</b>
        </article>

      </div>

      <div class="commerce-grid">

        <article class="commerce-card reveal">
          <p class="card-kicker">First-release access</p>

          <h3>Reserve your place</h3>

          <p>
            Tell us what you want so LumiSips can better plan pilot inventory,
            packaging and launch demand.
          </p>

          <ul class="commerce-list">
            <li>Priority notice when pilot inventory opens</li>
            <li>Choose available flavors when ordering begins</li>
            <li>Help shape future bundle options</li>
            <li>Founding-community launch updates</li>
            <li>No payment collected on this page</li>
          </ul>

          <a class="btn btn-secondary" href="#join">
            Join the Founding Community
          </a>
        </article>

        <form
          class="form-card ajax-form reveal"
          id="purchaseForm"
          data-collection="purchaseRequests"
          data-success="Request received. You're in line for LumiSips first-release access."
        >

          <input
            type="hidden"
            name="form_type"
            value="Purchase Request"
          >

          <label>
            Name
            <input
              name="name"
              type="text"
              maxlength="100"
              autocomplete="name"
              required
            >
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              maxlength="254"
              autocomplete="email"
              required
            >
          </label>

          <label>
            Quantity
            <select name="quantity" required>
              <option value="1">1 bottle — $6.99</option>
              <option value="2">2 bottles — $13</option>
              <option value="3">3 bottles — $22</option>
              <option value="4">4 bottles — $28</option>
              <option value="5">5 bottles — $32</option>
              <option value="6">6 bottles — $36</option>
            </select>
          </label>

          <label>
            Preferred packaging
            <select name="format">
              <option value="Glass bottle">16 oz glass bottle</option>
              <option value="Sleek can">16 oz sleek can</option>
              <option value="No preference">No preference</option>
            </select>
          </label>

          <label>
            Flavor you're most interested in
            <input
              name="flavor_interest"
              type="text"
              maxlength="120"
              placeholder="Cancer, Capricorn, Virgo..."
            >
          </label>

          <input
            class="honeypot"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >

          <button class="btn btn-primary" type="submit">
            Request First-Release Access
          </button>

          <p class="form-status" aria-live="polite"></p>

        </form>

      </div>

      <p class="commerce-note">
        Pricing shown reflects current LumiSips launch-target pricing and may
        change before commercial release. This form does not process payment.
        Final product availability, packaging, shipping and purchase terms
        will be confirmed before any payment is collected.
      </p>

    </div>
  `;

  roadmap.after(section);
}

function injectShopNavigation() {
  const nav = $("#navLinks");

  if (!nav || $('#navLinks a[href="#shop"]')) return;

  const cta = $(".nav-cta", nav);
  const link = document.createElement("a");

  link.href = "#shop";
  link.textContent = "Shop";

  if (cta) {
    nav.insertBefore(link, cta);
  } else {
    nav.appendChild(link);
  }
}

function injectCommerceStyles() {
  if ($("#lumisips-commerce-styles")) return;

  const style = document.createElement("style");

  style.id = "lumisips-commerce-styles";

  style.textContent = `
    .commerce-section {
      position: relative;
      overflow: hidden;
    }

    .price-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 12px;
      margin: 32px 0;
    }

    .price-card,
    .commerce-card {
      background: rgba(15, 22, 49, 0.74);
      border: 1px solid rgba(151, 184, 255, 0.16);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 18px 55px rgba(0, 0, 0, 0.22);
    }

    .price-card {
      position: relative;
      min-height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .price-card span {
      color: #aab4d2;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .price-card strong {
      font-size: 2rem;
      margin: 6px 0;
    }

    .price-card small {
      color: #aab4d2;
    }

    .price-card.featured {
      border-color: rgba(23, 232, 255, 0.55);
      box-shadow: 0 0 35px rgba(23, 232, 255, 0.12);
    }

    .price-card b {
      position: absolute;
      top: 12px;
      right: 12px;
      color: #72ffc2;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .commerce-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 22px;
      align-items: start;
    }

    .commerce-card h3 {
      font-size: 1.7rem;
      margin: 5px 0 15px;
    }

    .commerce-card p {
      color: #aab4d2;
    }

    .commerce-list {
      padding-left: 20px;
      margin: 20px 0 25px;
      color: #aab4d2;
    }

    .commerce-list li {
      margin: 10px 0;
    }

    .commerce-section .form-card {
      margin: 0;
    }

    .commerce-note {
      color: #8994b6;
      font-size: 0.8rem;
      margin-top: 20px;
      line-height: 1.6;
    }

    .vote-feedback[data-state="success"],
    .form-status[data-state="success"] {
      color: #64ffb4;
    }

    .vote-feedback[data-state="error"],
    .form-status[data-state="error"] {
      color: #ff6b6b;
    }

    @media (max-width: 1050px) {
      .price-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 720px) {
      .price-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .commerce-grid {
        grid-template-columns: 1fr;
      }

      .price-card {
        min-height: 125px;
        padding: 16px;
      }

      .price-card strong {
        font-size: 1.65rem;
      }
    }

    @media (max-width: 430px) {
      .price-grid {
        grid-template-columns: 1fr 1fr;
        gap: 9px;
      }

      .price-card {
        min-height: 115px;
        border-radius: 16px;
      }

      .price-card strong {
        font-size: 1.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto !important;
      }

      .reveal {
        transition: none !important;
      }

      .ticker-track {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
}

function setupInteractions() {
  document.addEventListener("click", event => {
    const vote = event.target.closest("[data-vote-group]");

    if (vote) {
      handleVote(vote);
    }
  });

  const toggle = $("#menuToggle");
  const links = $("#navLinks");

  toggle?.addEventListener("click", () => {
    if (!links) return;

    const open = links.classList.toggle("open");

    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
      links?.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const backTop = $("#backTop");

  backTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  let ticking = false;

  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = $("#scrollProgress");

    if (progress) {
      progress.style.width =
        `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    }

    backTop?.classList.toggle("visible", window.scrollY > 700);

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollUI();
}

function setupObservers() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(item => item.classList.add("visible"));

    $$(".progress-row").forEach(item => {
      const bar = $(".bar i", item);

      if (bar) {
        bar.style.width = `${item.dataset.progress || 0}%`;
      }
    });

    $$("[data-count]").forEach(item => {
      item.textContent =
        `${item.dataset.count || 0}${item.dataset.suffix || ""}`;
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach(item => {
    revealObserver.observe(item);
  });

  const progressObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const value = entry.target.dataset.progress;
        const bar = $(".bar i", entry.target);

        if (bar) {
          bar.style.width = `${value}%`;
        }

        progressObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  $$(".progress-row").forEach(item => {
    progressObserver.observe(item);
  });

  const numberObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const end = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";
        const start = performance.now();
        const duration = 900;

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          element.textContent =
            `${Math.floor(end * eased)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        numberObserver.unobserve(element);
      });
    },
    { threshold: 0.5 }
  );

  $$("[data-count]").forEach(item => {
    numberObserver.observe(item);
  });
}

function setupStars() {
  const canvas = $("#starfield");
  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) return;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  let stars = [];
  let animationId = null;
  let resizeTimer = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = Math.min(
      100,
      Math.max(45, Math.floor(window.innerWidth / 12))
    );

    stars = Array.from(
      { length: starCount },
      () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.6 + 0.15,
        s: Math.random() * 0.09 + 0.015
      })
    );
  }

  function draw() {
    if (!document.hidden) {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      for (const star of stars) {
        star.y += star.s;

        if (star.y > window.innerHeight) {
          star.y = 0;
          star.x = Math.random() * window.innerWidth;
        }

        ctx.globalAlpha = star.a;
        ctx.fillStyle = "#bfeaff";

        ctx.beginPath();
        ctx.arc(
          star.x,
          star.y,
          star.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(resize, 150);
    },
    { passive: true }
  );

  draw();

  window.addEventListener(
    "pagehide",
    () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
    { once: true }
  );
}

renderZodiac();
renderBattles();
renderGemstones();

injectCommerceSection();
injectShopNavigation();
injectCommerceStyles();

restoreVotes();
setupVoteResponses();
setupInteractions();
setupObservers();
setupStars();
