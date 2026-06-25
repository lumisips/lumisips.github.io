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

function empty(id) {
  document.getElementById(id).innerHTML = `<div class="item">No data yet</div>`;
}

onValue(ref(db, "lumiList"), snap => {
  const data = snap.val() || {};
  const users = Object.values(data);

  document.getElementById("members").textContent = users.length;

  if (!users.length) return empty("waitlist");

  document.getElementById("waitlist").innerHTML = users.reverse().map(user => `
    <div class="wait-card">
      <h3>${clean(user.name)}</h3>
      <p><strong>Email:</strong> ${clean(user.email)}</p>
      <p><strong>Zodiac:</strong> ${clean(user.zodiac || user.favorite_zodiac)}</p>
      <small>${clean(user.date || user.createdAt)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "votes"), snap => {
  const data = snap.val() || {};
  const votes = Object.entries(data).map(([sign, value]) => ({
    sign,
    count: typeof value === "number" ? value : value?.count || 0
  })).sort((a,b) => b.count - a.count);

  if (!votes.length) return empty("votes");

  document.getElementById("votes").innerHTML = votes.map(v => `
    <div class="vote-row">
      <span>${v.sign}</span>
      <strong>${v.count}</strong>
    </div>
  `).join("");
});

onValue(ref(db, "flavorSuggestions"), snap => {
  const data = snap.val() || {};
  const suggestions = Object.values(data).reverse();

  if (!suggestions.length) return empty("suggestions");

  document.getElementById("suggestions").innerHTML = suggestions.map(item => `
    <div class="wait-card">
      <h3>${clean(item.flavor)}</h3>
      <p><strong>Zodiac:</strong> ${clean(item.zodiac)}</p>
      <p><strong>Ingredient:</strong> ${clean(item.ingredient)}</p>
      <p>${clean(item.message)}</p>
      <small>${clean(item.name)} • ${clean(item.email)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "messages"), snap => {
  const data = snap.val() || {};
  const messages = Object.values(data).reverse();

  if (!messages.length) return empty("messages");

  document.getElementById("messages").innerHTML = messages.map(msg => `
    <div class="wait-card">
      <h3>${clean(msg.subject)}</h3>
      <p>${clean(msg.message)}</p>
      <small>${clean(msg.name)} • ${clean(msg.email)}</small>
    </div>
  `).join("");
});

onValue(ref(db, "notifications"), snap => {
  const data = snap.val() || {};
  const notes = Object.values(data).reverse();

  if (!notes.length) return empty("notifications");

  document.getElementById("notifications").innerHTML = notes.map(note => `
    <div class="item">
      <strong>${clean(note.type)}</strong><br>
      ${clean(note.message)}
    </div>
  `).join("");
});
