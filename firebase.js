import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDW_HC9OVcpkLc4TFY6MR8brufTPniwXEg",
  authDomain: "lumisips-b280f.firebaseapp.com",
  projectId: "lumisips-b280f",
  storageBucket: "lumisips-b280f.firebasestorage.app",
  messagingSenderId: "980927514380",
  appId: "1:980927514380:web:5e92f1aeb27ba46a9eeb29"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =========================================================
   BASIC HELPERS
========================================================= */

function cleanString(
  value,
  maxLength = 500
) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}


function cleanEmail(value) {
  return cleanString(
    value,
    254
  ).toLowerCase();
}


function cleanZip(value) {
  return cleanString(
    value,
    10
  ).replace(
    /[^0-9-]/g,
    ""
  );
}


function setFormStatus(
  form,
  message,
  state = ""
) {
  const status =
    form.querySelector(
      ".form-status"
    );

  if (!status) return;

  status.textContent =
    message;

  if (state) {
    status.dataset.state =
      state;
  } else {
    delete status.dataset.state;
  }
}


function setSubmitting(
  form,
  submitting
) {
  const button =
    form.querySelector(
      'button[type="submit"]'
    );

  if (!button) return;

  if (
    !button.dataset.originalText
  ) {
    button.dataset.originalText =
      button.textContent.trim();
  }

  button.disabled =
    submitting;

  button.setAttribute(
    "aria-busy",
    String(submitting)
  );

  button.textContent =
    submitting
      ? "Sending..."
      : button.dataset.originalText;
}


/* =========================================================
   DEVICE ID

   Used to prevent repeated votes from the same browser
   creating endless duplicate vote documents.
========================================================= */

function getDeviceId() {
  const storageKey =
    "lumisipsDeviceId";

  let deviceId =
    localStorage.getItem(
      storageKey
    );

  if (deviceId) {
    return deviceId;
  }

  if (
    window.crypto &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    deviceId =
      crypto.randomUUID();
  } else {
    deviceId =
      `device-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
  }

  localStorage.setItem(
    storageKey,
    deviceId
  );

  return deviceId;
}


const deviceId =
  getDeviceId();


/* =========================================================
   FORM PAYLOAD
========================================================= */

function getFormPayload(form) {
  const formData =
    new FormData(form);

  const payload = {};

  for (
    const [key, value]
    of formData.entries()
  ) {
    if (
      key === "website"
    ) {
      continue;
    }

    payload[key] =
      cleanString(value);
  }


  if (payload.email) {
    payload.email =
      cleanEmail(
        payload.email
      );
  }


  if (payload.zip_code) {
    payload.zip_code =
      cleanZip(
        payload.zip_code
      );
  }


  payload.formId =
    form.id || "";

  payload.source =
    "lumisips.com";

  payload.page =
    window.location.pathname;

  payload.createdAt =
    serverTimestamp();


  return payload;
}


/* =========================================================
   HONEYPOT SPAM CHECK
========================================================= */

function isSpamSubmission(
  form
) {
  const honeypot =
    form.querySelector(
      '[name="website"]'
    );

  return Boolean(
    honeypot?.value?.trim()
  );
}


/* =========================================================
   SHORT DUPLICATE FORM GUARD

   Stops accidental rapid double-submits of identical data.
========================================================= */

function submissionFingerprint(
  collectionName,
  payload
) {
  const safePayload = {
    ...payload
  };

  delete safePayload.createdAt;

  return JSON.stringify({
    collectionName,
    payload: safePayload
  });
}


function recentlySubmitted(
  fingerprint
) {
  const key =
    "lumisipsLastSubmission";

  try {
    const stored =
      JSON.parse(
        sessionStorage.getItem(
          key
        ) || "{}"
      );

    if (
      stored.fingerprint ===
        fingerprint &&
      Date.now() -
        Number(
          stored.time || 0
        ) <
        10000
    ) {
      return true;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        fingerprint,
        time: Date.now()
      })
    );
  } catch {
    return false;
  }

  return false;
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

async function submitForm(
  form
) {
  if (
    form.dataset.submitting ===
      "true"
  ) {
    return;
  }


  if (
    isSpamSubmission(form)
  ) {
    form.reset();

    setFormStatus(
      form,
      "Thanks! Your submission has been received.",
      "success"
    );

    return;
  }


  if (
    !form.checkValidity()
  ) {
    form.reportValidity();
    return;
  }


  const collectionName =
    cleanString(
      form.dataset.collection ||
        "communitySubmissions",
      80
    );


  const successMessage =
    form.dataset.success ||
    "Thanks! Your submission has been received.";


  const payload =
    getFormPayload(form);


  const fingerprint =
    submissionFingerprint(
      collectionName,
      payload
    );


  if (
    recentlySubmitted(
      fingerprint
    )
  ) {
    setFormStatus(
      form,
      "That request was already received.",
      "success"
    );

    return;
  }


  form.dataset.submitting =
    "true";

  setSubmitting(
    form,
    true
  );

  setFormStatus(
    form,
    "Sending..."
  );


  try {
    await addDoc(
      collection(
        db,
        collectionName
      ),
      payload
    );


    form.reset();


    form
      .querySelectorAll(
        ".choice-chip.selected"
      )
      .forEach(
        chip =>
          chip.classList.remove(
            "selected"
          )
      );


    setFormStatus(
      form,
      successMessage,
      "success"
    );


    document.dispatchEvent(
      new CustomEvent(
        "lumisips:form-saved",
        {
          detail: {
            formId:
              form.id,

            collection:
              collectionName
          }
        }
      )
    );
  } catch (error) {
    console.error(
      `LumiSips ${collectionName} submission failed:`,
      error
    );


    setFormStatus(
      form,
      "Something went wrong while sending. Please try again.",
      "error"
    );
  } finally {
    form.dataset.submitting =
      "false";

    setSubmitting(
      form,
      false
    );
  }
}


/* =========================================================
   CONNECT FORMS
========================================================= */

function setupForms() {
  document
    .querySelectorAll(
      ".ajax-form"
    )
    .forEach(form => {
      form.addEventListener(
        "submit",
        event => {
          event.preventDefault();

          submitForm(form);
        }
      );
    });
}


/* =========================================================
   VOTE DOCUMENT ID

   One document per browser + battle.

   If the visitor changes their vote later,
   the existing document is updated instead
   of creating a second vote.
========================================================= */

function safeVoteId(
  group,
  battleId
) {
  const base =
    `${deviceId}-${group}-${battleId}`;

  return base.replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );
}


/* =========================================================
   SAVE VOTE
========================================================= */

async function saveVote(
  detail
) {
  const group =
    cleanString(
      detail?.group,
      50
    );

  const battleId =
    cleanString(
      detail?.battleId,
      100
    );

  const choice =
    cleanString(
      detail?.choice,
      150
    );


  if (
    !group ||
    !battleId ||
    !choice
  ) {
    return;
  }


  const voteId =
    safeVoteId(
      group,
      battleId
    );


  try {
    await setDoc(
      doc(
        db,
        "votes",
        voteId
      ),
      {
        group,
        battleId,
        choice,

        deviceId,

        source:
          "lumisips.com",

        page:
          window.location.pathname,

        updatedAt:
          serverTimestamp()
      },
      {
        merge: true
      }
    );


    document.dispatchEvent(
      new CustomEvent(
        "lumisips:vote-saved",
        {
          detail: {
            group,
            battleId,
            choice
          }
        }
      )
    );


    await loadVoteResults(
      group,
      battleId
    );
  } catch (error) {
    console.error(
      "LumiSips vote submission failed:",
      error
    );


    document.dispatchEvent(
      new CustomEvent(
        "lumisips:vote-error",
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
}


/* =========================================================
   READ VOTE RESULTS
========================================================= */

async function loadVoteResults(
  group,
  battleId
) {
  try {
    const voteQuery =
      query(
        collection(
          db,
          "votes"
        ),
        where(
          "group",
          "==",
          group
        ),
        where(
          "battleId",
          "==",
          battleId
        )
      );


    const snapshot =
      await getDocs(
        voteQuery
      );


    const results = {};


    snapshot.forEach(
      voteDocument => {
        const data =
          voteDocument.data();

        const choice =
          cleanString(
            data.choice,
            150
          );

        if (!choice) return;

        results[choice] =
          (
            results[choice] ||
            0
          ) + 1;
      }
    );


    document.dispatchEvent(
      new CustomEvent(
        "lumisips:vote-results",
        {
          detail: {
            group,
            battleId,
            results
          }
        }
      )
    );
  } catch (error) {
    /*
      Some Firestore configurations may allow
      public writes but intentionally block
      public reads.

      Voting still works in that situation.
      Results simply stay hidden until read
      permissions are enabled.
    */

    console.info(
      "LumiSips vote totals unavailable:",
      error?.code ||
      error?.message ||
      error
    );
  }
}


/* =========================================================
   LOAD EXISTING VOTE TOTALS
========================================================= */

async function loadAllVoteResults() {
  const battles =
    new Map();


  document
    .querySelectorAll(
      "[data-vote-group][data-battle-id]"
    )
    .forEach(button => {
      const group =
        cleanString(
          button.dataset.voteGroup,
          50
        );

      const battleId =
        cleanString(
          button.dataset.battleId,
          100
        );


      if (
        !group ||
        !battleId
      ) {
        return;
      }


      const key =
        `${group}:${battleId}`;


      if (
        !battles.has(key)
      ) {
        battles.set(
          key,
          {
            group,
            battleId
          }
        );
      }
    });


  for (
    const {
      group,
      battleId
    }
    of battles.values()
  ) {
    await loadVoteResults(
      group,
      battleId
    );
  }
}


/* =========================================================
   VOTE EVENT LISTENER
========================================================= */

function setupVoting() {
  document.addEventListener(
    "lumisips:vote",
    event => {
      saveVote(
        event.detail
      );
    }
  );
}


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

function initializeLumiSipsFirebase() {
  setupForms();

  setupVoting();


  /*
    script.js renders voting controls before this
    module initializes in normal page loading.

    Small delay gives dynamically rendered vote
    cards time to exist before totals are requested.
  */

  setTimeout(
    loadAllVoteResults,
    250
  );


  console.info(
    "LumiSips Firebase connected."
  );
}


if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeLumiSipsFirebase,
    {
      once: true
    }
  );
} else {
  initializeLumiSipsFirebase();
}
