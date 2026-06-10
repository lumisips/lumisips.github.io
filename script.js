window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").style.display = "none", 900);
});

const themes = [
  ["#00eaff","#246bff","#ff4fd8"],
  ["#0077ff","#00eaff","#7c3cff"],
  ["#9b4dff","#00eaff","#ff4fd8"],
  ["#ff4fd8","#9b4dff","#00eaff"],
  ["#21b8ff","#006eff","#b45cff"],
  ["#ff4fd8","#ff7bdc","#00eaff"],
  ["#b45cff","#ff4fd8","#5be7ff"]
];

function applyRandomTheme(){
  const theme = themes[Math.floor(Math.random() * themes.length)];
  document.documentElement.style.setProperty("--accent", theme[0]);
  document.documentElement.style.setProperty("--accent2", theme[1]);
  document.documentElement.style.setProperty("--accent3", theme[2]);
}
applyRandomTheme();

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
  Aries: 12, Taurus: 8, Gemini: 15, Leo: 21, Virgo: 7, Libra: 10,
  Scorpio: 18, Sagittarius: 9, Capricorn: 24, Aquarius: 11, Pisces: 14
};

const flavorSuggestions = [
  { zodiac: "Taurus ♉", flavor: "Lemon Orange Citrus", note: "Bright, refreshing citrus hydration with a clean finish." },
  { zodiac: "Capricorn ♑", flavor: "Sour Watermelon Strawberry", note: "A bold sour candy-inspired hydration flavor." },
  { zodiac: "Leo ♌", flavor: "Pineapple Passion Fruit", note: "Tropical, bright, loud, and summer-focused." },
  { zodiac: "Gemini ♊", flavor: "Lemon Lime Blueberry", note: "Dual citrus energy with a smooth berry finish." },
  { zodiac: "Pisces ♓", flavor: "Mango Coconut", note: "Dreamy tropical hydration concept." }
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

const timelineItems = [
  "Idea Created","LLC Approved","EIN Received","Business Bank Account Opened",
  "Seller’s Permit Obtained","D-U-N-S Number Approved","Cancer Formula Advanced",
  "Bulk Batch Development Started","Taurus Citrus Development Added","Website Community Launched",
  "Pre-Launch Development Phase","Official Launch"
];

const navLinks = document.getElementById("navLinks");
document.getElementById("menuToggle").onclick = () => navLinks.classList.toggle("show");
document.querySelectorAll(".nav-links a").forEach(a => a.onclick = () => navLinks.classList.remove("show"));

function getJSON(key, fallback){
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}
function setJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

function initializeStorage(){
  if(!localStorage.getItem("lumisipsVotes")) setJSON("lumisipsVotes", defaultVotes);
  if(!localStorage.getItem("lumisipsBattles")) setJSON("lumisipsBattles", defaultBattleVotes);
  if(!localStorage.getItem("lumisipsSuggestions")) setJSON("lumisipsSuggestions", flavorSuggestions);
  if(!localStorage.getItem("lumisipsMembers")) localStorage.setItem("lumisipsMembers", "1");
}

function renderZodiac(){
  const grid = document.getElementById("zodiacGrid");
  grid.innerHTML = "";
  zodiacSigns.forEach(([name,symbol,flavor,status])=>{
    const flagship = status === "flagship";
    const active = status === "active";

    grid.innerHTML += `
      <div class="card ${flagship ? "flagship" : ""} ${active ? "active-development" : ""}">
        <h3>${symbol} ${name}</h3>
        <p>${flavor}</p>
        <span class="badge">${
          flagship ? "Flagship Locked" :
          active ? "Early Development" :
          "Coming Soon"
        }</span>
      </div>`;
  });
}

function renderVotes(){
  const votes = getJSON("lumisipsVotes", defaultVotes);
  const hasVoted = localStorage.getItem("lumisipsHasVotedZodiac") === "true";
  const grid = document.getElementById("voteGrid");
  grid.innerHTML = "";

  zodiacSigns.filter(z=>z[0]!=="Cancer").forEach(([name,symbol])=>{
    votes[name] ??= 0;
    grid.innerHTML += `
      <div class="card">
        <h3>${symbol} ${name}</h3>
        <p>Votes: <b>${votes[name]}</b></p>
        <button class="btn primary" onclick="vote('${name}')" ${hasVoted ? "disabled" : ""}>
          ${hasVoted ? "Vote Locked" : `Vote ${symbol}`}
        </button>
      </div>`;
  });

  if(hasVoted) {
    document.getElementById("voteMessage").textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
  }

  setJSON("lumisipsVotes", votes);
}

function vote(name){
  if(localStorage.getItem("lumisipsHasVotedZodiac") === "true"){
    document.getElementById("voteMessage").textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
    return;
  }

  const votes = getJSON("lumisipsVotes", defaultVotes);
  votes[name] = (votes[name] || 0) + 1;
  setJSON("lumisipsVotes", votes);
  localStorage.setItem("lumisipsHasVotedZodiac","true");

  document.getElementById("voteMessage").textContent = "Your zodiac vote is locked. Thank you for shaping LumiSips.";
  sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
  renderVotes();
  renderLeaderboard();
}

function renderLeaderboard(){
  const votes = getJSON("lumisipsVotes", defaultVotes);

  const ranked = zodiacSigns.map(([name,symbol,flavor,status])=>({
    name,
    symbol,
    votes:name==="Cancer" ? "Flagship Locked" : votes[name] || 0,
    locked:name==="Cancer"
  })).sort((a,b)=>{
    if(a.locked) return -1;
    if(b.locked) return 1;
    return b.votes - a.votes;
  });

  document.getElementById("leaderboardList").innerHTML = ranked.map((x,i)=>`
    <div class="leaderboard-row ${x.locked ? "flagship" : ""}">
      <span>${i+1}. ${x.symbol} ${x.name}</span>
      <b>${x.votes}</b>
    </div>`).join("");
}

function renderSuggestions(){
  const suggestions = getJSON("lumisipsSuggestions", flavorSuggestions);

  document.getElementById("suggestionGrid").innerHTML = suggestions.map(item => `
    <div class="card">
      <span>${item.zodiac || "Community Idea"}</span>
      <h3>${item.flavor || "Flavor Idea"}</h3>
      <p>${item.note || "Submitted by the LumiSips community."}</p>
    </div>
  `).join("");
}

function renderBattles(){
  const data = getJSON("lumisipsBattles", defaultBattleVotes);
  const grid = document.getElementById("battleGrid");
  grid.innerHTML = "";

  battles.forEach(battle=>{
    if(!data[battle.key]) data[battle.key] = { [battle.left]:0, [battle.right]:0 };

    const leftVotes = data[battle.key][battle.left] || 0;
    const rightVotes = data[battle.key][battle.right] || 0;
    const total = leftVotes + rightVotes || 1;
    const leftPercent = Math.round((leftVotes / total) * 100);
    const rightPercent = Math.round((rightVotes / total) * 100);
    const votedChoice = localStorage.getItem(`lumisipsVotedBattle_${battle.key}`);
    const locked = Boolean(votedChoice);

    let winner = "Tie";
    if(leftVotes > rightVotes) winner = battle.left;
    if(rightVotes > leftVotes) winner = battle.right;

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
      </div>`;
  });

  setJSON("lumisipsBattles", data);
}

function battleVote(key, choice, event){
  if(localStorage.getItem(`lumisipsVotedBattle_${key}`)) return;

  const data = getJSON("lumisipsBattles", defaultBattleVotes);
  data[key][choice] = (data[key][choice] || 0) + 1;
  setJSON("lumisipsBattles", data);
  localStorage.setItem(`lumisipsVotedBattle_${key}`, choice);

  if(event && event.currentTarget){
    event.currentTarget.classList.add("selected");
    const rect = event.currentTarget.getBoundingClientRect();
    sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  setTimeout(renderBattles, 350);
}

function renderTimeline(){
  document.getElementById("timeline").innerHTML = timelineItems.map(item=>`
    <div class="timeline-item"><h3>${item}</h3></div>
  `).join("");
}

function sparkleBurst(x,y){
  const layer = document.getElementById("sparkleLayer");
  const sparkles = ["✨","💫","⭐","🫧","💥"];

  for(let i=0;i<16;i++){
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = sparkles[Math.floor(Math.random()*sparkles.length)];
    sparkle.style.left = `${x + (Math.random()*130 - 65)}px`;
    sparkle.style.top = `${y + (Math.random()*90 - 45)}px`;
    layer.appendChild(sparkle);
    setTimeout(()=>sparkle.remove(),900);
  }
}

function animateProgress(){
  document.querySelectorAll(".progress-item").forEach(item=>{
    item.querySelector("i").style.width = item.dataset.progress + "%";
  });
}

function animateCounters(){
  document.querySelectorAll("[data-count]").forEach(counter=>{
    if(counter.dataset.done) return;

    counter.dataset.done = "true";

    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || "";
    let current = 0;

    const step = Math.max(1, Math.ceil(target / 45));

    const timer = setInterval(()=>{
      current += step;

      if(current >= target){
        current = target;
        clearInterval(timer);
      }

      counter.textContent = current + suffix;
    }, 28);
  });
}

document.querySelectorAll(".true-stat-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.remove("pulse");
    void card.offsetWidth;
    card.classList.add("pulse");
  });
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      if(entry.target.id === "lab") animateProgress();
      if(entry.target.classList.contains("counters-section")) animateCounters();
    }
  });
},{threshold:.18});

document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll(".ajax-form").forEach(form=>{
  form.addEventListener("submit",async e=>{
    e.preventDefault();

    const status = form.querySelector(".form-status");
    status.textContent = "Sending...";
    const formData = new FormData(form);

    try{
      const res = await fetch(form.action,{
        method:"POST",
        body:formData,
        headers:{Accept:"application/json"}
      });

      if(res.ok){
        status.textContent = form.dataset.success;

        if(form.classList.contains("waitlist-form")){
          localStorage.setItem("lumisipsMembers", "1");
          document.getElementById("memberCount").textContent = "1";
        }

        if(form.classList.contains("suggestion-form")){
          const suggestions = getJSON("lumisipsSuggestions", flavorSuggestions);

          suggestions.unshift({
            zodiac: formData.get("zodiac") || "Community Idea",
            flavor: formData.get("flavor") || "New Flavor Idea",
            note: formData.get("message") || formData.get("ingredient") || "Submitted by the LumiSips community."
          });

          setJSON("lumisipsSuggestions", suggestions);
          renderSuggestions();
        }

        sparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
        form.reset();

      } else {
        status.textContent = "Something went wrong. Please try again.";
      }

    }catch{
      status.textContent = "Connection error. Please try again.";
    }
  });
});

window.addEventListener("scroll",()=>{
  const scrolled = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
  document.getElementById("backTop").style.display = window.scrollY > 600 ? "grid" : "none";
});

document.getElementById("backTop").onclick = () => scrollTo({top:0,behavior:"smooth"});

document.addEventListener("mousemove",e=>{
  const glow = document.getElementById("mouseGlow");
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  stars = Array.from({length:130},()=>({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.6,
    s:Math.random()*.6+.2
  }));
}

resize();
addEventListener("resize",resize);

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";

  stars.forEach(star=>{
    ctx.globalAlpha = Math.random();
    ctx.beginPath();
    ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fill();

    star.y += star.s;
    if(star.y > canvas.height) star.y = 0;
  });

  requestAnimationFrame(drawStars);
}

drawStars();

initializeStorage();
document.getElementById("memberCount").textContent = "1";
renderZodiac();
renderVotes();
renderLeaderboard();
renderBattles();
renderSuggestions();
renderTimeline();

