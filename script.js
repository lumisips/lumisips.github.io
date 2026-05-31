import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoeaqkg";

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

const zodiacFlavors = [
  { sign: "Aries", symbol: "♈", flavor: "Blood Orange Mango Heat", profile: "Bold citrus, tropical mango, light spicy finish." },
  { sign: "Taurus", symbol: "♉", flavor: "Honeydew Pear Vanilla", profile: "Smooth, sweet, mellow, soft luxury profile." },
  { sign: "Gemini", symbol: "♊", flavor: "Lemon Lime Blueberry", profile: "Bright, playful, sharp, refreshing." },
  { sign: "Cancer", symbol: "♋", flavor: "Blue Raspberry Dragon Fruit Hibiscus", profile: "Flagship flavor. Emotional, bold, blue, floral, tropical." },
  { sign: "Leo", symbol: "♌", flavor: "Pineapple Passion Fruit", profile: "Loud, tropical, golden, confident." },
  { sign: "Virgo", symbol: "♍", flavor: "Cucumber Green Apple Mint", profile: "Clean, crisp, organized, wellness-focused." },
  { sign: "Libra", symbol: "♎", flavor: "Strawberry Rose Lemonade", profile: "Balanced, pretty, romantic, lightly floral." },
  { sign: "Scorpio", symbol: "♏", flavor: "Black Cherry Pomegranate", profile: "Dark, deep, intense, slightly tart." },
  { sign: "Sagittarius", symbol: "♐", flavor: "Kiwi Black Cherry", profile: "Adventurous, bright, bold, unique." },
  { sign: "Capricorn", symbol: "♑", flavor: "Sour Watermelon Strawberry", profile: "Focused, strong, sharp, marketable." },
  { sign: "Aquarius", symbol: "♒", flavor: "Blueberry Lavender Citrus", profile: "Futuristic, smooth, floral, unexpected." },
  { sign: "Pisces", symbol: "♓", flavor: "Peach Dragon Fruit Lychee", profile: "Dreamy, soft, tropical, emotional." }
];

async function sendToFormspree(data) {
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Formspree error:", error);
  }
}

function renderZodiacs(votes = {}) {
  const grid = document.getElementById("zodiacGrid");
  if (!grid) return;

  grid.innerHTML = "";

  zodiacFlavors.forEach(item => {
    const card = document.createElement("div");
    card.className = "zodiac-card";

    card.innerHTML = `
      <div class="symbol">${item.symbol}</div>
      <h3>${item.sign}</h3>
      <p><strong>${item.flavor}</strong></p>
      <p>${item.profile}</p>
      <button class="vote-btn" onclick="vote('${item.sign}')">
        Vote For ${item.sign}
      </button>
      <div class="vote-count">${votes[item.sign] || 0} votes</div>
    `;

    grid.appendChild(card);
  });
}

window.vote = async function(sign) {
  const voteRef = ref(db, "votes/" + sign);

  await runTransaction(voteRef, currentValue => {
    return (currentValue || 0) + 1;
  });

  await sendToFormspree({
    submission_type: "Zodiac Vote",
    vote_for: sign,
    date: new Date().toLocaleString()
  });
};

onValue(ref(db, "votes"), snapshot => {
  const votes = snapshot.val() || {};
  renderZodiacs(votes);
});

window.addComment = async function() {
  const name = document.getElementById("nameInput").value.trim();
  const zodiac = document.getElementById("zodiacInput").value;
  const flavor = document.getElementById("flavorInput").value.trim();
  const comment = document.getElementById("commentInput").value.trim();

  if (!name || !zodiac || !flavor || !comment) {
    alert("Please fill out every section before submitting.");
    return;
  }

  const entry = {
    submission_type: "Flavor Suggestion",
    name,
    zodiac,
    flavor_idea: flavor,
    comment,
    date: new Date().toLocaleString()
  };

  await push(ref(db, "flavorSuggestions"), entry);
  await sendToFormspree(entry);

  document.getElementById("nameInput").value = "";
  document.getElementById("zodiacInput").value = "";
  document.getElementById("flavorInput").value = "";
  document.getElementById("commentInput").value = "";

  alert("Flavor idea submitted to LumiSips!");
};

function renderComments() {
  const commentsBox = document.getElementById("comments");
  if (!commentsBox) return;

  onValue(ref(db, "flavorSuggestions"), snapshot => {
    commentsBox.innerHTML = "";

    const data = snapshot.val() || {};
    const comments = Object.values(data).reverse().slice(0, 10);

    comments.forEach(item => {
      const div = document.createElement("div");
      div.className = "comment";

      div.innerHTML = `
        <p><strong>${item.name}</strong> suggested a flavor for <strong>${item.zodiac}</strong></p>
        <p><strong>Flavor Idea:</strong> ${item.flavor_idea}</p>
        <p>${item.comment}</p>
        <p style="font-size:0.8rem; opacity:0.65;">${item.date}</p>
      `;

      commentsBox.appendChild(div);
    });
  });
}

window.joinList = async function() {
  const name = document.getElementById("joinName").value.trim();
  const email = document.getElementById("joinEmail").value.trim();
  const zodiac = document.getElementById("joinZodiac").value;
  const message = document.getElementById("joinMessage");

  if (!name || !email || !zodiac) {
    message.textContent = "Please fill out every section.";
    return;
  }

  const member = {
    submission_type: "LumiList Signup",
    name,
    email,
    zodiac,
    date: new Date().toLocaleString()
  };

  await push(ref(db, "lumiList"), member);
  await sendToFormspree(member);

  document.getElementById("joinName").value = "";
  document.getElementById("joinEmail").value = "";
  document.getElementById("joinZodiac").value = "";

  message.textContent = "You're on the LumiList. Welcome to the movement.";
};

renderZodiacs();
renderComments();
