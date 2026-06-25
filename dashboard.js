import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
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

function renderList(id, data) {
  const container = document.getElementById(id);

  if (!container) return;

  if (!data) {
    container.innerHTML = "<div class='item'>No data yet</div>";
    return;
  }

  container.innerHTML = Object.entries(data)
    .reverse()
    .slice(0, 25)
    .map(([key, value]) => {
      return `
      <div class="item">
        <pre>${JSON.stringify(value, null, 2)}</pre>
      </div>
      `;
    })
    .join("");
}

onValue(ref(db, "stats/members"), snap => {
  document.getElementById("members").textContent =
    snap.val() || 0;
});

onValue(ref(db, "votes"), snap => {
  const data = snap.val();

  let html = "";

  Object.entries(data || {}).forEach(([sign, value]) => {
    const count =
      typeof value === "number"
        ? value
        : value?.count || 0;

    html += `
      <div class="item">
        ${sign}: <strong>${count}</strong>
      </div>
    `;
  });

  document.getElementById("votes").innerHTML = html;
});

onValue(ref(db, "flavorSuggestions"), snap => {
  renderList("suggestions", snap.val());
});

onValue(ref(db, "lumiList"), snap => {
  renderList("waitlist", snap.val());
});

onValue(ref(db, "messages"), snap => {
  renderList("messages", snap.val());
});

onValue(ref(db, "notifications"), snap => {
  renderList("notifications", snap.val());
});

console.log("LumiSips Founder Dashboard Connected");
