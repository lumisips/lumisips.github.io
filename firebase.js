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



/* =========================================
   FIREBASE CONFIG
========================================= */

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



/* =========================================
   CLEAN USER INPUT
========================================= */

function cleanString(
  value,
  maxLength = 1500
) {

  return String(
    value ?? ""
  )
    .trim()
    .slice(
      0,
      maxLength
    );

}



function cleanEmail(
  value
) {

  return cleanString(
    value,
    254
  ).toLowerCase();

}



function cleanZip(
  value
) {

  return cleanString(
    value,
    10
  )
    .replace(
      /[^0-9-]/g,
      ""
    );

}



/* =========================================
   FORM STATUS
========================================= */

function setFormStatus(
  form,
  message,
  state = ""
) {

  const status =
    form.querySelector(
      ".form-status"
    );


  if (!status) {
    return;
  }


  status.textContent =
    message;


  if (state) {

    status.dataset.state =
      state;

  } else {

    delete status.dataset.state;

  }

}



/* =========================================
   SUBMIT BUTTON STATE
========================================= */

function setSubmitting(
  form,
  submitting
) {

  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  if (!button) {
    return;
  }


  if (
    !button.dataset
      .originalText
  ) {

    button.dataset
      .originalText =
        button.textContent
          .trim();

  }


  button.disabled =
    submitting;


  button.setAttribute(
    "aria-busy",
    String(
      submitting
    )
  );


  button.textContent =
    submitting
      ? "Sending..."
      : button.dataset
          .originalText;

}



/* =========================================
   DEVICE ID
========================================= */

function getDeviceId() {

  const key =
    "lumisipsDeviceId";


  let id =
    localStorage.getItem(
      key
    );


  if (id) {
    return id;
  }


  id =
    window.crypto
      ?.randomUUID

      ? crypto.randomUUID()

      : `device-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;


  localStorage.setItem(
    key,
    id
  );


  return id;

}



const deviceId =
  getDeviceId();



/* =========================================
   FORM DATA
========================================= */

function getFormPayload(
  form
) {

  const formData =
    new FormData(
      form
    );


  const payload = {};



  for (
    const [
      key,
      rawValue
    ]
    of formData.entries()
  ) {

    if (
      key ===
      "website"
    ) {
      continue;
    }


    const value =
      cleanString(
        rawValue
      );


    /*
      Do not save
      blank optional fields.
    */

    if (!value) {
      continue;
    }


    payload[key] =
      value;

  }



  if (
    payload.email
  ) {

    payload.email =
      cleanEmail(
        payload.email
      );

  }



  if (
    payload.zip_code
  ) {

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



/* =========================================
   SPAM PROTECTION
========================================= */

function isSpamSubmission(
  form
) {

  return Boolean(

    form.querySelector(
      '[name="website"]'
    )
      ?.value
      ?.trim()

  );

}



/* =========================================
   COMMUNITY LAB VALIDATION
========================================= */

function validateCommunityIdea(
  form
) {

  if (
    form.id !==
    "ideaForm"
  ) {

    return true;

  }



  const fields = [

    "flavor_idea",

    "color_idea",

    "function_idea",

    "packaging_idea",

    "collaboration_idea"

  ];



  const hasIdea =
    fields.some(
      name =>

        cleanString(
          form.elements[
            name
          ]?.value
        )

    );



  if (hasIdea) {
    return true;
  }



  setFormStatus(

    form,

    "Open at least one category and add an idea before submitting.",

    "error"

  );



  form
    .querySelector(
      ".idea-module"
    )
    ?.scrollIntoView({

      behavior:
        "smooth",

      block:
        "center"

    });



  return false;

}



/* =========================================
   DUPLICATE SUBMISSION PROTECTION
========================================= */

function submissionFingerprint(
  collectionName,
  payload
) {

  const safe = {
    ...payload
  };


  delete safe.createdAt;



  return JSON.stringify({

    collectionName,

    payload:
      safe

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
        fingerprint

      &&

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

        time:
          Date.now()

      })

    );



  } catch {

    return false;

  }



  return false;

}



/* =========================================
   SUBMIT FORMS
========================================= */

async function submitForm(
  form
) {

  if (
    form.dataset
      .submitting ===
    "true"
  ) {

    return;

  }



  /*
    Honeypot spam.
    Pretend it succeeded
    without writing anything.
  */

  if (
    isSpamSubmission(
      form
    )
  ) {

    form.reset();


    setFormStatus(

      form,

      "Thanks! Your submission has been received.",

      "success"

    );


    return;

  }



  /*
    Native browser
    validation.
  */

  if (
    !form.checkValidity()
  ) {

    form.reportValidity();

    return;

  }



  /*
    Community Lab must
    contain at least one idea.
  */

  if (
    !validateCommunityIdea(
      form
    )
  ) {

    return;

  }



  const collectionName =
    cleanString(

      form.dataset.collection
      ||
      "communitySubmissions",

      80

    );



  const successMessage =

    form.dataset.success

    ||

    "Thanks! Your submission has been received.";



  const payload =
    getFormPayload(
      form
    );



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



    /*
      Close Community Lab
      sections after success.
    */

    form
      .querySelectorAll(
        ".idea-module[open]"
      )
      .forEach(
        module => {

          module.open =
            false;

        }
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



  } catch (
    error
  ) {

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



/* =========================================
   CONNECT ALL FORMS
========================================= */

function setupForms() {

  document
    .querySelectorAll(
      ".ajax-form"
    )
    .forEach(
      form => {

        form.addEventListener(

          "submit",

          event => {

            event.preventDefault();


            submitForm(
              form
            );

          }

        );

      }
    );

}



/* =========================================
   VOTE DOCUMENT ID
========================================= */

function safeVoteId(
  group,
  battleId
) {

  return `${deviceId}-${group}-${battleId}`

    .replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

}



/* =========================================
   SAVE VOTE
========================================= */

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



  try {

    await setDoc(

      doc(

        db,

        "votes",

        safeVoteId(
          group,
          battleId
        )

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

        merge:
          true

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



  } catch (
    error
  ) {

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



/* =========================================
   LOAD VOTE TOTALS
========================================= */

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

        const choice =
          cleanString(

            voteDocument
              .data()
              .choice,

            150

          );



        if (!choice) {
          return;
        }



        results[choice] =
          (
            results[choice]
            ||
            0
          )
          +
          1;

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



  } catch (
    error
  ) {

    console.info(

      "LumiSips vote totals unavailable:",

      error?.code
      ||
      error?.message
      ||
      error

    );

  }

}



/* =========================================
   LOAD EVERY VOTE CARD
========================================= */

async function loadAllVoteResults() {

  const battles =
    new Map();



  document
    .querySelectorAll(

      "[data-vote-group][data-battle-id]"

    )
    .forEach(
      button => {

        const group =
          cleanString(

            button.dataset
              .voteGroup,

            50

          );


        const battleId =
          cleanString(

            button.dataset
              .battleId,

            100

          );



        if (
          !group ||
          !battleId
        ) {

          return;

        }



        battles.set(

          `${group}:${battleId}`,

          {

            group,

            battleId

          }

        );

      }
    );



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



/* =========================================
   CONNECT VOTING
========================================= */

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



/* =========================================
   INITIALIZE FIREBASE
========================================= */

function initialize() {

  setupForms();

  setupVoting();



  setTimeout(

    loadAllVoteResults,

    250

  );



  console.info(

    "LumiSips Firebase connected."

  );

}



/* =========================================
   PAGE READY
========================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initialize,

    {
      once: true
    }

  );

} else {

  initialize();

}
