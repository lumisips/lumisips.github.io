const zodiacData = [
  { sign: "Aries", symbol: "♈", flavor: "Coming Soon", gem: "Fire Opal", stage: "Community shaping", color: "#ff5f54" },
  { sign: "Taurus", symbol: "♉", flavor: "Yuzu Orange Citrus", gem: "Golden Citrine", stage: "Early development", color: "#ffb63d" },
  { sign: "Gemini", symbol: "♊", flavor: "Coming Soon", gem: "Alexandrite", stage: "Community shaping", color: "#8f7cff" },
  { sign: "Cancer", symbol: "♋", flavor: "Blue Raspberry • Dragon Fruit • Hibiscus", gem: "Blue Sapphire", stage: "Flagship refinement", color: "#1b8fff" },
  { sign: "Leo", symbol: "♌", flavor: "Coming Soon", gem: "Imperial Topaz", stage: "Community shaping", color: "#ff8a2a" },
  { sign: "Virgo", symbol: "♍", flavor: "Pineapple • Watermelon • Coconut", gem: "Emerald", stage: "R&D active", color: "#24d17e" },
  { sign: "Libra", symbol: "♎", flavor: "Coming Soon", gem: "Rose Quartz", stage: "Community shaping", color: "#ff83cb" },
  { sign: "Scorpio", symbol: "♏", flavor: "Dragon Fruit concept in development", gem: "Amethyst", stage: "R&D active", color: "#8a55e8" },
  { sign: "Sagittarius", symbol: "♐", flavor: "Kiwi • Mango • Passion Fruit", gem: "Pink Topaz", stage: "Color refinement", color: "#ff4fa8" },
  { sign: "Capricorn", symbol: "♑", flavor: "Strawberry • Sour Watermelon", gem: "Ruby", stage: "R&D active", color: "#e21843" },
  { sign: "Aquarius", symbol: "♒", flavor: "Coming Soon", gem: "Aquamarine", stage: "Community shaping", color: "#31d9e9" },
  { sign: "Pisces", symbol: "♓", flavor: "Mango • Coconut • Matcha", gem: "Jade", stage: "Still hydration R&D", color: "#5fd49b" }
];

const battleData = [
  { id: "scorpio-profile", title: "Scorpio flavor direction", subtitle: "Which profile feels most magnetic?", a: ["Black Cherry • Dragon Fruit • Lychee", "Deep, floral, exotic and seductive"], b: ["Black Cherry • Dragon Fruit • Pineapple", "Dark fruit lifted by bright tropical acidity"] },
  { id: "packaging", title: "Launch packaging", subtitle: "Which format delivers the strongest premium experience?", a: ["16 oz Glass Bottle", "Luxury hand-feel and gemstone clarity"], b: ["16 oz Sleek Can", "Modern, portable and production-friendly"] },
  { id: "hydration-line", title: "Hydration launch priority", subtitle: "What should reach the community first?", a: ["Still Hydration", "Smooth, clean and non-carbonated"], b: ["Sparkling Hydration", "Crisp, energetic and celebration-ready"] },
  { id: "energy-line", title: "Energy format", subtitle: "Choose the next high-function experience.", a: ["Still Energy", "Fast, smooth and gym-friendly"], b: ["Sparkling Energy", "Bold carbonation with functional energy"] },
  { id: "sweetness", title: "Sweetness personality", subtitle: "How should a premium LumiSips flavor finish?", a: ["Bright & Crisp", "Lighter sweetness with a clean finish"], b: ["Juicy & Luxurious", "Fuller flavor with a rich fruit impression"] },
  { id: "wellness", title: "Wellness emphasis", subtitle: "Which benefit deserves more focus?", a: ["Hydration + Electrolytes", "Daily refreshment and performance support"], b: ["Focus + Calm Energy", "Functional clarity without a harsh edge"] },
  { id: "limited-release", title: "First limited release", subtitle: "Which seasonal idea feels launch-worthy?", a: ["Summer Gem Collection", "Bright tropical profiles and vivid colors"], b: ["Midnight Zodiac Collection", "Dark fruits, deeper gemstones and mystery"] },
  { id: "community-role", title: "Community access", subtitle: "What would make membership most valuable?", a: ["Early Taste Testing", "Help judge real development samples"], b: ["Members-Only Voting", "Shape flavors, colors and packaging first"] }
];

const gemstoneData = [
  { id: "scorpio-purple", title: "Scorpio Amethyst", prompt: "Which purple has the strongest Scorpio energy?", a: ["Light Alexandrite", "Luminous, shifting and mysterious", "linear-gradient(145deg,#e8c9ff,#a85eea 45%,#5540b8)"], b: ["Deep Amethyst", "Dark, seductive and jewel-toned", "linear-gradient(145deg,#b66dff,#5d1e91 48%,#1c082f)"] },
  { id: "sagittarius-pink", title: "Sagittarius Topaz", prompt: "Which pink feels more premium in a clear beverage?", a: ["Pink Topaz", "Bright, clear and playful", "linear-gradient(145deg,#ffd0e9,#ff6fb7 48%,#d72477)"], b: ["Imperial Rose Topaz", "Deeper, warmer and luxurious", "linear-gradient(145deg,#ffc0a6,#ee557d 50%,#8f1e56)"] },
  { id: "virgo-green", title: "Virgo Emerald", prompt: "Which green best represents precision and wellness?", a: ["Bright Emerald", "Clean, vivid and refreshing", "linear-gradient(145deg,#a9ffd2,#1bd87e 50%,#08794a)"], b: ["Deep Forest Emerald", "Rich, mature and botanical", "linear-gradient(145deg,#66db9b,#0b7749 50%,#033425)"] },
  { id: "cancer-blue", title: "Cancer Sapphire", prompt: "Which blue should lead the flagship visual identity?", a: ["Aquamarine Sapphire", "Bright, electric and highly refreshing", "linear-gradient(145deg,#c1ffff,#18c8ff 50%,#2469d8)"], b: ["Royal Blue Sapphire", "Deep, premium and emotionally powerful", "linear-gradient(145deg,#8cc8ff,#2466e8 48%,#111a78)"] },
  { id: "capricorn-red", title: "Capricorn Ruby", prompt: "Which red feels strongest for strawberry sour watermelon?", a: ["Clear Ruby", "Bright red with gemstone clarity", "linear-gradient(145deg,#ffb3bd,#f13054 50%,#ad092b)"], b: ["Black Cherry Ruby", "Deep, serious and wine-dark", "linear-gradient(145deg,#e76584,#8e0e35 50%,#310418)"] },
  { id: "pisces-jade", title: "Pisces Jade", prompt: "Which jade complements mango, coconut and matcha?", a: ["Sea Glass Jade", "Soft, dreamy and tropical", "linear-gradient(145deg,#dcffe9,#76dba5 52%,#3b9873)"], b: ["Polished Jade", "Deeper, botanical and wellness-forward", "linear-gradient(145deg,#a9e9bb,#3e9c61 52%,#165233)"] }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderZodiac() {
  const grid = $("#zodiacGrid");
  if (!grid) return;
  grid.innerHTML = zodiacData.map(item => `
    <article class="zodiac-card reveal" style="--zodiac-color:${item.color}">
      <div class="zodiac-top"><span class="zodiac-symbol">${item.symbol}</span><span class="zodiac-stage">${item.stage}</span></div>
      <h3>${item.sign}</h3><p>${item.flavor}</p><small>${item.gem}</small>
    </article>`).join("");
}

function voteButton(group, battleId, side, title, description, extraClass = "vote-option", swatch = "") {
  const swatchHtml = swatch ? `<div class="gem-swatch" style="--gem-gradient:${swatch}"></div>` : "";
  return `<button class="${extraClass}" type="button" data-vote-group="${group}" data-battle-id="${battleId}" data-choice="${title}">${swatchHtml}<strong>${title}</strong><span>${description}</span></button>`;
}

function renderBattles() {
  const grid = $("#battleGrid");
  if (!grid) return;
  grid.innerHTML = battleData.map(item => `
    <article class="battle-card reveal"><h3>${item.title}</h3><p>${item.subtitle}</p><div class="battle-options">
      ${voteButton("flavor", item.id, "a", item.a[0], item.a[1])}<div class="vs">VS</div>${voteButton("flavor", item.id, "b", item.b[0], item.b[1])}
    </div></article>`).join("");
}

function renderGemstones() {
  const grid = $("#gemstoneGrid");
  if (!grid) return;
  grid.innerHTML = gemstoneData.map(item => `
    <article class="gem-battle reveal"><h3>${item.title}</h3><p>${item.prompt}</p><div class="gem-options">
      ${voteButton("gemstone", item.id, "a", item.a[0], item.a[1], "gem-option", item.a[2])}
      ${voteButton("gemstone", item.id, "b", item.b[0], item.b[1], "gem-option", item.b[2])}
    </div></article>`).join("");
}

function restoreVotes() {
  $$('[data-vote-group]').forEach(button => {
    const key = `lumisipsVote:${button.dataset.voteGroup}:${button.dataset.battleId}`;
    if (localStorage.getItem(key) === button.dataset.choice) button.classList.add("selected");
  });
}

async function handleVote(button) {
  const group = button.dataset.voteGroup;
  const battleId = button.dataset.battleId;
  const choice = button.dataset.choice;
  const key = `lumisipsVote:${group}:${battleId}`;
  const siblings = $$(`[data-vote-group="${group}"][data-battle-id="${battleId}"]`);
  siblings.forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
  localStorage.setItem(key, choice);
  const feedback = group === "gemstone" ? $("#gemstoneFeedback") : $("#battleFeedback");
  if (feedback) feedback.textContent = `Vote saved: ${choice}`;
  document.dispatchEvent(new CustomEvent("lumisips:vote", { detail: { group, battleId, choice } }));
}

function setupInteractions() {
  document.addEventListener("click", event => {
    const vote = event.target.closest("[data-vote-group]");
    if (vote) handleVote(vote);
  });

  const toggle = $("#menuToggle");
  const links = $("#navLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(link => link.addEventListener("click", () => {
    links?.classList.remove("open"); document.body.classList.remove("menu-open"); toggle?.setAttribute("aria-expanded", "false");
  }));

  const backTop = $("#backTop");
  backTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    $("#scrollProgress").style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
    backTop?.classList.toggle("visible", scrollY > 700);
  }, { passive: true });
}

function setupObservers() {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  $$(".reveal").forEach(item => revealObserver.observe(item));

  const progressObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      const value = entry.target.dataset.progress;
      $(".bar i", entry.target).style.width = `${value}%`;
      progressObserver.unobserve(entry.target);
    }
  }), { threshold: .4 });
  $$(".progress-row").forEach(item => progressObserver.observe(item));

  const numberObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
    const start = performance.now();
    const animate = now => { const p = Math.min((now - start) / 1100, 1); el.textContent = `${Math.floor(end * (1 - Math.pow(1-p,3)))}${suffix}`; if (p < 1) requestAnimationFrame(animate); };
    requestAnimationFrame(animate); numberObserver.unobserve(el);
  }), { threshold: .5 });
  $$('[data-count]').forEach(item => numberObserver.observe(item));
}

function setupStars() {
  const canvas = $("#starfield"), ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  let stars = [];
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(dpr,0,0,dpr,0,0);
    stars = Array.from({ length: Math.min(150, Math.floor(innerWidth / 8)) }, () => ({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: Math.random()*1.2+.2, a: Math.random()*.65+.15, s: Math.random()*.12+.02 }));
  };
  const draw = () => { ctx.clearRect(0,0,innerWidth,innerHeight); for (const star of stars) { star.y += star.s; if (star.y > innerHeight) star.y = 0; ctx.globalAlpha = star.a; ctx.fillStyle = "#bfeaff"; ctx.beginPath(); ctx.arc(star.x,star.y,star.r,0,Math.PI*2); ctx.fill(); } requestAnimationFrame(draw); };
  resize(); addEventListener("resize", resize); draw();
}

renderZodiac(); renderBattles(); renderGemstones(); restoreVotes(); setupInteractions(); setupObservers(); setupStars();

