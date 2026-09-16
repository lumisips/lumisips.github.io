import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
  getFirestore,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyDW_HC9OVcpkLc4TFY6MR8brufTPniwXEg",

  authDomain:
    "lumisips-b280f.firebaseapp.com",

  projectId:
    "lumisips-b280f",

  storageBucket:
    "lumisips-b280f.firebasestorage.app",

  messagingSenderId:
    "980927514380",

  appId:
    "1:980927514380:web:5e92f1aeb27ba46a9eeb29"

};



const app =
  initializeApp(
    firebaseConfig
  );


const db =
  getFirestore(
    app
  );


const auth =
  getAuth(
    app
  );


const provider =
  new GoogleAuthProvider();



/* =========================================================
   FOUNDER ACCESS

   IMPORTANT:
   Replace the text below with the SAME authorized Google
   email address that was already inside your old dashboard.js.

   Firestore security rules should still provide the actual
   server-side protection.
========================================================= */

const FOUNDER_EMAIL =
  "YOUR_AUTHORIZED_GOOGLE_EMAIL";



/* =========================================================
   STATE
========================================================= */

let waitlistData = [];

let purchaseData = [];

let ideaData = [];

let voteData = [];


let unsubscribeListeners = [];



/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id =>
  document.getElementById(
    id
  );



function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



function clean(
  value
) {

  const text =
    String(
      value ?? ""
    ).trim();


  return text ||
    "Not provided";

}



function setText(
  id,
  value
) {

  const element =
    $(id);


  if (element) {

    element.textContent =
      String(
        value
      );

  }

}



function setHTML(
  id,
  html
) {

  const element =
    $(id);


  if (element) {

    element.innerHTML =
      html;

  }

}



/* =========================================================
   DATE HELPERS
========================================================= */

function timestampToDate(
  value
) {

  if (!value) {
    return null;
  }


  try {

    if (
      typeof value.toDate ===
      "function"
    ) {

      return value.toDate();

    }


    if (
      value.seconds
    ) {

      return new Date(
        value.seconds *
        1000
      );

    }


    const parsed =
      new Date(
        value
      );


    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {

      return parsed;

    }

  } catch {

    return null;

  }


  return null;

}



function formatDate(
  value
) {

  const date =
    timestampToDate(
      value
    );


  if (!date) {

    return "—";

  }


  return new Intl
    .DateTimeFormat(

      "en-US",

      {

        dateStyle:
          "medium",

        timeStyle:
          "short"

      }

    )
    .format(
      date
    );

}



function sortNewest(
  a,
  b
) {

  const first =
    timestampToDate(

      a.createdAt ||
      a.updatedAt

    )?.getTime() ||
    0;


  const second =
    timestampToDate(

      b.createdAt ||
      b.updatedAt

    )?.getTime() ||
    0;


  return second -
    first;

}



/* =========================================================
   AUTH SCREEN
========================================================= */

function ensureAuthUI() {

  let authPanel =
    $("authPanel");


  if (authPanel) {

    return;

  }



  authPanel =
    document.createElement(
      "section"
    );


  authPanel.id =
    "authPanel";


  authPanel.innerHTML = `

    <div class="card auth-card">

      <h2>
        Founder Access
      </h2>


      <p id="authMessage">

        Sign in with the authorized
        LumiSips founder account.

      </p>


      <button
        id="loginButton"
        type="button"
      >

        Sign in with Google

      </button>


      <button
        id="logoutButton"
        type="button"
        hidden
      >

        Sign out

      </button>

    </div>

  `;



  const main =
    document.querySelector(
      "main"
    );


  if (main) {

    main.prepend(
      authPanel
    );

  }



  $("loginButton")
    ?.addEventListener(

      "click",

      login

    );



  $("logoutButton")
    ?.addEventListener(

      "click",

      logout

    );

}



/* =========================================================
   SHOW / HIDE DASHBOARD
========================================================= */

function setDashboardVisible(
  visible
) {

  document
    .querySelectorAll(

      "main > section:not(#authPanel)"

    )
    .forEach(
      section => {

        section.hidden =
          !visible;

      }
    );

}



/* =========================================================
   LOGIN
========================================================= */

async function login() {

  try {

    await signInWithPopup(

      auth,

      provider

    );

  } catch (
    error
  ) {

    console.error(

      "Dashboard login failed:",

      error

    );


    setText(

      "authMessage",

      "Sign-in failed. Please try again."

    );

  }

}



/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

  try {

    await signOut(
      auth
    );

  } catch (
    error
  ) {

    console.error(

      "Dashboard logout failed:",

      error

    );

  }

}



/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(

  auth,

  user => {

    ensureAuthUI();



    if (!user) {

      stopFirestoreListeners();


      setDashboardVisible(
        false
      );


      setText(

        "authMessage",

        "Sign in with the authorized LumiSips founder account."

      );


      if (
        $("loginButton")
      ) {

        $("loginButton")
          .hidden =
          false;

      }


      if (
        $("logoutButton")
      ) {

        $("logoutButton")
          .hidden =
          true;

      }


      return;

    }



    const email =
      String(

        user.email ||
        ""

      ).toLowerCase();



    if (

      FOUNDER_EMAIL ===
      "YOUR_AUTHORIZED_GOOGLE_EMAIL"

    ) {

      stopFirestoreListeners();


      setDashboardVisible(
        false
      );


      setText(

        "authMessage",

        "Dashboard setup incomplete. Add the authorized founder email inside dashboard.js."

      );


      $("loginButton") &&
        (
          $("loginButton")
            .hidden =
            true
        );


      $("logoutButton") &&
        (
          $("logoutButton")
            .hidden =
            false
        );


      return;

    }



    if (

      email !==
      FOUNDER_EMAIL
        .toLowerCase()

    ) {

      stopFirestoreListeners();


      setDashboardVisible(
        false
      );


      setText(

        "authMessage",

        "This Google account is not authorized for the LumiSips Founder Dashboard."

      );


      if (
        $("loginButton")
      ) {

        $("loginButton")
          .hidden =
          true;

      }


      if (
        $("logoutButton")
      ) {

        $("logoutButton")
          .hidden =
          false;

      }


      return;

    }



    setText(

      "authMessage",

      "Founder account authenticated."

    );



    if (
      $("loginButton")
    ) {

      $("loginButton")
        .hidden =
        true;

    }



    if (
      $("logoutButton")
    ) {

      $("logoutButton")
        .hidden =
        false;

    }



    setDashboardVisible(
      true
    );


    startFirestoreListeners();

  }

);



/* =========================================================
   WAITLIST
========================================================= */

function renderWaitlist(
  users = waitlistData
) {

  if (
    !users.length
  ) {

    setHTML(

      "waitlist",

      `

        <div class="item">

          No waitlist signups yet.

        </div>

      `

    );


    return;

  }



  setHTML(

    "waitlist",

    users

      .map(
        user => `

          <div class="wait-card">


            <h3>

              ${escapeHTML(

                clean(
                  user.name
                )

              )}

            </h3>



            <p>

              <strong>
                Email:
              </strong>

              ${escapeHTML(

                clean(
                  user.email
                )

              )}

            </p>



            <p>

              <strong>
                Zodiac:
              </strong>

              ${escapeHTML(

                clean(

                  user.favorite_zodiac
                  ||
                  user.zodiac

                )

              )}

            </p>



            <p>

              <strong>
                Preferred Line:
              </strong>

              ${escapeHTML(

                clean(
                  user.preferred_line
                )

              )}

            </p>



            <small>

              ${escapeHTML(

                formatDate(
                  user.createdAt
                )

              )}

            </small>


          </div>

        `
      )

      .join("")

  );

}



/* =========================================================
   PURCHASE REQUESTS
========================================================= */

function renderPurchases() {

  const target =
    $("purchaseRequests");


  if (!target) {
    return;
  }



  if (
    !purchaseData.length
  ) {

    target.innerHTML = `

      <div class="item">

        No First Release requests yet.

      </div>

    `;


    return;

  }



  target.innerHTML =

    purchaseData

      .map(
        request => `

          <div class="wait-card">


            <h3>

              ${escapeHTML(

                clean(
                  request.name
                )

              )}

            </h3>



            <p>

              <strong>
                Email:
              </strong>

              ${escapeHTML(

                clean(
                  request.email
                )

              )}

            </p>



            <p>

              <strong>
                Quantity:
              </strong>

              ${escapeHTML(

                clean(
                  request.quantity
                )

              )}

            </p>



            <p>

              <strong>
                Flavor:
              </strong>

              ${escapeHTML(

                clean(
                  request.flavor_interest
                )

              )}

            </p>



            <p>

              <strong>
                Packaging:
              </strong>

              ${escapeHTML(

                clean(
                  request.format
                )

              )}

            </p>



            <p>

              <strong>
                ZIP:
              </strong>

              ${escapeHTML(

                clean(
                  request.zip_code
                )

              )}

            </p>



            <small>

              ${escapeHTML(

                formatDate(
                  request.createdAt
                )

              )}

            </small>


          </div>

        `
      )

      .join("");

}



/* =========================================================
   COMMUNITY LAB

   SUPPORTS BOTH:
   - New five-category submissions
   - Old category + message submissions
========================================================= */

function renderIdeas() {

  const target =
    $("suggestions");


  if (!target) {
    return;
  }



  if (
    !ideaData.length
  ) {

    target.innerHTML = `

      <div class="item">

        No Community Lab ideas yet.

      </div>

    `;


    return;

  }



  target.innerHTML =

    ideaData

      .map(
        idea => {


          const categories = [

            [
              "Flavor",
              idea.flavor_idea
            ],

            [
              "Color",
              idea.color_idea
            ],

            [
              "Function",
              idea.function_idea
            ],

            [
              "Packaging",
              idea.packaging_idea
            ],

            [
              "Collaboration",
              idea.collaboration_idea
            ]

          ]

            .filter(

              (
                [
                  ,
                  value
                ]
              ) =>

                String(
                  value ||
                  ""
                )
                  .trim()

            );



          const newIdeasHTML =

            categories

              .map(

                (
                  [
                    label,
                    value
                  ]
                ) => `

                  <div class="idea-dashboard-row">

                    <strong>

                      ${escapeHTML(
                        label
                      )}:

                    </strong>

                    <p>

                      ${escapeHTML(

                        clean(
                          value
                        )

                      )}

                    </p>

                  </div>

                `

              )

              .join("");



          const legacyHTML =

            idea.message

              ? `

                  <div class="idea-dashboard-row">

                    <strong>

                      ${escapeHTML(

                        clean(

                          idea.category
                          ||
                          "Legacy Idea"

                        )

                      )}:

                    </strong>

                    <p>

                      ${escapeHTML(

                        clean(
                          idea.message
                        )

                      )}

                    </p>

                  </div>

                `

              : "";



          const ideasHTML =

            newIdeasHTML
            ||
            legacyHTML
            ||
            `

              <p>

                No idea content provided.

              </p>

            `;



          return `

            <div class="wait-card">


              <h3>

                Community Lab Submission

              </h3>



              ${ideasHTML}



              <p>

                <strong>
                  Zodiac:
                </strong>

                ${escapeHTML(

                  clean(
                    idea.zodiac
                  )

                )}

              </p>



              <small>

                ${escapeHTML(

                  clean(
                    idea.name
                  )

                )}

                •

                ${escapeHTML(

                  clean(
                    idea.email
                  )

                )}

                •

                ${escapeHTML(

                  formatDate(
                    idea.createdAt
                  )

                )}

              </small>


            </div>

          `;

        }

      )

      .join("");

}



/* =========================================================
   VOTE ANALYTICS
========================================================= */

function renderVotes() {

  const target =
    $("votes");


  if (!target) {
    return;
  }



  if (
    !voteData.length
  ) {

    target.innerHTML = `

      <div class="item">

        No votes yet.

      </div>

    `;


    setText(
      "totalVotes",
      0
    );


    setText(
      "topZodiac",
      "—"
    );


    return;

  }



  setText(

    "totalVotes",

    voteData.length

  );



  const grouped =
    new Map();



  voteData.forEach(
    vote => {

      const battle =

        vote.battleId
        ||
        "unknown";


      const choice =

        vote.choice
        ||
        "Unknown";



      if (
        !grouped.has(
          battle
        )
      ) {

        grouped.set(

          battle,

          new Map()

        );

      }



      const battleVotes =
        grouped.get(
          battle
        );



      battleVotes.set(

        choice,

        (
          battleVotes.get(
            choice
          )
          ||
          0
        )
        +
        1

      );

    }
  );



  const sections = [];



  grouped.forEach(

    (
      choices,
      battleId
    ) => {


      const entries =

        [
          ...choices.entries()
        ]

          .sort(

            (
              a,
              b
            ) =>

              b[1] -
              a[1]

          );



      const total =

        entries.reduce(

          (
            sum,
            entry
          ) =>

            sum +
            entry[1],

          0

        );



      const rows =

        entries

          .map(

            (
              [
                choice,
                count
              ]
            ) => {


              const percent =

                total

                  ? Math.round(

                      (
                        count /
                        total
                      )
                      *
                      100

                    )

                  : 0;



              return `

                <div class="vote-row">


                  <div class="vote-top">


                    <span>

                      ${escapeHTML(
                        choice
                      )}

                    </span>


                    <strong>

                      ${count}

                      (${percent}%)

                    </strong>


                  </div>



                  <div class="bar">


                    <span
                      style="
                        width:
                        ${percent}%
                      "
                    ></span>


                  </div>


                </div>

              `;

            }

          )

          .join("");



      sections.push(`

        <div class="vote-battle">


          <h3>

            ${escapeHTML(
              battleId
            )}

          </h3>


          ${rows}


        </div>

      `);

    }

  );



  target.innerHTML =
    sections.join("");



  const overallChoices =
    new Map();



  voteData.forEach(
    vote => {


      const choice =

        vote.choice
        ||
        "Unknown";



      overallChoices.set(

        choice,

        (
          overallChoices.get(
            choice
          )
          ||
          0
        )
        +
        1

      );

    }
  );



  const leading =

    [
      ...overallChoices.entries()
    ]

      .sort(

        (
          a,
          b
        ) =>

          b[1] -
          a[1]

      )[0];



  setText(

    "topZodiac",

    leading
      ? leading[0]
      : "—"

  );

}



/* =========================================================
   DASHBOARD SUMMARY
========================================================= */

function updateSummary() {

  setText(

    "members",

    waitlistData.length

  );



  setText(

    "purchaseCount",

    purchaseData.length

  );



  setText(

    "ideaCount",

    ideaData.length

  );



  const latest = [

    ...waitlistData.map(
      item => ({

        type:
          "Waitlist",

        name:
          item.name
          ||
          item.email,

        date:
          item.createdAt

      })
    ),


    ...purchaseData.map(
      item => ({

        type:
          "First Release",

        name:
          item.name
          ||
          item.email,

        date:
          item.createdAt

      })
    ),


    ...ideaData.map(
      item => ({

        type:
          "Community Idea",

        name:
          item.name
          ||
          item.email,

        date:
          item.createdAt

      })
    )

  ]

    .sort(

      (
        a,
        b
      ) => {


        const first =

          timestampToDate(
            a.date
          )?.getTime()
          ||
          0;


        const second =

          timestampToDate(
            b.date
          )?.getTime()
          ||
          0;


        return second -
          first;

      }

    )[0];



  setText(

    "latestSignup",

    latest

      ? `${latest.name} — ${latest.type}`

      : "—"

  );

}



/* =========================================================
   REALTIME FIRESTORE LISTENERS
========================================================= */

function startFirestoreListeners() {

  stopFirestoreListeners();



  unsubscribeListeners.push(

    onSnapshot(

      collection(
        db,
        "waitlist"
      ),

      snapshot => {


        waitlistData =

          snapshot.docs

            .map(
              document => ({

                id:
                  document.id,

                ...document.data()

              })
            )

            .sort(
              sortNewest
            );



        renderWaitlist();


        updateSummary();

      },

      error => {

        console.error(

          "Waitlist listener failed:",

          error

        );

      }

    )

  );



  unsubscribeListeners.push(

    onSnapshot(

      collection(
        db,
        "purchaseRequests"
      ),

      snapshot => {


        purchaseData =

          snapshot.docs

            .map(
              document => ({

                id:
                  document.id,

                ...document.data()

              })
            )

            .sort(
              sortNewest
            );



        renderPurchases();


        updateSummary();

      },

      error => {

        console.error(

          "Purchase listener failed:",

          error

        );

      }

    )

  );



  unsubscribeListeners.push(

    onSnapshot(

      collection(
        db,
        "communityIdeas"
      ),

      snapshot => {


        ideaData =

          snapshot.docs

            .map(
              document => ({

                id:
                  document.id,

                ...document.data()

              })
            )

            .sort(
              sortNewest
            );



        renderIdeas();


        updateSummary();

      },

      error => {

        console.error(

          "Community Lab listener failed:",

          error

        );

      }

    )

  );



  unsubscribeListeners.push(

    onSnapshot(

      collection(
        db,
        "votes"
      ),

      snapshot => {


        voteData =

          snapshot.docs

            .map(
              document => ({

                id:
                  document.id,

                ...document.data()

              })
            );



        renderVotes();


        updateSummary();

      },

      error => {

        console.error(

          "Vote listener failed:",

          error

        );

      }

    )

  );

}



/* =========================================================
   STOP LISTENERS
========================================================= */

function stopFirestoreListeners() {

  unsubscribeListeners

    .forEach(
      unsubscribe => {

        try {

          unsubscribe();

        } catch {

          // No action needed.

        }

      }
    );


  unsubscribeListeners = [];

}



/* =========================================================
   WAITLIST SEARCH
========================================================= */

$("searchInput")
  ?.addEventListener(

    "input",

    event => {


      const term =

        String(

          event.target.value
          ||
          ""

        )

          .trim()
          .toLowerCase();



      if (!term) {

        renderWaitlist(
          waitlistData
        );


        return;

      }



      const filtered =

        waitlistData.filter(

          user =>

            String(
              user.name
              ||
              ""
            )
              .toLowerCase()
              .includes(
                term
              )

            ||

            String(
              user.email
              ||
              ""
            )
              .toLowerCase()
              .includes(
                term
              )

            ||

            String(
              user.favorite_zodiac
              ||
              ""
            )
              .toLowerCase()
              .includes(
                term
              )

        );



      renderWaitlist(
        filtered
      );

    }

  );



/* =========================================================
   CSV HELPERS
========================================================= */

function escapeCSV(
  value
) {

  return `"${String(

    value ??
    ""

  ).replaceAll(

    '"',
    '""'

  )}"`;

}



function downloadCSV(
  filename,
  rows
) {

  const csv =

    rows

      .map(

        row =>

          row

            .map(
              escapeCSV
            )

            .join(",")

      )

      .join("\n");



  const blob =

    new Blob(

      [
        csv
      ],

      {

        type:
          "text/csv;charset=utf-8"

      }

    );



  const url =
    URL.createObjectURL(
      blob
    );



  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    filename;



  document.body.appendChild(
    link
  );


  link.click();


  link.remove();



  URL.revokeObjectURL(
    url
  );

}



/* =========================================================
   EXPORT WAITLIST
========================================================= */

window.exportWaitlistCSV =
  function () {


    const rows = [

      [

        "Name",

        "Email",

        "Favorite Zodiac",

        "Preferred Line",

        "Email Consent",

        "Created At"

      ]

    ];



    waitlistData.forEach(
      user => {


        rows.push([

          user.name
          ||
          "",

          user.email
          ||
          "",

          user.favorite_zodiac
          ||
          "",

          user.preferred_line
          ||
          "",

          user.email_consent
          ||
          "",

          formatDate(
            user.createdAt
          )

        ]);

      }
    );



    downloadCSV(

      "lumisips-waitlist.csv",

      rows

    );

  };



/* =========================================================
   EXPORT PURCHASE REQUESTS
========================================================= */

window.exportPurchaseRequestsCSV =
  function () {


    const rows = [

      [

        "Name",

        "Email",

        "Quantity",

        "Flavor",

        "Packaging",

        "ZIP",

        "Created At"

      ]

    ];



    purchaseData.forEach(
      request => {


        rows.push([

          request.name
          ||
          "",

          request.email
          ||
          "",

          request.quantity
          ||
          "",

          request.flavor_interest
          ||
          "",

          request.format
          ||
          "",

          request.zip_code
          ||
          "",

          formatDate(
            request.createdAt
          )

        ]);

      }
    );



    downloadCSV(

      "lumisips-purchase-requests.csv",

      rows

    );

  };



/* =========================================================
   EXPORT COMMUNITY LAB

   NEW FIVE-CATEGORY FORMAT
   PLUS OLD SUBMISSION COMPATIBILITY
========================================================= */

window.exportCommunityIdeasCSV =
  function () {


    const rows = [

      [

        "Name",

        "Email",

        "Flavor Idea",

        "Color Idea",

        "Function Idea",

        "Packaging Idea",

        "Collaboration Idea",

        "Zodiac",

        "Legacy Category",

        "Legacy Idea",

        "Created At"

      ]

    ];



    ideaData.forEach(
      idea => {


        rows.push([

          idea.name
          ||
          "",

          idea.email
          ||
          "",

          idea.flavor_idea
          ||
          "",

          idea.color_idea
          ||
          "",

          idea.function_idea
          ||
          "",

          idea.packaging_idea
          ||
          "",

          idea.collaboration_idea
          ||
          "",

          idea.zodiac
          ||
          "",

          idea.category
          ||
          "",

          idea.message
          ||
          "",

          formatDate(
            idea.createdAt
          )

        ]);

      }
    );



    downloadCSV(

      "lumisips-community-ideas.csv",

      rows

    );

  };



/* =========================================================
   EXPORT VOTES
========================================================= */

window.exportVotesCSV =
  function () {


    const rows = [

      [

        "Group",

        "Battle ID",

        "Choice",

        "Device ID",

        "Updated At"

      ]

    ];



    voteData.forEach(
      vote => {


        rows.push([

          vote.group
          ||
          "",

          vote.battleId
          ||
          "",

          vote.choice
          ||
          "",

          vote.deviceId
          ||
          "",

          formatDate(
            vote.updatedAt
          )

        ]);

      }
    );



    downloadCSV(

      "lumisips-votes.csv",

      rows

    );

  };



/* =========================================================
   EXPORT EVERYTHING
========================================================= */

window.exportAllLumiSipsData =
  function () {


    window.exportWaitlistCSV();


    setTimeout(
      () => {

        window
          .exportPurchaseRequestsCSV();

      },
      250
    );


    setTimeout(
      () => {

        window
          .exportCommunityIdeasCSV();

      },
      500
    );


    setTimeout(
      () => {

        window
          .exportVotesCSV();

      },
      750
    );

  };



/* =========================================================
   INITIALIZE
========================================================= */

ensureAuthUI();


setDashboardVisible(
  false
);


console.info(

  "LumiSips Founder Dashboard ready."

);
