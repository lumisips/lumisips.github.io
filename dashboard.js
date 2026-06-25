import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

function safe(value) {
  return value || "Not provided";
}

function renderEmpty(id, text = "No data yet") {
  const box = document.getElementById(id);
  if (box) box.innerHTML = `<div class="item">${text}</div>`;
}

onValue(ref(db, "lumiList"), snapshot => {
  const data = snapshot.val() || {};
  const users = Object.values(data).reverse();

  const members = document.getElementById("members");
  if (members) members.textContent = users.length;

  const waitlist = document.getElementById("waitlist");
  if (!waitlist) return;

  if (!users.length) {
    renderEmpty("waitlist");
    return;
  }

  waitlist.innerHTML = users.map(user => `
    <div class="wait-card">
      <h3>${safe(user.name)}</h3>
      <p><strong>Email:</strong> ${safe(user.email)}</p>
      <p><strong>Zodiac:</strong> ${safe(user.zodiac || user.favorite_zodiac)}</p>
      <small>${safe(user.date || user.createdAt)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "votes"), snapshot => {
  const data = snapshot.val() || {};
  const votesBox = document.getElementById("votes");
  if (!votesBox) return;

  const votes = Object.entries(data).map(([sign, value]) => {
    const count = typeof value === "number" ? value : value?.count || 0;
    return { sign, count };
  }).sort((a, b) => b.count - a.count);

  if (!votes.length) {
    renderEmpty("votes");
    return;
  }

  votesBox.innerHTML = votes.map(v => `
    <div class="vote-row">
      <span>${v.sign}</span>
      <strong>${v.count}</strong>
    </div>
  `).join("");
});

onValue(ref(db, "flavorSuggestions"), snapshot => {
  const data = snapshot.val() || {};
  const suggestions = Object.values(data).reverse();
  const box = document.getElementById("suggestions");
  if (!box) return;

  if (!suggestions.length) {
    renderEmpty("suggestions");
    return;
  }

  box.innerHTML = suggestions.map(item => `
    <div class="wait-card">
      <h3>${safe(item.flavor)}</h3>
      <p><strong>Zodiac:</strong> ${safe(item.zodiac)}</p>
      <p><strong>Ingredient:</strong> ${safe(item.ingredient)}</p>
      <p>${safe(item.message)}</p>
      <small>${safe(item.name)} • ${safe(item.email)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "messages"), snapshot => {
  const data = snapshot.val() || {};
  const messages = Object.values(data).reverse();
  const box = document.getElementById("messages");
  if (!box) return;

  if (!messages.length) {
    renderEmpty("messages");
    return;
  }

  box.innerHTML = messages.map(msg => `
    <div class="wait-card">
      <h3>${safe(msg.subject)}</h3>
      <p>${safe(msg.message)}</p>
      <small>${safe(msg.name)} • ${safe(msg.email)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "notifications"), snapshot => {
  const data = snapshot.val() || {};
  const notes = Object.values(data).reverse();
  const box = document.getElementById("notifications");
  if (!box) return;

  if (!notes.length) {
    renderEmpty("notifications");
    return;
  }

  box.innerHTML = notes.map(note => `
    <div class="item">
      <strong>${safe(note.type)}</strong><br>
      ${safe(note.message)}
    </div>
  `).join("");
});
