/* =========================================================
   LUMISIPS — PRODUCTION FRONT-END
   Product-first homepage
   Voting + zodiac rendering + interactions + performance
========================================================= */


/* =========================================================
   ZODIAC DATA
========================================================= */

const zodiacData = [
  {
    sign: "Aries",
    symbol: "♈",
    flavor: "Coming Soon",
    gem: "Fire Opal",
    stage: "Community shaping",
    color: "#ff5f54"
  },
  {
    sign: "Taurus",
    symbol: "♉",
    flavor: "Yuzu Orange Citrus",
    gem: "Golden Citrine",
    stage: "Early development",
    color: "#ffb63d"
  },
  {
    sign: "Gemini",
    symbol: "♊",
    flavor: "Coming Soon",
    gem: "Alexandrite",
    stage: "Community shaping",
    color: "#8f7cff"
  },
  {
    sign: "Cancer",
    symbol: "♋",
    flavor: "Blue Raspberry • Dragon Fruit • Hibiscus",
    gem: "Blue Sapphire",
    stage: "Flagship refinement",
    color: "#1b8fff"
  },
  {
    sign: "Leo",
    symbol: "♌",
    flavor: "Coming Soon",
    gem: "Imperial Topaz",
    stage: "Community shaping",
    color: "#ff8a2a"
  },
  {
    sign: "Virgo",
    symbol: "♍",
    flavor: "Pineapple • Watermelon • Coconut",
    gem: "Emerald",
    stage: "R&D active",
    color: "#24d17e"
  },
  {
    sign: "Libra",
    symbol: "♎",
    flavor: "Coming Soon",
    gem: "Rose Quartz",
    stage: "Community shaping",
    color: "#ff83cb"
  },
  {
    sign: "Scorpio",
    symbol: "♏",
    flavor: "Strawberry • Pineapple • Dragon Fruit",
    gem: "Purple Kunzite",
    stage: "R&D active",
    color: "#9a62e8"
  },
  {
    sign: "Sagittarius",
    symbol: "♐",
    flavor: "Black Cherry • Dragon Fruit • Pineapple",
    gem: "Pink Topaz",
    stage: "R&D active",
    color: "#ff4fa8"
  },
  {
    sign: "Capricorn",
    symbol: "♑",
    flavor: "Strawberry • Sour Watermelon",
    gem: "Ruby",
    stage: "Advanced refinement",
    color: "#e21843"
  },
  {
    sign: "Aquarius",
    symbol: "♒",
    flavor: "Coming Soon",
    gem: "Aquamarine",
    stage: "Community shaping",
    color: "#31d9e9"
  },
  {
    sign: "Pisces",
    symbol: "♓",
    flavor: "Strawberry • Açaí • Pomegranate",
    gem: "Deep Amethyst",
    stage: "R&D active",
    color: "#7137b8"
  }
];


/* =========================================================
   COMMUNITY BATTLES
========================================================= */

const battleData = [
  {
    id: "packaging",
    title: "Launch packaging",
    subtitle: "Which format creates the strongest LumiSips experience?",
    a: [
      "16 oz Glass Bottle",
      "Premium hand-feel, gemstone clarity and a luxury presentation."
    ],
    b: [
      "16 oz Sleek Can",
      "Portable, modern and highly practical for future scaling."
    ]
  },
  {
    id: "hydration-line",
    title: "Hydration launch priority",
    subtitle: "Which line should get more attention first?",
    a: [
      "Still Hydration",
      "Smooth, clean hydration without carbonation."
    ],
    b: [
      "Sparkling Hydration",
      "Crisp carbonation with a more energetic drinking experience."
    ]
  },
  {
    id: "energy-line",
    title: "Energy format",
    subtitle: "Which functional direction feels more exciting?",
    a: [
      "Still Energy",
      "Smooth functional energy designed for easy drinking."
    ],
    b: [
      "Sparkling Energy",
      "Bold carbonation paired with functional energy."
    ]
  },
  {
    id: "sweetness",
    title: "Sweetness personality",
    subtitle: "How should premium LumiSips flavors finish?",
    a: [
      "Bright & Crisp",
      "Cleaner finish with lighter perceived sweetness."
    ],
    b: [
      "Juicy & Luxurious",
      "Fuller fruit character with a richer finish."
    ]
  },
  {
    id: "wellness",
    title: "Functional priority",
    subtitle: "Which benefit should receive more product-development focus?",
    a: [
      "Hydration + Electrolytes",
      "Daily hydration and performance-oriented functionality."
    ],
    b: [
      "Focus + Calm Energy",
      "Mental clarity and smoother functional energy."
    ]
  },
  {
    id: "limited-release",
    title: "Limited collection",
    subtitle: "Which special collection would you rather see?",
    a: [
      "Summer Gem Collection",
      "Bright tropical profiles with vivid gemstone colors."
    ],
    b: [
      "Midnight Zodiac Collection",
      "Dark fruit flavors with deeper gemstone tones."
    ]
  }
];


/* =========================================================
   GEMSTONE COLOR BATTLES
========================================================= */

const gemstoneData = [
  {
    id: "scorpio-purple",
    title: "Scorpio Kunzite",
    prompt: "Which purple best represents Scorpio?",
    a: [
      "Light Purple Kunzite",
      "Luminous, softer and mysterious.",
      "linear-gradient(145deg,#f0d6ff,#ba7ce8 45%,#7350b8)"
    ],
    b: [
      "Medium Purple Kunzite",
      "Richer gemstone purple without becoming overly dark.",
      "linear-gradient(145deg,#dba9ff,#9358c8 48%,#512b82)"
    ]
  },
  {
    id: "sagittarius-topaz",
    title: "Sagittarius Topaz",
    prompt: "Which gemstone direction fits Sagittarius best?",
    a: [
      "Pink Topaz",
      "Bright, energetic and playful.",
      "linear-gradient(145deg,#ffd0e9,#ff6fb7 48%,#d72477)"
    ],
    b: [
      "Imperial Topaz",
      "Warm orange-gold gemstone energy.",
      "linear-gradient(145deg,#ffd4a1,#ff8a38 50%,#c64a19)"
    ]
  },
  {
    id: "virgo-green",
    title: "Virgo Emerald",
    prompt: "Which green best represents Virgo?",
    a: [
      "Bright Emerald",
      "Clean, vivid and refreshing.",
      "linear-gradient(145deg,#a9ffd2,#1bd87e 50%,#08794a)"
    ],
    b: [
      "Deep Emerald",
      "Rich, mature and botanical.",
      "linear-gradient(145deg,#66db9b,#0b7749 50%,#033425)"
    ]
  },
  {
    id: "cancer-blue",
    title: "Cancer Sapphire",
    prompt: "Which blue should lead the flagship identity?",
    a: [
      "Aquamarine Sapphire",
      "Bright, electric and refreshing.",
      "linear-gradient(145deg,#c1ffff,#18c8ff 50%,#2469d8)"
    ],
    b: [
      "Royal Blue Sapphire",
      "Deeper, premium and emotionally powerful.",
      "linear-gradient(145deg,#8cc8ff,#2466e8 48%,#111a78)"
    ]
  },
  {
    id: "capricorn-red",
    title: "Capricorn Ruby",
    prompt: "Which ruby best fits strawberry sour watermelon?",
    a: [
      "Clear Ruby",
      "Bright red with strong gemstone clarity.",
      "linear-gradient(145deg,#ffb3bd,#f13054 50%,#ad092b)"
    ],
    b: [
      "Deep Ruby",
      "Bold, serious and luxurious.",
      "linear-gradient(145deg,#e76584,#8e0e35 50%,#310418)"
    ]
  },
  {
    id: "pisces-amethyst",
    title: "Pisces Amethyst",
    prompt: "Which purple best complements strawberry, açaí and pomegranate?",
    a: [
      "Vibrant Amethyst",
      "Bright berry-purple gemstone energy.",
      "linear-gradient(145deg,#e2a8ff,#9d4de0 52%,#6122a3)"
    ],
    b: [
      "Deep Amethyst",
      "Dark, luxurious and jewel-toned.",
      "linear-gradient(145deg,#b76ce8,#682595 52%,#2d0b48)"
    ]
  }
];


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


/* =========================================================
   RENDER FULL ZODIAC UNIVERSE
========================================================= */

function renderZodiac() {
  const grid = $("#zodiacGrid");

  if (!grid) return;

  grid.innerHTML = zodiacData
    .map(
      item => `
        <article
          class="zodiac-card reveal"
          style="--zodiac-color:${item.color}"
        >
          <div class="zodiac-top">

            <span class="zodiac-symbol">
              ${item.symbol}
            </span>

            <span class="zodiac-stage">
              ${item.stage}
            </span>

          </div>

          <h3>
            ${item.sign}
          </h3>

          <p>
            ${item.flavor}
          </p>

          <small>
            ${item.gem}
          </small>
        </article>
      `
    )
    .join("");
}


/* =========================================================
   VOTE BUTTON
========================================================= */

function createVoteButton(
  group,
  battleId,
  title,
  description,
  className = "vote-option",
  gradient = ""
) {
  const swatch = gradient
    ? `
      <div
        class="gem-swatch"
        style="--gem-gradient:${gradient}"
        aria-hidden="true"
      ></div>
    `
    : "";

  return `
    <button
      type="button"
      class="${className}"
      data-vote-group="${group}"
      data-battle-id="${battleId}"
      data-choice="${title}"
      aria-pressed="false"
    >
      ${swatch}

      <strong>
        ${title}
      </strong>

      <span>
        ${description}
      </span>
    </button>
  `;
}


/* =========================================================
   RENDER COMMUNITY BATTLES
========================================================= */

function renderBattles() {
  const grid = $("#battleGrid");

  if (!grid) return;

  grid.innerHTML = battleData
    .map(
      item => `
        <article class="battle-card reveal">

          <h3>
            ${item.title}
          </h3>

          <p>
            ${item.subtitle}
          </p>

          <div class="battle-options">

            ${createVoteButton(
              "flavor",
              item.id,
              item.a[0],
              item.a[1]
            )}

            <div
              class="vs"
              aria-hidden="true"
            >
              VS
            </div>

            ${createVoteButton(
              "flavor",
              item.id,
              item.b[0],
              item.b[1]
            )}

          </div>

        </article>
      `
    )
    .join("");
}


/* =========================================================
   RENDER GEMSTONE BATTLES
========================================================= */

function renderGemstones() {
  const grid = $("#gemstoneGrid");

  if (!grid) return;

  grid.innerHTML = gemstoneData
    .map(
      item => `
        <article class="gem-battle reveal">

          <h3>
            ${item.title}
          </h3>

          <p>
            ${item.prompt}
          </p>

          <div class="gem-options">

            ${createVoteButton(
              "gemstone",
              item.id,
              item.a[0],
              item.a[1],
              "gem-option",
              item.a[2]
            )}

            ${createVoteButton(
              "gemstone",
              item.id,
              item.b[0],
              item.b[1],
              "gem-option",
              item.b[2]
            )}

          </div>

        </article>
      `
    )
    .join("");
}


/* =========================================================
   LOCAL VOTE STATE
========================================================= */

function voteStorageKey(group, battleId) {
  return `lumisipsVote:${group}:${battleId}`;
}


function restoreVotes() {
  $$("[data-vote-group]").forEach(button => {
    const {
      voteGroup,
      battleId,
      choice
    } = button.dataset;

    const savedChoice = localStorage.getItem(
      voteStorageKey(
        voteGroup,
        battleId
      )
    );

    const selected =
      savedChoice === choice;

    button.classList.toggle(
      "selected",
      selected
    );

    button.setAttribute(
      "aria-pressed",
      String(selected)
    );
  });
}


/* =========================================================
   VOTE FEEDBACK
========================================================= */

function getVoteFeedbackElement(group) {
  return group === "gemstone"
    ? $("#gemstoneFeedback")
    : $("#battleFeedback");
}


function setVoteFeedback(
  group,
  message,
  state = ""
) {
  const feedback =
    getVoteFeedbackElement(group);

  if (!feedback) return;

  feedback.textContent = message;

  if (state) {
    feedback.dataset.state = state;
  } else {
    delete feedback.dataset.state;
  }
}


/* =========================================================
   HANDLE VOTE
========================================================= */

function handleVote(button) {
  const {
    voteGroup: group,
    battleId,
    choice
  } = button.dataset;

  if (
    !group ||
    !battleId ||
    !choice
  ) {
    return;
  }

  const siblings = $$(
    `[data-vote-group="${group}"][data-battle-id="${battleId}"]`
  );

  siblings.forEach(item => {
    item.classList.remove("selected");

    item.setAttribute(
      "aria-pressed",
      "false"
    );
  });

  button.classList.add("selected");

  button.setAttribute(
    "aria-pressed",
    "true"
  );

  localStorage.setItem(
    voteStorageKey(
      group,
      battleId
    ),
    choice
  );

  setVoteFeedback(
    group,
    `Saving your vote for ${choice}…`
  );

  document.dispatchEvent(
    new CustomEvent(
      "lumisips:vote",
      {
        detail: {
          group,
          battleId,
          choice
        }
      }
    )
  );
}


/* =========================================================
   FIREBASE VOTE RESPONSE EVENTS
========================================================= */

function setupVoteResponses() {
  document.addEventListener(
    "lumisips:vote-saved",
    event => {
      const {
        group,
        choice
      } = event.detail || {};

      if (
        !group ||
        !choice
      ) {
        return;
      }

      setVoteFeedback(
        group,
        `Vote saved: ${choice}`,
        "success"
      );
    }
  );


  document.addEventListener(
    "lumisips:vote-error",
    event => {
      const {
        group
      } = event.detail || {};

      if (!group) return;

      setVoteFeedback(
        group,
        "Your choice is saved on this device, but the online vote could not be submitted. Please try again.",
        "error"
      );
    }
  );
}


/* =========================================================
   PREPARE FUTURE FIREBASE VOTE TOTALS

   Firebase can later dispatch:
   lumisips:vote-results

   Example detail:
   {
     group: "flavor",
     battleId: "packaging",
     results: {
       "16 oz Glass Bottle": 42,
       "16 oz Sleek Can": 18
     }
   }
========================================================= */

function setupVoteResults() {
  document.addEventListener(
    "lumisips:vote-results",
    event => {
      const {
        group,
        battleId,
        results
      } = event.detail || {};

      if (
        !group ||
        !battleId ||
        !results
      ) {
        return;
      }

      const buttons = $$(
        `[data-vote-group="${group}"][data-battle-id="${battleId}"]`
      );

      const counts =
        Object.values(results)
          .map(Number)
          .filter(Number.isFinite);

      const total =
        counts.reduce(
          (sum, value) =>
            sum + value,
          0
        );

      buttons.forEach(button => {
        const choice =
          button.dataset.choice;

        const count =
          Number(
            results[choice] || 0
          );

        const percentage =
          total > 0
            ? Math.round(
                (count / total) * 100
              )
            : 0;

        button.style.setProperty(
          "--vote-percent",
          `${percentage}%`
        );

        button.dataset.result =
          `${percentage}%`;
      });
    }
  );
}


/* =========================================================
   GLOBAL CLICK INTERACTIONS
========================================================= */

function setupVotingClicks() {
  document.addEventListener(
    "click",
    event => {
      const voteButton =
        event.target.closest(
          "[data-vote-group]"
        );

      if (voteButton) {
        handleVote(voteButton);
      }
    }
  );
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupNavigation() {
  const toggle =
    $("#menuToggle");

  const nav =
    $("#navLinks");

  if (
    !toggle ||
    !nav
  ) {
    return;
  }


  function closeMenu() {
    nav.classList.remove("open");

    document.body.classList.remove(
      "menu-open"
    );

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }


  function openMenu() {
    nav.classList.add("open");

    document.body.classList.add(
      "menu-open"
    );

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    toggle.setAttribute(
      "aria-label",
      "Close navigation menu"
    );
  }


  toggle.addEventListener(
    "click",
    () => {
      const open =
        nav.classList.contains(
          "open"
        );

      if (open) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  );


  $$("#navLinks a").forEach(link => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });


  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        nav.classList.contains("open")
      ) {
        closeMenu();
        toggle.focus();
      }
    }
  );


  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 980
      ) {
        closeMenu();
      }
    },
    {
      passive: true
    }
  );
}


/* =========================================================
   SCROLL PROGRESS + BACK TO TOP
========================================================= */

function setupScrollUI() {
  const progress =
    $("#scrollProgress");

  const backTop =
    $("#backTop");

  let scheduled = false;


  function update() {
    const scrollable =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (progress) {
      const percent =
        scrollable > 0
          ? Math.min(
              100,
              Math.max(
                0,
                (
                  window.scrollY /
                  scrollable
                ) * 100
              )
            )
          : 0;

      progress.style.width =
        `${percent}%`;
    }

    backTop?.classList.toggle(
      "visible",
      window.scrollY > 650
    );

    scheduled = false;
  }


  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;

      scheduled = true;

      requestAnimationFrame(
        update
      );
    },
    {
      passive: true
    }
  );


  backTop?.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );


  update();
}


/* =========================================================
   REVEAL / PROGRESS / COUNTER OBSERVERS
========================================================= */

function setupObservers() {
  const revealItems =
    $$(".reveal");


  if (
    !(
      "IntersectionObserver"
      in window
    )
  ) {
    revealItems.forEach(
      item =>
        item.classList.add(
          "visible"
        )
    );

    $$(".progress-row").forEach(
      row => {
        const bar =
          $(".bar i", row);

        if (bar) {
          bar.style.width =
            `${row.dataset.progress || 0}%`;
        }
      }
    );

    $$("[data-count]").forEach(
      element => {
        element.textContent =
          `${element.dataset.count || 0}${element.dataset.suffix || ""}`;
      }
    );

    return;
  }


  const revealObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: .10,
        rootMargin:
          "0px 0px -20px 0px"
      }
    );


  revealItems.forEach(
    item =>
      revealObserver.observe(
        item
      )
  );


  const progressObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            const row =
              entry.target;

            const bar =
              $(".bar i", row);

            if (bar) {
              bar.style.width =
                `${row.dataset.progress || 0}%`;
            }

            progressObserver.unobserve(
              row
            );
          }
        );
      },
      {
        threshold: .35
      }
    );


  $$(".progress-row").forEach(
    row =>
      progressObserver.observe(
        row
      )
  );


  const countObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            animateCounter(
              entry.target
            );

            countObserver.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: .45
      }
    );


  $$("[data-count]").forEach(
    element =>
      countObserver.observe(
        element
      )
  );
}


/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animateCounter(element) {
  const end =
    Number(
      element.dataset.count
    );

  const suffix =
    element.dataset.suffix || "";

  if (
    !Number.isFinite(end)
  ) {
    return;
  }

  const duration = 850;
  const startTime =
    performance.now();


  function frame(now) {
    const progress =
      Math.min(
        (
          now -
          startTime
        ) /
        duration,
        1
      );

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    element.textContent =
      `${Math.floor(end * eased)}${suffix}`;

    if (
      progress < 1
    ) {
      requestAnimationFrame(
        frame
      );
    }
  }


  requestAnimationFrame(
    frame
  );
}


/* =========================================================
   DETAILS / FULL ZODIAC COLLECTION
========================================================= */

function setupDetails() {
  const details =
    $(".full-zodiac-details");

  if (!details) return;


  details.addEventListener(
    "toggle",
    () => {
      if (!details.open) return;

      requestAnimationFrame(
        () => {
          $$(".zodiac-card", details)
            .forEach(card => {
              card.classList.add(
                "visible"
              );
            });
        }
      );
    }
  );
}


/* =========================================================
   RADIO CHOICE UX
========================================================= */

function setupChoiceChips() {
  document.addEventListener(
    "change",
    event => {
      const input =
        event.target.closest(
          ".choice-chip input"
        );

      if (!input) return;

      const groupName =
        input.name;

      if (!groupName) return;

      $$(
        `.choice-chip input[name="${groupName}"]`
      ).forEach(item => {
        const chip =
          item.closest(
            ".choice-chip"
          );

        chip?.classList.toggle(
          "selected",
          item.checked
        );
      });
    }
  );
}


/* =========================================================
   STARFIELD
========================================================= */

function setupStars() {
  const canvas =
    $("#starfield");

  const ctx =
    canvas?.getContext("2d");

  if (
    !canvas ||
    !ctx
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reducedMotion) {
    return;
  }


  let stars = [];
  let animationId = null;
  let resizeTimer = null;


  function resize() {
    const width =
      window.innerWidth;

    const height =
      window.innerHeight;

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        1.5
      );

    canvas.width =
      Math.floor(
        width * dpr
      );

    canvas.height =
      Math.floor(
        height * dpr
      );

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    const starCount =
      Math.min(
        95,
        Math.max(
          40,
          Math.floor(
            width / 13
          )
        )
      );


    stars =
      Array.from(
        {
          length:
            starCount
        },
        () => ({
          x:
            Math.random() *
            width,

          y:
            Math.random() *
            height,

          radius:
            Math.random() *
              1.05 +
            .2,

          alpha:
            Math.random() *
              .55 +
            .12,

          speed:
            Math.random() *
              .07 +
            .012
        })
      );
  }


  function draw() {
    if (
      !document.hidden
    ) {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );


      for (
        const star
        of stars
      ) {
        star.y +=
          star.speed;


        if (
          star.y >
          window.innerHeight
        ) {
          star.y = 0;

          star.x =
            Math.random() *
            window.innerWidth;
        }


        ctx.globalAlpha =
          star.alpha;

        ctx.fillStyle =
          "#bfeaff";

        ctx.beginPath();

        ctx.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }


      ctx.globalAlpha = 1;
    }


    animationId =
      requestAnimationFrame(
        draw
      );
  }


  resize();


  window.addEventListener(
    "resize",
    () => {
      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(
          resize,
          150
        );
    },
    {
      passive: true
    }
  );


  draw();


  window.addEventListener(
    "pagehide",
    () => {
      if (animationId) {
        cancelAnimationFrame(
          animationId
        );
      }
    },
    {
      once: true
    }
  );
}


/* =========================================================
   INITIALIZE SITE
========================================================= */

function initializeLumiSips() {
  renderZodiac();

  renderBattles();

  renderGemstones();

  restoreVotes();

  setupVoteResponses();

  setupVoteResults();

  setupVotingClicks();

  setupNavigation();

  setupScrollUI();

  setupObservers();

  setupDetails();

  setupChoiceChips();

  setupStars();
}


if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeLumiSips,
    {
      once: true
    }
  );
} else {
  initializeLumiSips();
    }
