import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, push, get, set, onValue, update, increment
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

const battles = [
  { key:"battle0", left:"Glass Bottles", right:"Aluminum Cans", leftIcon:"🧊", rightIcon:"🥤" },
  { key:"battle1", left:"Still Hydration", right:"Sparkling Hydration", leftIcon:"💧", rightIcon:"✨" },
  { key:"battle2", left:"Energy", right:"Sparkling Energy", leftIcon:"⚡", rightIcon:"🔋" },
  { key:"battle3", left:"Blue Raspberry", right:"Watermelon", leftIcon:"🫐", rightIcon:"🍉" },
  { key:"battle4", left:"Dragon Fruit", right:"Passion Fruit", leftIcon:"🐉", rightIcon:"🌺" }
];

const defaultBattleVotes = {
  battle0:{ "Glass Bottles":18, "Aluminum Cans":12 },
  battle1:{ "Still Hydration":10, "Sparkling Hydration":22 },
  battle2:{ "Energy":16, "Sparkling Energy":26 },
  battle3:{ "Blue Raspberry":30, "Watermelon":19 },
  battle4:{ "Dragon Fruit":24, "Passion Fruit":21 }
};

function sparkleBurst(x,y){
  const layer = document.getElementById("sparkleLayer");
  if(!layer) return;
  ["✨","💫","⭐","🫧","💥"].forEach((s,i)=>{
    const el=document.createElement("div");
    el.className="sparkle";
    el.textContent=s;
    el.style.left=`${x+(Math.random()*130-65)}px`;
    el.style.top=`${y+(Math.random()*90-45)}px`;
    layer.appendChild(el);
    setTimeout(()=>el.remove(),900);
  });
}

function renderBattles(data = defaultBattleVotes){
  const grid = document.getElementById("battleGrid");
  if(!grid) return;

  const finalData = data && Object.keys(data).length ? data : defaultBattleVotes;

  grid.innerHTML = `
    <div style="text-align:center;margin-bottom:22px;">
      <button id="resetArenaBtn" class="btn secondary" type="button">
        Reset My Arena Picks
      </button>
    </div>
  `;

  battles.forEach(battle=>{
    const current = finalData[battle.key] || defaultBattleVotes[battle.key];
    const leftVotes = current[battle.left] || 0;
    const rightVotes = current[battle.right] || 0;
    const total = leftVotes + rightVotes || 1;
    const leftPercent = Math.round((leftVotes / total) * 100);
    const rightPercent = Math.round((rightVotes / total) * 100);
    const picked = localStorage.getItem(`lumisipsVotedBattle_${battle.key}`);

    let winner = "Tie";
    if(leftVotes > rightVotes) winner = battle.left;
    if(rightVotes > leftVotes) winner = battle.right;

    grid.innerHTML += `
      <div class="battle-card">
        <div class="battle-header">
          <h3>${battle.left} vs ${battle.right}</h3>
          <span class="winner-badge">👑 ${winner}</span>
        </div>

        <div class="battle-matchup">
          <div class="battle-option ${picked===battle.left ? "selected" : ""}" data-battle="${battle.key}" data-choice="${battle.left}">
            <div class="option-emoji">${battle.leftIcon}</div>
            <div class="option-name">${battle.left}</div>
            <div class="option-votes">${leftVotes} votes • ${leftPercent}%</div>
            <div class="health-bar"><span style="width:${leftPercent}%"></span></div>
            <div class="pick-locked">${picked===battle.left ? "Your pick is locked." : "Tap to choose"}</div>
          </div>

          <div class="vs-orb">VS</div>

          <div class="battle-option ${picked===battle.right ? "selected" : ""}" data-battle="${battle.key}" data-choice="${battle.right}">
            <div class="option-emoji">${battle.rightIcon}</div>
            <div class="option-name">${battle.right}</div>
            <div class="option-votes">${rightVotes} votes • ${rightPercent}%</div>
            <div class="health-bar"><span style="width:${rightPercent}%"></span></div>
            <div class="pick-locked">${picked===battle.right ? "Your pick is locked." : "Tap to choose"}</div>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("resetArenaBtn")?.addEventListener("click",()=>{
    battles.forEach(b=>localStorage.removeItem(`lumisipsVotedBattle_${b.key}`));
    renderBattles(finalData);
  });

  document.querySelectorAll(".battle-option").forEach(option=>{
    option.style.pointerEvents = "auto";
    option.style.cursor = "pointer";

    option.addEventListener("click",()=>{
      const key = option.dataset.battle;
      const choice = option.dataset.choice;

      if(localStorage.getItem(`lumisipsVotedBattle_${key}`)) return;

      localStorage.setItem(`lumisipsVotedBattle_${key}`, choice);

      update(ref(db, `battleVotes/${key}`), {
        [choice]: increment(1)
      });

      option.classList.add("selected");
      const rect = option.getBoundingClientRect();
      sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });
}

async function seedBattleVotes(){
  const snap = await get(ref(db,"battleVotes"));
  if(!snap.exists()){
    await set(ref(db,"battleVotes"), defaultBattleVotes);
  }
}

async function startArena(){
  renderBattles(defaultBattleVotes);
  await seedBattleVotes();

  onValue(ref(db,"battleVotes"), snap=>{
    renderBattles(snap.val() || defaultBattleVotes);
  });
}

startArena();
