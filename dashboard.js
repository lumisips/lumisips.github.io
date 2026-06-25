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

const clean = value => value || "Not provided";

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function empty(id, text) {
  setHTML(id, `<div class="item">${text}</div>`);
}

onValue(ref(db, "lumiList"), snap => {
  const data = snap.val() || {};
  const users = Object.values(data).reverse();

  const members = document.getElementById("members");
  if (members) members.textContent = users.length;

  if (!users.length) {
    empty("waitlist", "No waitlist signups yet");
    return;
  }

  setHTML("waitlist", users.map(user => `
    <div class="wait-card">
      <h3>${clean(user.name)}</h3>
      <p><strong>Email:</strong> ${clean(user.email)}</p>
      <p><strong>Zodiac:</strong> ${clean(user.zodiac || user.favorite_zodiac)}</p>
      <small>${clean(user.date || user.createdAt)}</small>
    </div>
  `).join(""));
});

onValue(ref(db, "votes"), snap => {
  const data = snap.val() || {};

  const votes = Object.entries(data)
    .map(([sign, value]) => ({
      sign,
      count: typeof value === "number" ? value : value?.count || 0
    }))
    .sort((a, b) => b.count - a.count);

  if (!votes.length) {
    empty("votes", "No votes yet");
    return;
  }

  setHTML("votes", votes.map(v => `
    <div class="vote-row">
      <span>${v.sign}</span>
      <strong>${v.count}</strong>
    </div>
  `).join(""));
});

onValue(ref(db, "flavorSuggestions"), snap => {
  const data = snap.val();

  if (!data) {
    empty("suggestions", "No flavor suggestions yet");
    return;
  }

  const suggestions = Object.values(data).reverse();

  setHTML("suggestions", suggestions.map(item => `
    <div class="wait-card">
      <h3>${clean(item.flavor)}</h3>
      <p><strong>Zodiac:</strong> ${clean(item.zodiac)}</p>
      <p><strong>Ingredient:</strong> ${clean(item.ingredient)}</p>
      <p>${clean(item.message)}</p>
      <small>${clean(item.name)} • ${clean(item.email)}</small>
    </div>
  `).join(""));
});

onValue(ref(db, "messages"), snap => {
  const data = snap.val();

  if (!data) {
    empty("messages", "No messages yet");
    return;
  }

  const messages = Object.values(data).reverse();

  setHTML("messages", messages.map(msg => `
    <div class="wait-card">
      <h3>${clean(msg.subject)}</h3>
      <p>${clean(msg.message)}</p>
      <small>${clean(msg.name)} • ${clean(msg.email)}</small>
    </div>
  `).join(""));
});

onValue(ref(db, "notifications"), snap => {
  const data = snap.val();

  if (!data) {
    empty("notifications", "No notifications yet");
    return;
  }

  const notes = Object.values(data).reverse();

  setHTML("notifications", notes.map(note => `
    <div class="item">
      <strong>${clean(note.type)}</strong><br>
      ${clean(note.message)}
    </div>
  `).join(""));
});
