import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  runTransaction
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

let latestVotes = {};

const zodiacFlavors = [
  { sign: "Aries", label: "♈ ARIES", flavor: "Blood Orange Mango Heat", color1: "#ff2a00", color2: "#ffb000" },
  { sign: "Taurus", label: "♉ TAURUS", flavor: "Lemon Orange Citrus", color1: "#ffb000", color2: "#ff6a00" },
  { sign: "Gemini", label: "♊ GEMINI", flavor: "Lemon Lime Blueberry", color1: "#00eaff", color2: "#ff4dff" },
  { sign: "Cancer", label: "♋ CANCER", flavor: "Blue Raspberry Dragon Fruit Hibiscus", color1: "#00aaff", color2: "#ff3cff" },
  { sign: "Leo", label: "♌ LEO", flavor: "Pineapple Passion Fruit", color1: "#ffcc00", color2: "#ff3b00" },
  { sign: "Virgo", label: "♍ VIRGO", flavor: "Cucumber Green Apple Mint", color1: "#7cff6b", color2: "#00d084" },
  { sign: "Libra", label: "♎ LIBRA", flavor: "Strawberry Rose Lemonade", color1: "#ff9ff3", color2: "#74b9ff" },
  { sign: "Scorpio", label: "♏ SCORPIO", flavor: "Black Cherry Pomegranate", color1: "#8e00ff", color2: "#ff004c" },
  { sign: "Sagittarius", label: "♐ SAGITTARIUS", flavor: "Kiwi Black Cherry", color1: "#9b5cff", color2: "#d000ff" },
  { sign: "Capricorn", label: "♑ CAPRICORN", flavor: "Strawberry Sour Watermelon", color1: "#ff2fa3", color2: "#7cff00" },
  { sign: "Aquarius", label: "♒ AQUARIUS", flavor: "Blueberry Lavender Citrus", color1: "#00f5ff", color2: "#0066ff" },
  { sign: "Pisces", label: "♓ PISCES", flavor: "Peach Dragon Fruit Lychee", color1: "#5d5cff", color2: "#00ffd5" }
];

function applyRandomZodiacTheme() {
  const theme = zodiacFlavors[Math.floor(Math.random() * zodiacFlavors.length)];

  document.documentElement.style.setProperty("--theme-one", theme.color1);
  document.documentElement.style.setProperty("--theme-two", theme.color2);
  document.body.setAttribute("data-zodiac", theme.sign);

  const hero = document.querySelector(".hero");

  if (hero && !document.querySelector(".zodiac-login-theme")) {
    hero.innerHTML += `
      <div class="zodiac-login-theme">
        <span>${theme.label.split(" ")[0]}</span>
        <p>Today's LumiSips Energy: <strong>${theme.sign}</strong></p>
        <p>${theme.flavor}</p>
      </div>
    `;
  }
}

function getDeviceVote() {
  return localStorage.getItem("lumisips_vote");
}

function setDeviceVote(sign) {
  localStorage.setItem("lumisips_vote", sign);
}

function renderCollection() {
  const grid = document.getElementById("collectionGrid");
  if (!grid) return;

  grid.innerHTML = "";

  zodiacFlavors.forEach(item => {
    grid.innerHTML += `
      <div class="zodiac-card" style="--card-one:${item.color1}; --card-two:${item.color2};">
        <div class="symbol">${item.label}</div>
        <h3>${item.sign}</h3>
        <p>${item.flavor}</p>
        <p><strong>Coming Soon</strong></p>
      </div>
    `;
  });
}

function renderZodiacs(votes = {}) {
  const grid = document.getElementById("zodiacGrid");
  if (!grid) return;

  const currentVote = getDeviceVote();
  grid.innerHTML = "";

  zodiacFlavors.forEach(item => {
    const count = votes[item.sign] || 0;
    const hasVoted = currentVote !== null;

    let buttonText = "Vote For " + item.sign;
    if (currentVote === item.sign) buttonText = "Your Vote";
    else if (hasVoted) buttonText = "Vote Locked";

    grid.innerHTML += `
      <div class="zodiac-card" style="--card-one:${item.color1}; --card-two:${item.color2};">
        <div class="symbol">${item.label}</div>
        <h3>${item.sign}</h3>
        <p>${item.flavor}</p>
        <button class="vote-btn" onclick="vote('${item.sign}')" ${hasVoted ? "disabled" : ""}>
          ${buttonText}
        </button>
        <div class="vote-count">${count} Votes</div>
      </div>
    `;
  });
}

window.vote = async function (sign) {
  const currentVote = getDeviceVote();

  if (currentVote) {
    alert("You already voted for " + currentVote + ".");
    return;
  }

  const voteRef = ref(db, "votes/" + sign);

  await runTransaction(voteRef, current => {
    return (current || 0) + 1;
  });

  setDeviceVote(sign);
  renderZodiacs(latestVotes);

  alert("Vote submitted for " + sign + "!");
};

window.addComment = async function () {
  const name = document.getElementById("nameInput")?.value.trim();
  const zodiac = document.getElementById("zodiacInput")?.value;
  const flavor = document.getElementById("flavorInput")?.value.trim();
  const comment = document.getElementById("commentInput")?.value.trim();

  if (!name || !zodiac || !flavor || !comment) {
    alert("Please complete all fields.");
    return;
  }

  await push(ref(db, "flavorSuggestions"), {
    name,
    zodiac,
    flavor_idea: flavor,
    comment,
    date: new Date().toLocaleString()
  });

  document.getElementById("nameInput").value = "";
  document.getElementById("zodiacInput").value = "";
  document.getElementById("flavorInput").value = "";
  document.getElementById("commentInput").value = "";

  alert("Flavor idea submitted!");
};

window.joinList = async function () {
  const name = document.getElementById("joinName")?.value.trim();
  const email = document.getElementById("joinEmail")?.value.trim();
  const zodiac = document.getElementById("joinZodiac")?.value;

  if (!name || !email || !zodiac) {
    alert("Please fill all fields.");
    return;
  }

  await push(ref(db, "lumiList"), {
    name,
    email,
    zodiac,
    date: new Date().toLocaleString()
  });

  document.getElementById("joinName").value = "";
  document.getElementById("joinEmail").value = "";
  document.getElementById("joinZodiac").value = "";

  const message = document.getElementById("joinMessage");
  if (message) message.textContent = "Welcome to the LumiList!";
};

function renderLeaderboard(votes) {
  const board = document.getElementById("leaderboardList");
  if (!board) return;

  const sorted = Object.entries(votes).sort((a, b) => Number(b[1]) - Number(a[1]));

  if (sorted.length === 0) {
    board.innerHTML = `<p>No votes yet. Be the first to vote.</p>`;
    return;
  }

  board.innerHTML = "";

  sorted.forEach(([sign, count], index) => {
    board.innerHTML += `
      <div class="comment">
        <h3>#${index + 1} ${sign}</h3>
        <p>${count} votes</p>
      </div>
    `;
  });
}

onValue(ref(db, "votes"), snapshot => {
  const votes = snapshot.val() || {};
  latestVotes = votes;

  renderZodiacs(votes);
  renderLeaderboard(votes);

  const totalVotes = Object.values(votes).reduce((sum, value) => {
    return sum + Number(value || 0);
  }, 0);

  const voteTotal = document.getElementById("voteTotal");
  if (voteTotal) voteTotal.textContent = totalVotes;
});

onValue(ref(db, "flavorSuggestions"), snapshot => {
  const data = snapshot.val() || {};
  const list = Object.values(data).reverse();

  const flavorTotal = document.getElementById("flavorTotal");
  if (flavorTotal) flavorTotal.textContent = list.length;

  const comments = document.getElementById("comments");
  if (!comments) return;

  comments.innerHTML = "";

  list.slice(0, 10).forEach(item => {
    comments.innerHTML += `
      <div class="comment">
        <p><strong>${item.name || "Anonymous"}</strong> suggested a flavor for <strong>${item.zodiac || "Unknown"}</strong></p>
        <p><strong>Flavor:</strong> ${item.flavor_idea || ""}</p>
        <p>${item.comment || ""}</p>
        <p style="opacity:.6;">${item.date || ""}</p>
      </div>
    `;
  });
});

onValue(ref(db, "lumiList"), snapshot => {
  const data = snapshot.val() || {};
  const memberTotal = document.getElementById("memberTotal");
  if (memberTotal) memberTotal.textContent = Object.keys(data).length;
});

const authBox = document.getElementById("authBox");
if (authBox) {
  authBox.innerHTML = `
    <p>No Google sign-in needed.</p>
    <p>Pick one flavor below. One vote per device.</p>
  `;
}

applyRandomZodiacTheme();
renderCollection();
renderZodiacs();
renderLeaderboard({});
