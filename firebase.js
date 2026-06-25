import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  increment,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW_HC9OVcpkLc4TFY6MR8brufTPniwXEg",
  authDomain: "lumisips-b280f.firebaseapp.com",
  databaseURL: "https://lumisips-b280f-default-rtdb.firebaseio.com",
  projectId: "lumisips-b280f",
  storageBucket: "lumisips-b280f.firebasestorage.app",
  messagingSenderId: "980927514380",
  appId: "1:980927514380:web:5e92f1aeb27ba46a9eeb29",
  measurementId: "G-D307MPGWL1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const defaultVotes = {
  Aries: 12,
  Taurus: 8,
  Gemini: 15,
  Leo: 21,
  Virgo: 7,
  Libra: 10,
  Scorpio: 18,
  Sagittarius: 9,
  Capricorn: 24,
  Aquarius: 11,
  Pisces: 14
};

const zodiacSigns = [
  ["Aries","♈","Coming Soon","soon"],
  ["Taurus","♉","Lemon • Orange • Citrus","active"],
  ["Gemini","♊","Coming Soon","soon"],
  ["Cancer","♋","Blue Raspberry • Dragon Fruit • Hibiscus","flagship"],
  ["Leo","♌","Coming Soon","soon"],
  ["Virgo","♍","Coming Soon","soon"],
  ["Libra","♎","Coming Soon","soon"],
  ["Scorpio","♏","Coming Soon","soon"],
  ["Sagittarius","♐","Coming Soon","soon"],
  ["Capricorn","♑","Coming Soon","soon"],
  ["Aquarius","♒","Coming Soon","soon"],
  ["Pisces","♓","Coming Soon","soon"]
];

const battles = [
  { key:"battle0", left:"Glass Bottles", right:"Aluminum Cans", leftIcon:"🧊", rightIcon:"🥤" },
  { key:"battle1", left:"Still Hydration", right:"Sparkling Hydration", leftIcon:"💧", rightIcon:"✨" },
  { key:"battle2", left:"Energy", right:"Sparkling Energy", leftIcon:"⚡", rightIcon:"🔋" },
  { key:"battle3", left:"Blue Raspberry", right:"Watermelon", leftIcon:"🫐", rightIcon:"🍉" },
  { key:"battle4", left:"Dragon Fruit", right:"Passion Fruit", leftIcon:"🐉", rightIcon:"🌺" }
];

const defaultBattleVotes = {
  battle0: { "Glass Bottles": 18, "Aluminum Cans": 12 },
  battle1: { "Still Hydration": 10, "Sparkling Hydration": 22 },
  battle2: { "Energy": 16, "Sparkling Energy": 26 },
  battle3: { "Blue Raspberry": 30, "Watermelon": 19 },
  battle4: { "Dragon Fruit": 24, "Passion Fruit": 21 }
};

const starterSuggestions = [
  { zodiac:"Taurus ♉", flavor:"Lemon Orange Citrus", message:"Bright, refreshing citrus hydration with a clean finish." },
  { zodiac:"Capricorn ♑", flavor:"Sour Watermelon Strawberry", message:"A bold sour candy-inspired hydration flavor." },
  { zodiac:"Leo ♌", flavor:"Pineapple Passion Fruit", message:"Tropical, bright, loud, and summer-focused." },
  { zodiac:"Gemini ♊", flavor:"Lemon Lime Blueberry", message:"Dual citrus energy with a smooth berry finish." },
  { zodiac:"Pisces ♓", flavor:"Mango Coconut", message:"Dreamy tropical hydration concept." }
];

const timelineItems = [
  "Idea Created",
  "LLC Approved",
  "EIN Received",
  "Business Bank Account Opened",
  "Seller’s Permit Obtained",
  "D-U-N-S Number Approved",
  "Cancer Formula Advanced",
  "Bulk Batch Development Started",
  "Taurus Citrus Development Added",
  "Website Community Launched",
  "Pre-Launch Development Phase",
  "Official Launch"
];

let liveVotes = { ...defaultVotes };
let liveBattleVotes = { ...defaultBattleVotes };
let liveSuggestions = [...starterSuggestions];

function $(id) {
  return document.getElementById(id);
}

function hideLoader() {
  const loader = $("loader");
  if (loader) loader.style.display = "none";
}

async function seedDatabaseOnce() {
  try {
    const seededSnap = await get(ref(db, "system/seeded"));

    if (seededSnap.exists()) return;

    for (const [sign, count] of Object.entries(defaultVotes)) {
      await set(ref(db, `votes/${sign}`), { count });
    }

    for (const [key, value] of Object.entries(defaultBattleVotes)) {
      await set(ref(db, `battleVotes/${key}`), value);
    }

    await set(ref(db, "stats/members"), 1);
    await set(ref(db, "system/seeded"), true);

  } catch (error) {
    console.error("Seed error:", error);
  }
}

function renderZodiac() {
  const grid = $("zodiacGrid");
  if (!grid) return;

  grid.innerHTML = "";

  zodiacSigns.forEach(([name, symbol, flavor, status]) => {
    grid.innerHTML += `
      <div class="card ${status === "flagship" ? "flagship" : ""} ${status === "active" ? "active-development" : ""}">
        <h3>${symbol} ${name}</h3>
        <p>${flavor}</p>
        <span class="badge">${
          status === "flagship" ? "Flagship Locked" :
          status === "active" ? "Early Development" :
          "Coming Soon"
        }</span>
      </div>
    `;
  });
}

function renderVotes() {
  const grid = $("voteGrid");
  const message = $("voteMessage");
  if (!grid) return;

  const hasVoted = localStorage.getItem("lumisipsHasVotedZodiac") === "true";

  grid.innerHTML = "";

  zodiacSigns.filter(z => z[0] !== "Cancer").forEach(([name, symbol]) => {
    grid.innerHTML += `
      <div class="card">
        <h3>${symbol} ${name}</h3>
        <p>Votes: <b>${liveVotes[name] || 0}</b></p>
        <button class="btn primary" onclick="vote('${name}')" ${hasVoted ? "disabled" : ""}>
          ${hasVoted ? "Vote Locked" : `Vote ${symbol}`}
        </button>
      </div>
    `;
  });

  if (hasVoted && message) {
    message.textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
  }
}

function renderLeaderboard() {
  const box = $("leaderboardList");
  if (!box) return;

  const ranked = zodiacSigns.map(([name, symbol]) => ({
    name,
    symbol,
    locked: name === "Cancer",
    votes: name === "Cancer" ? "Flagship Locked" : liveVotes[name] || 0
  })).sort((a, b) => {
    if (a.locked) return -1;
    if (b.locked) return 1;
    return b.votes - a.votes;
  });

  box.innerHTML = ranked.map((x, i) => `
    <div class="leaderboard-row ${x.locked ? "flagship" : ""}">
      <span>${i + 1}. ${x.symbol} ${x.name}</span>
      <b>${x.votes}</b>
    </div>
  `).join("");
}

async function vote(name) {
  if (localStorage.getItem("lumisipsHasVotedZodiac") === "true") return;

  await update(ref(db, `votes/${name}`), {
    count: increment(1)
  });

  await push(ref(db, "notifications"), {
    type: "Zodiac Vote",
    message: `Someone voted for ${name}`,
    choice: name,
    createdAt: Date.now()
  });

  localStorage.setItem("lumisipsHasVotedZodiac", "true");

  const message = $("voteMessage");
  if (message) message.textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";

  sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
}

window.vote = vote;

function renderBattles() {
  const grid = $("battleGrid");
  if (!grid) return;

  grid.innerHTML = "";

  battles.forEach(battle => {
    const data = liveBattleVotes[battle.key] || {};
    const leftVotes = data[battle.left] || 0;
    const rightVotes = data[battle.right] || 0;
    const total = leftVotes + rightVotes || 1;

    const leftPercent = Math.round((leftVotes / total) * 100);
    const rightPercent = Math.round((rightVotes / total) * 100);

    const votedChoice = localStorage.getItem(`lumisipsVotedBattle_${battle.key}`);
    const locked = Boolean(votedChoice);

    let winner = "Tie";
    if (leftVotes > rightVotes) winner = battle.left;
    if (rightVotes > leftVotes) winner = battle.right;

    grid.innerHTML += `
      <div class="battle-card">
        <div class="battle-header">
          <h3>${battle.left} vs ${battle.right}</h3>
          <span class="winner-badge">👑 ${winner}</span>
        </div>

        <div class="battle-matchup">
          <div class="battle-option ${locked ? "locked" : ""}" onclick="battleVote('${battle.key}','${battle.left}', event)">
            <div class="option-emoji">${battle.leftIcon}</div>
            <div class="option-name">${battle.left}</div>
            <div class="option-votes">${leftVotes} votes • ${leftPercent}%</div>
            <div class="health-bar"><span style="width:${leftPercent}%"></span></div>
            <div class="pick-locked">${votedChoice === battle.left ? "Your pick is locked." : ""}</div>
          </div>

          <div class="vs-orb">VS</div>

          <div class="battle-option ${locked ? "locked" : ""}" onclick="battleVote('${battle.key}','${battle.right}', event)">
            <div class="option-emoji">${battle.rightIcon}</div>
            <div class="option-name">${battle.right}</div>
            <div class="option-votes">${rightVotes} votes • ${rightPercent}%</div>
            <div class="health-bar"><span style="width:${rightPercent}%"></span></div>
            <div class="pick-locked">${votedChoice === battle.right ? "Your pick is locked." : ""}</div>
          </div>
        </div>
      </div>
    `;
  });
}

async function battleVote(key, choice, event) {
  if (localStorage.getItem(`lumisipsVotedBattle_${key}`)) return;

  await update(ref(db, `battleVotes/${key}`), {
    [choice]: increment(1)
  });

  await push(ref(db, "notifications"), {
    type: "Battle Vote",
    message: `Someone picked ${choice}`,
    battle: key,
    choice,
    createdAt: Date.now()
  });

  localStorage.setItem(`lumisipsVotedBattle_${key}`, choice);

  if (event?.currentTarget) {
    event.currentTarget.classList.add("selected");
    const rect = event.currentTarget.getBoundingClientRect();
    sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
}

window.battleVote = battleVote;

function renderSuggestions() {
  const grid = $("suggestionGrid");
  if (!grid) return;

  grid.innerHTML = liveSuggestions.map(item => `
    <div class="card">
      <span>${item.zodiac || "Community Idea"}</span>
      <h3>${item.flavor || "Flavor Idea"}</h3>
      <p>${item.message || item.note || "Submitted by the LumiSips community."}</p>
    </div>
  `).join("");
}

function renderTimeline() {
  const timeline = $("timeline");
  if (!timeline) return;

  timeline.innerHTML = timelineItems.map(item => `
    <div class="timeline-item"><h3>${item}</h3></div>
  `).join("");
}

function setupLiveListeners() {
  onValue(ref(db, "votes"), snapshot => {
    const data = snapshot.val();

    if (data) {
      liveVotes = { ...defaultVotes };

      Object.entries(data).forEach(([sign, value]) => {
        if (typeof value === "number") {
          liveVotes[sign] = value;
        } else if (value && typeof value.count === "number") {
          liveVotes[sign] = value.count;
        }
      });
    }

    renderVotes();
    renderLeaderboard();
  });

  onValue(ref(db, "battleVotes"), snapshot => {
    liveBattleVotes = snapshot.val() || defaultBattleVotes;
    renderBattles();
  });

  onValue(ref(db, "flavorSuggestions"), snapshot => {
    const data = snapshot.val();

    if (!data) {
      liveSuggestions = starterSuggestions;
    } else {
      liveSuggestions = Object.values(data).sort((a, b) => {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    }

    renderSuggestions();
  });

  onValue(ref(db, "stats/members"), snapshot => {
    const memberCount = $("memberCount");
    if (!memberCount) return;

    memberCount.textContent = snapshot.val() || 1;
  });
}

function setupForms() {
  document.querySelectorAll(".ajax-form").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const status = form.querySelector(".form-status");
      const formData = new FormData(form);

      if (status) status.textContent = "Sending...";

      try {
        await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (form.classList.contains("waitlist-form")) {
          await push(ref(db, "lumiList"), {
            name: formData.get("name") || "",
            email: formData.get("email") || "",
            favorite_zodiac: formData.get("favorite_zodiac") || "",
            preferred_line: formData.get("preferred_line") || "",
            createdAt: Date.now()
          });

          await update(ref(db, "stats"), {
            members: increment(1)
          });

          await push(ref(db, "notifications"), {
            type: "Waitlist Signup",
            message: `New waitlist signup: ${formData.get("email")}`,
            createdAt: Date.now()
          });
        }

        if (form.classList.contains("suggestion-form")) {
          await push(ref(db, "flavorSuggestions"), {
            name: formData.get("name") || "",
            email: formData.get("email") || "",
            zodiac: formData.get("zodiac") || "Community Idea",
            flavor: formData.get("flavor") || "New Flavor Idea",
            ingredient: formData.get("ingredient") || "",
            message: formData.get("message") || formData.get("ingredient") || "Submitted by the LumiSips community.",
            createdAt: Date.now()
          });

          await push(ref(db, "notifications"), {
            type: "Flavor Suggestion",
            message: `New flavor idea: ${formData.get("flavor")}`,
            createdAt: Date.now()
          });
        }

        if (!form.classList.contains("waitlist-form") && !form.classList.contains("suggestion-form")) {
          await push(ref(db, "messages"), {
            name: formData.get("name") || "",
            email: formData.get("email") || "",
            subject: formData.get("subject") || "",
            message: formData.get("message") || "",
            createdAt: Date.now()
          });

          await push(ref(db, "notifications"), {
            type: "Contact Message",
            message: `New contact message from ${formData.get("email")}`,
            createdAt: Date.now()
          });
        }

        if (status) status.textContent = form.dataset.success || "Sent successfully.";
        sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
        form.reset();

      } catch (error) {
        console.error("Form error:", error);
        if (status) status.textContent = "Connection error. Please try again.";
      }
    });
  });
}

function setupUI() {
  const navLinks = $("navLinks");
  const menuToggle = $("menuToggle");

  if (menuToggle && navLinks) {
    menuToggle.onclick = () => navLinks.classList.toggle("show");
  }

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.onclick = () => navLinks?.classList.remove("show");
  });

  const backTop = $("backTop");

  window.addEventListener("scroll", () => {
    const progress = $("scrollProgress");
    const scrolled = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;

    if (progress) progress.style.width = scrolled + "%";
    if (backTop) backTop.style.display = window.scrollY > 600 ? "grid" : "none";
  });

  if (backTop) {
    backTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("mousemove", e => {
    const glow = $("mouseGlow");
    if (!glow) return;

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  setTimeout(hideLoader, 900);
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("show");

      if (entry.target.id === "lab") {
        document.querySelectorAll(".progress-item").forEach(item => {
          const bar = item.querySelector("i");
          if (bar) bar.style.width = item.dataset.progress + "%";
        });
      }

      if (entry.target.classList.contains("counters-section")) {
        document.querySelectorAll("[data-count]").forEach(counter => {
          if (counter.dataset.done) return;

          counter.dataset.done = "true";
          const target = Number(counter.dataset.count);
          const suffix = counter.dataset.suffix || "";
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 45));

          const timer = setInterval(() => {
            current += step;

            if (current >= target) {
              current = target;
              clearInterval(timer);
            }

            counter.textContent = current + suffix;
          }, 28);
        });
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function setupStars() {
  const canvas = $("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    stars = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6,
      s: Math.random() * 0.6 + 0.2
    }));
  }

  resize();
  addEventListener("resize", resize);

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    stars.forEach(star => {
      ctx.globalAlpha = Math.random();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      star.y += star.s;
      if (star.y > canvas.height) star.y = 0;
    });

    requestAnimationFrame(drawStars);
  }

  drawStars();
}

function sparkleBurst(x, y) {
  const layer = $("sparkleLayer");
  if (!layer) return;

  const sparkles = ["✨", "💫", "⭐", "🫧", "💥"];

  for (let i = 0; i < 16; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = `${x + (Math.random() * 130 - 65)}px`;
    sparkle.style.top = `${y + (Math.random() * 90 - 45)}px`;
    layer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 900);
  }
}

async function startLumiSips() {
  try {
    await seedDatabaseOnce();

    renderZodiac();
    renderVotes();
    renderLeaderboard();
    renderBattles();
    renderSuggestions();
    renderTimeline();

    setupUI();
    setupForms();
    setupLiveListeners();
    setupRevealAnimations();
    setupStars();

  } catch (error) {
    console.error("Startup error:", error);
    hideLoader();
  }
}

startLumiSips();
