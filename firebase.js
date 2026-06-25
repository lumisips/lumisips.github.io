window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));

  const loader = document.getElementById("loader");
  if (loader) loader.remove();

  const battleGrid = document.getElementById("battleGrid");

  if (battleGrid) {
    battleGrid.innerHTML = `
      <div style="text-align:center;margin-bottom:25px;">
        <button class="btn secondary" onclick="localStorage.clear(); location.reload();">
          Reset My Arena Picks
        </button>
      </div>

      ${[
        ["Glass Bottles","Aluminum Cans","🧊","🥤",18,12],
        ["Still Hydration","Sparkling Hydration","💧","✨",10,22],
        ["Energy","Sparkling Energy","⚡","🔋",16,26],
        ["Blue Raspberry","Watermelon","🫐","🍉",30,19],
        ["Dragon Fruit","Passion Fruit","🐉","🌺",24,21]
      ].map((b,i)=>{
        const picked = localStorage.getItem("battle_" + i);
        const total = b[4] + b[5];
        const l = Math.round((b[4]/total)*100);
        const r = Math.round((b[5]/total)*100);

        return `
          <div class="battle-card">
            <div class="battle-header">
              <h3>${b[0]} vs ${b[1]}</h3>
              <span class="winner-badge">👑 ${b[4] > b[5] ? b[0] : b[1]}</span>
            </div>

            <div class="battle-matchup">
              <div class="battle-option" onclick="localStorage.setItem('battle_${i}','${b[0]}'); this.querySelector('.pick-locked').textContent='Your pick is locked.';">
                <div class="option-emoji">${b[2]}</div>
                <div class="option-name">${b[0]}</div>
                <div class="option-votes">${b[4]} votes • ${l}%</div>
                <div class="health-bar"><span style="width:${l}%"></span></div>
                <div class="pick-locked">${picked === b[0] ? "Your pick is locked." : "Tap to choose"}</div>
              </div>

              <div class="vs-orb">VS</div>

              <div class="battle-option" onclick="localStorage.setItem('battle_${i}','${b[1]}'); this.querySelector('.pick-locked').textContent='Your pick is locked.';">
                <div class="option-emoji">${b[3]}</div>
                <div class="option-name">${b[1]}</div>
                <div class="option-votes">${b[5]} votes • ${r}%</div>
                <div class="health-bar"><span style="width:${r}%"></span></div>
                <div class="pick-locked">${picked === b[1] ? "Your pick is locked." : "Tap to choose"}</div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    `;
  }
});
