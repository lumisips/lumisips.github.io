import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  runTransaction,
  get,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUserVote = null;
let latestVotes = {};

const zodiacFlavors = [
  { sign: "Aries", symbol: "ARIES", flavor: "Blood Orange Mango Heat" },
  { sign: "Taurus", symbol: "TAURUS", flavor: "Honeydew Pear Vanilla" },
  { sign: "Gemini", symbol: "GEMINI", flavor: "Lemon Lime Blueberry" },
  { sign: "Cancer", symbol: "CANCER", flavor: "Blue Raspberry Dragon Fruit Hibiscus" },
  { sign: "Leo", symbol: "LEO", flavor: "Pineapple Passion Fruit" },
  { sign: "Virgo", symbol: "VIRGO", flavor: "Cucumber Green Apple Mint" },
  { sign: "Libra", symbol: "LIBRA", flavor: "Strawberry Rose Lemonade" },
  { sign: "Scorpio", symbol: "SCORPIO", flavor: "Black Cherry Pomegranate" },
  { sign: "Sagittarius", symbol: "SAGITTARIUS", flavor: "Kiwi Black Cherry" },
  { sign: "Capricorn", symbol: "CAPRICORN", flavor: "Sour Watermelon Strawberry" },
  { sign: "Aquarius", symbol: "AQUARIUS", flavor: "Blueberry Lavender Citrus" },
  { sign: "Pisces", symbol: "PISCES", flavor: "Peach Dragon Fruit Lychee" }
];

getRedirectResult(auth).catch(error => {
  console.error("Redirect error:", error);
});

window.signInWithGoogle = async function () {
  await signInWithRedirect(auth, provider);
};

window.logOut = async function () {
  await signOut(auth);
};

function renderCollection() {
  const grid = document.getElementById("collectionGrid");
  if (!grid) return;

  grid.innerHTML = "";

  zodiacFlavors.forEach(item => {
    const card = document.createElement("div");
    card.className = "zodiac-card";

    card.innerHTML = `
      <div class="symbol">${item.symbol}</div>
      <h3>${item.sign}</h3>
      <p>${item.flavor}</p>
      <p><strong>Coming Soon</strong></p>
    `;

    grid.appendChild(card);
  });
}

function renderZodiacs(votes = {}) {
  const grid = document.getElementById("zodiacGrid");
  if (!grid) return;

  grid.innerHTML = "";

  zodiacFlavors.forEach(item => {
    const count = votes[item.sign] || 0;
    const hasVoted = currentUserVote !== null;

    const card = document.createElement("div");
    card.className = "zodiac-card";

    card.innerHTML = `
      <div class="symbol">${item.symbol}</div>
      <h3>${item.sign}</h3>
      <p>${item.flavor}</p>
      <button class="vote-btn" onclick="vote('${item.sign}')" ${hasVoted ? "disabled" : ""}>
        ${
          currentUserVote === item.sign
            ? "Your Vote"
            : hasVoted
            ? "Vote Locked"
            : "Vote For " + item.sign
        }
      </button>
      <div class="vote-count">${count} Votes</div>
    `;

    grid.appendChild(card);
  });
}

window.vote = async function (sign) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in with Google before voting.");
    return;
  }

  const userVoteRef = ref(db, `userVotes/${user.uid}`);
  const existingVote = await get(userVoteRef);

  if (existingVote.exists()) {
    currentUserVote = existingVote.val();
    renderZodiacs(latestVotes);
    alert("You already voted for " + existingVote.val() + ".");
    return;
  }

  await set(userVoteRef, sign);

  const voteRef = ref(db, "votes/" + sign);

  await runTransaction(voteRef, current => {
    return (current || 0) + 1;
  });

  currentUserVote = sign;
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
  if (message) {
    message.textContent = "Welcome to the LumiList!";
  }
};

onAuthStateChanged(auth, async user => {
  const authBox = document.getElementById("authBox");

  if (user) {
    const voteSnap = await get(ref(db, `userVotes/${user.uid}`));
    currentUserVote = voteSnap.exists() ? voteSnap.val() : null;

    if (authBox) {
      authBox.innerHTML = `
        <p>Signed in as <strong>${user.displayName || user.email}</strong></p>
        <button type="button" onclick="logOut()">Log Out</button>
      `;
    }
  } else {
    currentUserVote = null;

    if (authBox) {
      authBox.innerHTML = `
        <button type="button" onclick="signInWithGoogle()">Sign In With Google To Vote</button>
      `;
    }
  }

  renderZodiacs(latestVotes);
});

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
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <p><strong>${item.name}</strong> suggested a flavor for <strong>${item.zodiac}</strong></p>
      <p><strong>Flavor:</strong> ${item.flavor_idea}</p>
      <p>${item.comment}</p>
      <p style="opacity:.6;">${item.date}</p>
    `;

    comments.appendChild(div);
  });
});

onValue(ref(db, "lumiList"), snapshot => {
  const data = snapshot.val() || {};
  const memberTotal = document.getElementById("memberTotal");
  if (memberTotal) memberTotal.textContent = Object.keys(data).length;
});

function renderLeaderboard(votes) {
  const board = document.getElementById("leaderboardList");
  if (!board) return;

  board.innerHTML = "";

  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    board.innerHTML = `<p>No votes yet. Be the first to vote.</p>`;
    return;
  }

  sorted.forEach(([sign, count], index) => {
    const div = document.createElement("div");
    div.className = "comment";

    let medal = "";
    if (index === 0) medal = "1st";
    if (index === 1) medal = "2nd";
    if (index === 2) medal = "3rd";

    div.innerHTML = `
      <h3>${medal} ${sign}</h3>
      <p>${count} votes</p>
    `;

    board.appendChild(div);
  });
}

renderCollection();
renderZodiacs();
