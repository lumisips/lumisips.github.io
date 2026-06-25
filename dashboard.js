import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get
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

let allUsers = [];

const $ = id => document.getElementById(id);
const clean = value => value || "Not provided";

function setHTML(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

function empty(id, text) {
  setHTML(id, `<div class="item">${text}</div>`);
}

function renderUsers(users) {
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
}

onValue(ref(db, "lumiList"), snap => {
  const data = snap.val() || {};
  allUsers = Object.values(data).reverse();

  if ($("members")) $("members").textContent = allUsers.length;
  if ($("latestSignup")) $("latestSignup").textContent = allUsers[0]?.name || "—";

  renderUsers(allUsers);
});

$("searchInput")?.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();

  const filtered = allUsers.filter(user =>
    String(user.name || "").toLowerCase().includes(term) ||
    String(user.email || "").toLowerCase().includes(term)
  );

  renderUsers(filtered);
});

onValue(ref(db, "votes"), snap => {
  const data = snap.val() || {};

  const votes = Object.entries(data).map(([sign, value]) => ({
    sign,
    count: typeof value === "number" ? value : value?.count || 0
  })).sort((a, b) => b.count - a.count);

  const total = votes.reduce((sum, vote) => sum + vote.count, 0);

  if ($("totalVotes")) $("totalVotes").textContent = total;
  if ($("topZodiac")) $("topZodiac").textContent = votes[0]?.sign || "—";

  if (!votes.length) {
    empty("votes", "No votes yet");
    return;
  }

  setHTML("votes", votes.map(vote => {
    const percent = total ? Math.round((vote.count / total) * 100) : 0;

    return `
      <div class="vote-row">
        <div class="vote-top">
          <span>${vote.sign}</span>
          <strong>${vote.count}</strong>
        </div>
        <div class="bar"><span style="width:${percent}%"></span></div>
      </div>
    `;
  }).join(""));
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

  const notifications = Object.values(data).reverse();

  setHTML("notifications", notifications.map(note => `
    <div class="item">
      <strong>${clean(note.type)}</strong><br>
      ${clean(note.message)}
    </div>
  `).join(""));
});

window.exportWaitlistCSV = async function () {
  const snap = await get(ref(db, "lumiList"));
  const data = snap.val() || {};

  const rows = [["Name", "Email", "Zodiac", "Date
