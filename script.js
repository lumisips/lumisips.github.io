window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").style.display = "none", 900);
});

const zodiacSigns = [
  ["Aries","♈","Coming Soon"],["Taurus","♉","Coming Soon"],["Gemini","♊","Coming Soon"],
  ["Cancer","♋","Blue Raspberry • Dragon Fruit • Hibiscus"],["Leo","♌","Coming Soon"],
  ["Virgo","♍","Coming Soon"],["Libra","♎","Coming Soon"],["Scorpio","♏","Coming Soon"],
  ["Sagittarius","♐","Coming Soon"],["Capricorn","♑","Coming Soon"],
  ["Aquarius","♒","Coming Soon"],["Pisces","♓","Coming Soon"]
];

const battles = [
  ["Glass Bottles","Aluminum Cans"],
  ["Still Hydration","Sparkling Hydration"],
  ["Energy","Sparkling Energy"],
  ["Blue Raspberry","Watermelon"],
  ["Dragon Fruit","Passion Fruit"]
];

const navLinks = document.getElementById("navLinks");
document.getElementById("menuToggle").onclick = () => navLinks.classList.toggle("show");
document.querySelectorAll(".nav-links a").forEach(a => a.onclick = () => navLinks.classList.remove("show"));

const get = key => JSON.parse(localStorage.getItem(key)) || {};
const set = (key,val) => localStorage.setItem(key, JSON.stringify(val));

function renderZodiac(){
  const grid = document.getElementById("zodiacGrid");
  grid.innerHTML = "";
  zodiacSigns.forEach(([name,symbol,flavor])=>{
    const locked = name === "Cancer";
    grid.innerHTML += `
      <div class="card ${locked ? "flagship" : ""}">
        <h3>${symbol} ${name}</h3>
        <p>${flavor}</p>
        <span class="badge">${locked ? "Flagship Locked" : "Coming Soon"}</span>
      </div>`;
  });
}

function renderVotes(){
  const votes = get("lumisipsVotes");
  const grid = document.getElementById("voteGrid");
  grid.innerHTML = "";
  zodiacSigns.filter(z=>z[0]!=="Cancer").forEach(([name,symbol])=>{
    votes[name] ??= 0;
    grid.innerHTML += `
      <div class="card">
        <h3>${symbol} ${name}</h3>
        <p>Votes: <b>${votes[name]}</b></p>
        <button class="btn primary" onclick="vote('${name}')">Vote ${symbol}</button>
      </div>`;
  });
  set("lumisipsVotes",votes);
}

function vote(name){
  const votes = get("lumisipsVotes");
  votes[name] = (votes[name] || 0) + 1;
  set("lumisipsVotes",votes);
  document.getElementById("voteMessage").textContent = `Your vote for ${name} has been counted.`;
  renderVotes();
  renderLeaderboard();
}

function renderLeaderboard(){
  const votes = get("lumisipsVotes");
  const ranked = zodiacSigns.map(([name,symbol])=>({
    name,symbol,votes:name==="Cancer" ? "Flagship Locked" : votes[name] || 0,
    locked:name==="Cancer"
  })).sort((a,b)=>{
    if(a.locked) return -1;
    if(b.locked) return 1;
    return b.votes - a.votes;
  });

  document.getElementById("leaderboardList").innerHTML = ranked.map((x,i)=>`
    <div class="leaderboard-row ${x.locked ? "flagship" : ""}">
      <span>${i+1}. ${x.symbol} ${x.name}</span>
      <b>${x.votes}</b>
    </div>`).join("");
}

function renderBattles(){
  const data = get("lumisipsBattles");
  const grid = document.getElementById("battleGrid");
  grid.innerHTML = "";

  battles.forEach(([a,b],i)=>{
    const key = `battle${i}`;
    data[key] ??= {[a]:0,[b]:0};
    const av = data[key][a] || 0;
    const bv = data[key][b] || 0;
    const winner = av === bv ? "Tie" : av > bv ? a : b;

    grid.innerHTML += `
      <div class="card">
        <h3>${a} vs ${b}</h3>
        <p>${a}: <b>${av}</b></p>
        <p>${b}: <b>${bv}</b></p>
        <p>Winner: <b>${winner}</b></p>
        <button class="btn secondary" onclick="battleVote('${key}','${a}')">${a}</button>
        <button class="btn primary" onclick="battleVote('${key}','${b}')">${b}</button>
      </div>`;
  });
  set("lumisipsBattles",data);
}

function battleVote(key,choice){
  const data = get("lumisipsBattles");
  data[key][choice]++;
  set("lumisipsBattles",data);
  renderBattles();
}

function animateProgress(){
  document.querySelectorAll(".progress-item").forEach(item=>{
    const width = item.dataset.progress;
    item.querySelector("i").style.width = width + "%";
  });
}

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      if(entry.target.id === "lab") animateProgress();
    }
  });
},{threshold:.18});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll(".ajax-form").forEach(form=>{
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const status = form.querySelector(".form-status");
    status.textContent = "Sending...";

    try{
      const res = await fetch(form.action,{
        method:"POST",
        body:new FormData(form),
        headers:{Accept:"application/json"}
      });

      if(res.ok){
        status.textContent = form.dataset.success;
        if(form.classList.contains("waitlist-form")){
          let count = Number(localStorage.getItem("lumisipsMembers") || 128) + 1;
          localStorage.setItem("lumisipsMembers",count);
          document.getElementById("memberCount").textContent = count;
        }
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
      }
    }catch{
      status.textContent = "Connection error. Please try again.";
    }
  });
});

const members = localStorage.getItem("lumisipsMembers") || 128;
document.getElementById("memberCount").textContent = members;

window.addEventListener("scroll",()=>{
  const scrolled = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
  document.getElementById("backTop").style.display = window.scrollY > 600 ? "block" : "none";
});
document.getElementById("backTop").onclick = () => scrollTo({top:0,behavior:"smooth"});

document.addEventListener("mousemove",e=>{
  const glow = document.getElementById("mouseGlow");
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  stars = Array.from({length:120},()=>({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.6,
    s:Math.random()*.6+.2
  }));
}
resize();
addEventListener("resize",resize);

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star=>{
    ctx.globalAlpha = Math.random();
    ctx.beginPath();
    ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fill();
    star.y += star.s;
    if(star.y > canvas.height) star.y = 0;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

renderZodiac();
renderVotes();
renderLeaderboard();
renderBattles();
