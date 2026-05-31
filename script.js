const zodiacFlavors = [
  {
    sign: "Aries",
    symbol: "♈",
    flavor: "Blood Orange Mango Heat",
    profile: "Bold citrus, tropical mango, light spicy finish."
  },
  {
    sign: "Taurus",
    symbol: "♉",
    flavor: "Honeydew Pear Vanilla",
    profile: "Smooth, sweet, mellow, soft luxury profile."
  },
  {
    sign: "Gemini",
    symbol: "♊",
    flavor: "Lemon Lime Blueberry",
    profile: "Bright, playful, sharp, refreshing."
  },
  {
    sign: "Cancer",
    symbol: "♋",
    flavor: "Blue Raspberry Dragon Fruit Hibiscus",
    profile: "Flagship flavor. Emotional, bold, blue, floral, tropical."
  },
  {
    sign: "Leo",
    symbol: "♌",
    flavor: "Pineapple Passion Fruit",
    profile: "Loud, tropical, golden, confident."
  },
  {
    sign: "Virgo",
    symbol: "♍",
    flavor: "Cucumber Green Apple Mint",
    profile: "Clean, crisp, organized, wellness-focused."
  },
  {
    sign: "Libra",
    symbol: "♎",
    flavor: "Strawberry Rose Lemonade",
    profile: "Balanced, pretty, romantic, lightly floral."
  },
  {
    sign: "Scorpio",
    symbol: "♏",
    flavor: "Black Cherry Pomegranate",
    profile: "Dark, deep, intense, slightly tart."
  },
  {
    sign: "Sagittarius",
    symbol: "♐",
    flavor: "Kiwi Black Cherry",
    profile: "Adventurous, bright, bold, unique."
  },
  {
    sign: "Capricorn",
    symbol: "♑",
    flavor: "Sour Watermelon Strawberry",
    profile: "Focused, strong, sharp, marketable."
  },
  {
    sign: "Aquarius",
    symbol: "♒",
    flavor: "Blueberry Lavender Citrus",
    profile: "Futuristic, smooth, floral, unexpected."
  },
  {
    sign: "Pisces",
    symbol: "♓",
    flavor: "Peach Dragon Fruit Lychee",
    profile: "Dreamy, soft, tropical, emotional."
  }
];

function getVotes() {
  return JSON.parse(localStorage.getItem("lumisipsVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("lumisipsVotes", JSON.stringify(votes));
}

function vote(sign) {
  const votes = getVotes();
  votes[sign] = (votes[sign] || 0) + 1;
  saveVotes(votes);
  renderZodiacs();
}

function renderZodiacs() {
  const grid = document.getElementById("zodiacGrid");
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

function addComment() {
  const name = document.getElementById("nameInput").value.trim();
  const zodiac = document.getElementById("zodiacInput").value;
  const flavor = document.getElementById("flavorInput").value.trim();
  const comment = document.getElementById("commentInput").value.trim();

  if (!name || !zodiac || !flavor || !comment) {
    alert("Please fill out every section before submitting.");
    return;
  }

  const comments = getComments();

  comments.unshift({
    name,
    zodiac,
    flavor,
    comment,
    date: new Date().toLocaleDateString()
  });

  saveComments(comments);

  document.getElementById("nameInput").value = "";
  document.getElementById("zodiacInput").value = "";
  document.getElementById("flavorInput").value = "";
  document.getElementById("commentInput").value = "";

  renderComments();
}

function renderComments() {
  const commentsBox = document.getElementById("comments");
  const comments = getComments();

  commentsBox.innerHTML = "";

  comments.forEach(item => {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <p><strong>${item.name}</strong> suggested a flavor for <strong>${item.zodiac}</strong></p>
      <p><strong>Flavor Idea:</strong> ${item.flavor}</p>
      <p>${item.comment}</p>
      <p style="font-size:0.8rem; opacity:0.65;">${item.date}</p>
    `;

    commentsBox.appendChild(div);
  });
}

renderZodiacs();
renderComments();
