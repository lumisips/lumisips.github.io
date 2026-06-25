function initLumiSips(){
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));

  const loader = document.getElementById("loader");
  if(loader) loader.remove();

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

  const votes = {
    Aries:12, Taurus:8, Gemini:15, Leo:21, Virgo:12, Libra:10,
    Scorpio:18, Sagittarius:9, Capricorn:24, Aquarius:11, Pisces:14
  };

  const zodiacGrid = document.getElementById("zodiacGrid");
  if(zodiacGrid){
    zodiacGrid.innerHTML = zodiacSigns.map(([name,symbol,flavor,status]) => `
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

  const voteGrid = document.getElementById("voteGrid");
  if(voteGrid){
    const voted = localStorage.getItem("zodiacVoteLocked");
    voteGrid.innerHTML = zodiacSigns.filter(z => z[0] !== "Cancer").map(([name,symbol]) => `
      <div class="card">
        <h3>${symbol} ${name}</h3>
        <p>Votes: <b>${votes[name] || 0}</b></p>
        <button class="btn primary" onclick="localStorage.setItem('zodiacVoteLocked','true'); this.textContent='Vote Locked'; this.disabled=true;">
          ${voted ? "Vote Locked" : `Vote ${symbol}`}
        </button>
      </div>
    `).join("");
  }

  const leaderboard = document.getElementById("leaderboardList");
  if(leaderboard){
    const ranked = zodiacSigns.map(([name,symbol]) => ({
      name,
      symbol,
      votes: name === "Cancer" ? "Flagship Locked" : votes[name],
      locked: name === "Cancer"
    })).sort((a,b)=>{
      if(a.locked) return -1;
      if(b.locked) return 1;
      return b.votes - a.votes;
    });

    leaderboard.innerHTML = ranked.map((x,i) => `
      <div class="leaderboard-row ${x.locked ? "flagship" : ""}">
        <span>${i + 1}. ${x.symbol} ${x.name}</span>
        <b>${x.votes}</b>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-count]").forEach(el=>{
    el.textContent = el.dataset.count + (el.dataset.suffix || "");
  });

  document.querySelectorAll(".progress-item").forEach(item=>{
    const bar = item.querySelector("i");
    if(bar) bar.style.width = item.dataset.progress + "%";
  });

  const suggestionGrid = document.getElementById("suggestionGrid");
  if(suggestionGrid){
    suggestionGrid.innerHTML = `
      <div class="card">
        <span>Taurus ♉</span>
        <h3>Lemon Orange Citrus</h3>
        <p>Bright, refreshing citrus hydration with a clean finish.</p>
      </div>
      <div class="card">
        <span>Capricorn ♑</span>
        <h3>Sour Watermelon Strawberry</h3>
        <p>A bold sour candy-inspired hydration flavor.</p>
      </div>
      <div class="card">
        <span>Leo ♌</span>
        <h3>Pineapple Passion Fruit</h3>
        <p>Tropical, bright, loud, and summer-focused.</p>
      </div>
    `;
  }

  const timeline = document.getElementById("timeline");
  if(timeline){
    const items = [
      "Idea Created","LLC Approved","EIN Received","Business Bank Account Opened",
      "Seller’s Permit Obtained","D-U-N-S Number Approved","Cancer Formula Advanced",
      "Bulk Batch Development Started","Taurus Citrus Development Added","Website Community Launched",
      "Pre-Launch Development Phase","Official Launch"
    ];

    timeline.innerHTML = items.map(item => `
      <div class="timeline-item"><h3>${item}</h3></div>
    `).join("");
  }

  const battleGrid = document.getElementById("battleGrid");
  if(battleGrid){
    const battles = [
      ["Glass Bottles","Aluminum Cans","🧊","🥤",18,12],
      ["Still Hydration","Sparkling Hydration","💧","✨",10,22],
      ["Energy","Sparkling Energy","⚡","🔋",16,26],
      ["Blue Raspberry","Watermelon","🫐","🍉",30,19],
      ["Dragon Fruit","Passion Fruit","🐉","🌺",24,21]
    ];

    battleGrid.innerHTML = `
      <div style="text-align:center;margin-bottom:25px;">
        <button class="btn secondary" onclick="localStorage.clear(); location.reload();">
          Reset My Arena Picks
        </button>
      </div>
      ${battles.map((b,i)=>{
        const total = b[4] + b[5];
        const l = Math.round((b[4] / total) * 100);
        const r = Math.round((b[5] / total) * 100);
        const picked = localStorage.getItem("battle_" + i);

        return `
          <div class="battle-card">
            <div class="battle-header">
              <h3>${b[0]} vs ${b[1]}</h3>
              <span class="winner-badge">👑 ${b[4] > b[5] ? b[0] : b[1]}</span>
            </div>

            <div class="battle-matchup">
              <div class="battle-option" onclick="localStorage.setItem('battle_${i}','${b[0]}'); this.querySelector('.pick-locked').textContent='Your pick is locked.';">
                <div class="option-emoji">${b[2]}</div>
                <div class="option-name">${b[0]}</div>
                <div class="option-votes">${b[4]} votes • ${l}%</div>
                <div class="health-bar"><span style="width:${l}%"></span></div>
                <div class="pick-locked">${picked === b[0] ? "Your pick is locked." : "Tap to choose"}</div>
              </div>

              <div class="vs-orb">VS</div>

              <div class="battle-option" onclick="localStorage.setItem('battle_${i}','${b[1]}'); this.querySelector('.pick-locked').textContent='Your pick is locked.';">
                <div class="option-emoji">${b[3]}</div>
                <div class="option-name">${b[1]}</div>
                <div class="option-votes">${b[5]} votes • ${r}%</div>
                <div class="health-bar"><span style="width:${r}%"></span></div>
                <div class="pick-locked">${picked === b[1] ? "Your pick is locked." : "Tap to choose"}</div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    `;
  }
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initLumiSips);
} else {
  initLumiSips();
}
