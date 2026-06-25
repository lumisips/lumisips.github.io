import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

window.exportWaitlistCSV = async function () {
  const snapshot = await get(ref(db, "lumiList"));
  const data = snapshot.val() || {};

  const rows = [["Name", "Email", "Zodiac", "Date"]];

  Object.values(data).forEach(user => {
    rows.push([
      user.name || "",
      user.email || "",
      user.zodiac || user.favorite_zodiac || "",
      user.date || user.createdAt || ""
    ]);
  });

  const csv = rows.map(row =>
    row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")
  ).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "lumisips-waitlist.csv";
  link.click();

  URL.revokeObjectURL(url);
};
