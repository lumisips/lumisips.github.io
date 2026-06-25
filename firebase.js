import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  get,
  set,
  onValue,
  update,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW_HC9OVcpkLc4TFY6MR8brufTPniwXEg",
  authDomain: "lumisips-b280f.firebaseapp.com",
  databaseURL: "https://lumisips-b280f-default-rtdb.firebaseio.com",
  projectId: "lumisips-b280f",
  storageBucket: "lumisips-b280f.firebasestorage.app",
  messagingSenderId: "980927514380",
  appId: "1:980927514380:web:5e92f1aeb27ba46a9eeb29"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

const defaultVotes = {
  Aries: { count: 12 },
  Taurus: { count: 8 },
  Gemini: { count: 15 },
  Leo: { count: 21 },
  Virgo: { count: 12 },
  Libra: { count: 10 },
  Scorpio: { count: 18 },
  Sagittarius: { count: 9 },
  Capricorn: { count: 24 },
  Aquarius: { count: 11 },
  Pisces: { count: 14 }
};

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

function clean(v){
  return v || "Not provided";
}

function sparkleBurst(x,y){
  const layer = document.getElementById("sparkleLayer");
  if(!layer) return;

  const sparkles = ["✨","💫","⭐","🫧","💥"];

  for(let i = 0; i < 16; i++){
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = `${x + (Math.random() * 130 - 65)}px`;
    sparkle.style.top = `${y + (Math.random() * 90 - 45)}px`;
    layer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 900);
  }
}

function renderZodiac(){
  const grid = document.getElementById("zodiacGrid");
  if(!grid) return;

  grid.innerHTML = zodiacSigns.map(([name,symbol,flavor,status]) => `
    <div class="card ${status === "flagship" ? "flagship" : ""} ${status === "active" ? "active-development" : ""}">
      <h3>${symbol} ${name}</h3>
      <p>${flavor}</p>
      <span class="badge">${
        status === "flagship" ? "Flagship Locked" :
        status === "active" ? "Early Development" :
        "Coming Soon"
      }</span>
    </div>
  `).join("");
}

function renderVoteCards(votes = defaultVotes){
  const grid = document.getElementById("voteGrid");
  const message = document.getElementById("voteMessage");
  if(!grid) return;

  const hasVoted = localStorage.getItem("lumisipsHasVotedZodiac") === "true";

  grid.innerHTML = zodiacSigns
    .filter(sign => sign[0] !== "Cancer")
    .map(([name,symbol]) => {
      const value = typeof votes[name] === "number" ? votes[name] : votes[name]?.count || 0;

      return `
        <div class="card">
          <h3>${symbol} ${name}</h3>
          <p>Votes: <b>${value}</b></p>
          <button class="btn primary zodiac-vote-btn" data-sign="${name}" ${hasVoted ? "disabled" : ""}>
            ${hasVoted ? "Vote Locked" : `Vote ${symbol}`}
          </button>
        </div>
      `;
    }).join("");

  if(hasVoted && message){
    message.textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
  }
}

function renderLeaderboard(votes = defaultVotes){
  const box = document.getElementById("leaderboardList");
  if(!box) return;

  const ranked = zodiacSigns.map(([name,symbol]) => {
    const value = typeof votes[name] === "number" ? votes[name] : votes[name]?.count || 0;

    return {
      name,
      symbol,
      votes: name === "Cancer" ? "Flagship Locked" : value,
      locked: name === "Cancer"
    };
  }).sort((a,b) => {
    if(a.locked) return -1;
    if(b.locked) return 1;
    return b.votes - a.votes;
  });

  box.innerHTML = ranked.map((x,i) => `
    <div class="leaderboard-row ${x.locked ? "flagship" : ""}">
      <span>${i + 1}. ${x.symbol} ${x.name}</span>
      <b>${x.votes}</b>
    </div>
  `).join("");
}

function renderBattles(data = defaultBattleVotes){
  const grid = document.getElementById("battleGrid");
  if(!grid) return;

  const finalData = data && Object.keys(data).length ? data : defaultBattleVotes;

  grid.innerHTML = battles.map(battle => {
    const current = finalData[battle.key] || defaultBattleVotes[battle.key] || {};
    const leftVotes = current[battle.left] || 0;
    const rightVotes = current[battle.right] || 0;
    const total = leftVotes + rightVotes || 1;

    const leftPercent = Math.round((leftVotes / total) * 100);
    const rightPercent = Math.round((rightVotes / total) * 100);

    const votedChoice = localStorage.getItem(`lumisipsVotedBattle_${battle.key}`);
    const locked = Boolean(votedChoice);

    let winner = "Tie";
    if(leftVotes > rightVotes) winner = battle.left;
    if(rightVotes > leftVotes) winner = battle.right;

    return `
      <div class="battle-card">
        <div class="battle-header">
          <h3>${battle.left} vs ${battle.right}</h3>
          <span class="winner-badge">👑 ${winner}</span>
        </div>

        <div class="battle-matchup">
          <button type="button" class="battle-option ${locked ? "locked" : ""}" data-battle="${battle.key}" data-choice="${battle.left}" ${locked ? "disabled" : ""}>
            <div class="option-emoji">${battle.leftIcon}</div>
            <div class="option-name">${battle.left}</div>
            <div class="option-votes">${leftVotes} votes • ${leftPercent}%</div>
            <div class="health-bar"><span style="width:${leftPercent}%"></span></div>
            <div class="pick-locked">${votedChoice === battle.left ? "Your pick is locked." : ""}</div>
          </button>

          <div class="vs-orb">VS</div>

          <button type="button" class="battle-option ${locked ? "locked" : ""}" data-battle="${battle.key}" data-choice="${battle.right}" ${locked ? "disabled" : ""}>
            <div class="option-emoji">${battle.rightIcon}</div>
            <div class="option-name">${battle.right}</div>
            <div class="option-votes">${rightVotes} votes • ${rightPercent}%</div>
            <div class="health-bar"><span style="width:${rightPercent}%"></span></div>
            <div class="pick-locked">${votedChoice === battle.right ? "Your pick is locked." : ""}</div>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function voteZodiac(sign){
  const message = document.getElementById("voteMessage");

  if(localStorage.getItem("lumisipsHasVotedZodiac") === "true"){
    if(message) message.textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
    return;
  }

  update(ref(db, `votes/${sign}`), {
    count: increment(1)
  });

  localStorage.setItem("lumisipsHasVotedZodiac", "true");

  if(message) message.textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";

  sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
}

function voteBattle(key, choice, event){
  if(localStorage.getItem(`lumisipsVotedBattle_${key}`)) return;

  update(ref(db, `battleVotes/${key}`), {
    [choice]: increment(1)
  });

  localStorage.setItem(`lumisipsVotedBattle_${key}`, choice);

  if(event?.currentTarget){
    event.currentTarget.classList.add("selected");
    const rect = event.currentTarget.getBoundingClientRect();
    sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
}

function renderSuggestions(){
  const grid = document.getElementById("suggestionGrid");
  if(!grid) return;

  onValue(ref(db, "flavorSuggestions"), snap => {
    const data = snap.val();

    if(!data){
      grid.innerHTML = `
        <div class="card">
          <span>Community Idea</span>
          <h3>No flavor suggestions yet</h3>
          <p>Submit the first LumiSips flavor idea.</p>
        </div>
      `;
      return;
    }

    const suggestions = Object.values(data).reverse();

    grid.innerHTML = suggestions.map(item => `
      <div class="card">
        <span>${clean(item.zodiac)}</span>
        <h3>${clean(item.flavor)}</h3>
        <p>${clean(item.message || item.ingredient)}</p>
      </div>
    `).join("");
  });
}

function renderTimeline(){
  const box = document.getElementById("timeline");
  if(!box) return;

  const items = [
    "Idea Created","LLC Approved","EIN Received","Business Bank Account Opened",
    "Seller’s Permit Obtained","D-U-N-S Number Approved","Cancer Formula Advanced",
    "Bulk Batch Development Started","Taurus Citrus Development Added","Website Community Launched",
    "Pre-Launch Development Phase","Official Launch"
  ];

  box.innerHTML = items.map(item => `
    <div class="timeline-item"><h3>${item}</h3></div>
  `).join("");
}

async function seedDatabaseSafely(){
  try{
    const battleSnap = await get(ref(db, "battleVotes"));
    if(!battleSnap.exists()){
      await set(ref(db, "battleVotes"), defaultBattleVotes);
    }
  }catch(error){
    console.log("Battle seed skipped:", error);
  }

  try{
    const voteSnap = await get(ref(db, "votes"));
    if(!voteSnap.exists()){
      await set(ref(db, "votes"), defaultVotes);
    }
  }catch(error){
    console.log("Vote seed skipped:", error);
  }
}

function setupFirebaseListeners(){
  onValue(ref(db, "votes"), snap => {
    const votes = snap.val() || defaultVotes;
    renderVoteCards(votes);
    renderLeaderboard(votes);
  }, () => {
    renderVoteCards(defaultVotes);
    renderLeaderboard(defaultVotes);
  });

  onValue(ref(db, "battleVotes"), snap => {
    const data = snap.val() || defaultBattleVotes;
    renderBattles(data);
  }, () => {
    renderBattles(defaultBattleVotes);
  });

  onValue(ref(db, "lumiList"), snap => {
    const data = snap.val() || {};
    const count = Object.keys(data).length;
    const memberCount = document.getElementById("memberCount");
    if(memberCount) memberCount.textContent = count || 1;
  });
}

function setupClicks(){
  document.addEventListener("click", event => {
    const zodiacBtn = event.target.closest(".zodiac-vote-btn");
    if(zodiacBtn){
      voteZodiac(zodiacBtn.dataset.sign);
      return;
    }

    const battleBtn = event.target.closest(".battle-option");
    if(battleBtn && !battleBtn.disabled){
      voteBattle(battleBtn.dataset.battle, battleBtn.dataset.choice, event);
    }
  });
}

function setupForms(){
  document.querySelectorAll(".ajax-form").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const status = form.querySelector(".form-status");
      if(status) status.textContent = "Sending...";

      const formData = new FormData(form);
      const formType = formData.get("form_type");

      try{
        if(form.classList.contains("waitlist-form")){
          await push(ref(db, "lumiList"), {
            name: formData.get("name"),
            email: formData.get("email"),
            zodiac: formData.get("favorite_zodiac"),
            preferred_line: formData.get("preferred_line"),
            date: new Date().toLocaleString()
          });
        }

        if(form.classList.contains("suggestion-form")){
          await push(ref(db, "flavorSuggestions"), {
            name: formData.get("name"),
            email: formData.get("email"),
            zodiac: formData.get("zodiac"),
            flavor: formData.get("flavor"),
            ingredient: formData.get("ingredient"),
            message: formData.get("message"),
            date: new Date().toLocaleString()
          });
        }

        if(formType === "Contact Form"){
          await push(ref(db, "messages"), {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            date: new Date().toLocaleString()
          });
        }

        if(status) status.textContent = form.dataset.success || "Submitted.";
        sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
        form.reset();

      }catch(error){
        if(status) status.textContent = "Connection error. Please try again.";
      }
    });
  });
}

function setupUI(){
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");

  if(menuToggle && navLinks){
    menuToggle.onclick = () => navLinks.classList.toggle("show");
  }

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.onclick = () => navLinks?.classList.remove("show");
  });

  const backTop = document.getElementById("backTop");

  if(backTop){
    backTop.onclick = () => scrollTo({top:0, behavior:"smooth"});
  }

  window.addEventListener("scroll", () => {
    const progress = document.getElementById("scrollProgress");

    if(progress){
      const scrolled = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
      progress.style.width = scrolled + "%";
    }

    if(backTop) backTop.style.display = window.scrollY > 600 ? "grid" : "none";
  });
}

function setupRevealAnimations(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("show");

        if(entry.target.id === "lab"){
          document.querySelectorAll(".progress-item").forEach(item => {
            const bar = item.querySelector("i");
            if(bar) bar.style.width = item.dataset.progress + "%";
          });
        }

        if(entry.target.classList.contains("counters-section")){
          document.querySelectorAll("[data-count]").forEach(counter => {
            if(counter.dataset.done) return;
            counter.dataset.done = "true";

            const target = Number(counter.dataset.count);
            const suffix = counter.dataset.suffix || "";
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 45));

            const timer = setInterval(() => {
              current += step;

              if(current >= target){
                current = target;
                clearInterval(timer);
              }

              counter.textContent = current + suffix;
            }, 28);
          });
        }
      }
    });
  }, {threshold:.18});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function setupStars(){
  const canvas = document.getElementById("stars");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    stars = Array.from({length:130}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6,
      s: Math.random() * .6 + .2
    }));
  }

  function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";

    stars.forEach(star => {
      ctx.globalAlpha = Math.random();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      star.y += star.s;
      if(star.y > canvas.height) star.y = 0;
    });

    requestAnimationFrame(drawStars);
  }

  resize();
  addEventListener("resize", resize);
  drawStars();
}

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if(loader) loader.style.display = "none";
  }, 900);
});

function start(){
  renderZodiac();
  renderTimeline();
  renderSuggestions();

  renderVoteCards(defaultVotes);
  renderLeaderboard(defaultVotes);
  renderBattles(defaultBattleVotes);

  setupFirebaseListeners();
  setupClicks();
  setupForms();
  setupUI();
  setupRevealAnimations();
  setupStars();

  seedDatabaseSafely();
}

start();
