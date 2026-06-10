const zodiacSigns = [
  { sign: "Aries", symbol: "♈", flavor: "TBD" },
  { sign: "Taurus", symbol: "♉", flavor: "TBD" },
  { sign: "Gemini", symbol: "♊", flavor: "TBD" },
  { sign: "Cancer", symbol: "♋", flavor: "Blue Raspberry • Dragon Fruit • Hibiscus", locked: true },
  { sign: "Leo", symbol: "♌", flavor: "TBD" },
  { sign: "Virgo", symbol: "♍", flavor: "TBD" },
  { sign: "Libra", symbol: "♎", flavor: "TBD" },
  { sign: "Scorpio", symbol: "♏", flavor: "TBD" },
  { sign: "Sagittarius", symbol: "♐", flavor: "TBD" },
  { sign: "Capricorn", symbol: "♑", flavor: "TBD" },
  { sign: "Aquarius", symbol: "♒", flavor: "TBD" },
  { sign: "Pisces", symbol: "♓", flavor: "TBD" }
];

const battles = [
  ["Glass Bottles", "Aluminum Cans"],
  ["Still Hydration", "Sparkling Hydration"],
  ["Energy", "Sparkling Energy"],
  ["Blue Raspberry", "Watermelon"],
  ["Dragon Fruit", "Passion Fruit"]
];

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});

function getVotes() {
  return JSON.parse(localStorage.getItem("lumisipsVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("lumisipsVotes", JSON.stringify(votes));
}

function getBattleVotes() {
  return JSON.parse(localStorage.getItem("lumisipsBattleVotes")) || {};
}

function saveBattleVotes(votes) {
  localStorage.setItem("lumisipsBattleVotes", JSON.stringify(votes));
}

function renderZodiacGrid() {
  const grid = document.getElementById("zodiacGrid");
  grid.innerHTML = "";

  zodiacSigns.forEach(item => {
    const card = document.createElement("div");
    card.className = item.locked ? "zodiac-card flagship" : "zodiac-card";

    card.innerHTML = `
      <h3>${item.symbol} ${item.sign}</h3>
      <p>${item.flavor}</p>
      ${item.locked ? "<span class='badge'>Flagship Locked</span>" : "<span class='badge'>Coming Soon</span>"}
    `;

    grid.appendChild(card);
  });
}

function renderVoteGrid() {
  const grid = document.getElementById("voteGrid");
  const votes = getVotes();
  grid.innerHTML = "";

  zodiacSigns
    .filter(item => !item.locked)
    .forEach(item => {
      if (!votes[item.sign]) votes[item.sign] = 0;

      const card = document.createElement("div");
      card.className = "vote-card";

      card.innerHTML = `
        <h3>${item.symbol} ${item.sign}</h3>
        <p>Votes: <strong>${votes[item.sign]}</strong></p>
        <button class="btn primary" onclick="voteForZodiac('${item.sign}')">Vote ${item.symbol}</button>
      `;

      grid.appendChild(card);
    });

  saveVotes(votes);
}

function voteForZodiac(sign) {
  const votes = getVotes();
  votes[sign] = (votes[sign] || 0) + 1;
  saveVotes(votes);

  document.getElementById("voteMessage").textContent = `Your vote for ${sign} has been counted.`;
  renderVoteGrid();
  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboardList");
  const votes = getVotes();

  const ranked = zodiacSigns
    .map(item => ({
      ...item,
      votes: item.locked ? "Flagship Locked" : votes[item.sign] || 0
    }))
    .sort((a, b) => {
      if (a.locked) return -1;
      if (b.locked) return 1;
      return b.votes - a.votes;
    });

  container.innerHTML = "";

  ranked.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = item.locked ? "leaderboard-row flagship" : "leaderboard-row";

    row.innerHTML = `
      <span>${index + 1}. ${item.symbol} ${item.sign}</span>
      <strong>${item.votes}</strong>
    `;

    container.appendChild(row);
  });
}

function renderBattles() {
  const grid = document.getElementById("battleGrid");
  const battleVotes = getBattleVotes();
  grid.innerHTML = "";

  battles.forEach((battle, index) => {
    const [optionA, optionB] = battle;
    const key = `battle-${index}`;

    if (!battleVotes[key]) {
      battleVotes[key] = {
        [optionA]: 0,
        [optionB]: 0
      };
    }

    const aVotes = battleVotes[key][optionA];
    const bVotes = battleVotes[key][optionB];

    let winner = "Tie";
    if (aVotes > bVotes) winner = optionA;
    if (bVotes > aVotes) winner = optionB;

    const card = document.createElement("div");
    card.className = "battle-card";

    card.innerHTML = `
      <h3>${optionA} vs ${optionB}</h3>
      <p>${optionA}: <strong>${aVotes}</strong></p>
      <p>${optionB}: <strong>${bVotes}</strong></p>
      <p>Winner: <strong>${winner}</strong></p>
      <button class="btn secondary" onclick="voteBattle('${key}', '${optionA}')">${optionA}</button>
      <button class="btn primary" onclick="voteBattle('${key}', '${optionB}')">${optionB}</button>
    `;

    grid.appendChild(card);
  });

  saveBattleVotes(battleVotes);
}

function voteBattle(key, option) {
  const battleVotes = getBattleVotes();

  if (!battleVotes[key]) {
    battleVotes[key] = {};
  }

  battleVotes[key][option] = (battleVotes[key][option] || 0) + 1;
  saveBattleVotes(battleVotes);
  renderBattles();
}

function animateProgressBars() {
  const items = document.querySelectorAll(".progress-item");

  items.forEach(item => {
    const progress = item.getAttribute("data-progress");
    const bar = item.querySelector(".progress-bar div");

    setTimeout(() => {
      bar.style.width = `${progress}%`;
    }, 300);
  });
}

function initFoundingMembers() {
  const countElement = document.getElementById("memberCount");
  const savedCount = localStorage.getItem("lumisipsFoundingMembers");

  if (savedCount) {
    countElement.textContent = savedCount;
  } else {
    localStorage.setItem("lumisipsFoundingMembers", "128");
  }
}

renderZodiacGrid();
renderVoteGrid();
renderLeaderboard();
renderBattles();
animateProgressBars();
initFoundingMembers();
