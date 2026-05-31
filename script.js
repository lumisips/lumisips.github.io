const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoeaqkg";

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

function getVotes() {
  return JSON.parse(localStorage.getItem("lumisipsVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("lumisipsVotes", JSON.stringify(votes));
}

async function sendToLumiSips(data) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.ok;
}

async function vote(sign) {
  const votes = getVotes();
  votes[sign] = (votes[sign] || 0) + 1;
  saveVotes(votes);
  renderZodiacs();

  await sendToLumiSips({
    submission_type: "Zodiac Vote",
    vote_for: sign,
    date: new Date().toLocaleString()
  });
}

function renderZodiacs() {
  const grid = document.getElementById("zodiacGrid");
  if (!grid) return;

  const votes = getVotes();
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

function getComments() {
  return JSON.parse(localStorage.getItem("lumisipsComments")) || [];
}

function saveComments(comments) {
  localStorage.setItem("lumisipsComments", JSON.stringify(comments));
}

async function addComment() {
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
    reason: comment,
    date: new Date().toLocaleString()
  };

  const comments = getComments();
  comments.unshift(entry);
  saveComments(comments);
  renderComments();

  const sent = await sendToLumiSips(entry);

  if (sent) {
    alert("Flavor idea sent to LumiSips!");
  } else {
    alert("Saved on the site, but email sending failed. Try again.");
  }

  document.getElementById("nameInput").value = "";
  document.getElementById("zodiacInput").value = "";
  document.getElementById("flavorInput").value = "";
  document.getElementById("commentInput").value = "";
}

function renderComments() {
  const commentsBox = document.getElementById("comments");
  if (!commentsBox) return;

  const comments = getComments();
  commentsBox.innerHTML = "";

  comments.forEach(item => {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <p><strong>${item.name}</strong> suggested a flavor for <strong>${item.zodiac}</strong></p>
      <p><strong>Flavor Idea:</strong> ${item.flavor_idea || item.flavor}</p>
      <p>${item.reason || item.comment}</p>
      <p style="font-size:0.8rem; opacity:0.65;">${item.date}</p>
    `;

    commentsBox.appendChild(div);
  });
}

async function joinList() {
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

  const sent = await sendToLumiSips(member);

  if (sent) {
    message.textContent = "You're on the LumiList. Welcome to the movement.";
  } else {
    message.textContent = "Something went wrong. Please try again.";
  }

  document.getElementById("joinName").value = "";
  document.getElementById("joinEmail").value = "";
  document.getElementById("joinZodiac").value = "";
}

renderZodiacs();
renderComments();
