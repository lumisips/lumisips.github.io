import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */

function cleanString(value, maxLength = 500) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value) {
  return cleanString(value, 254).toLowerCase();
}

function setFormStatus(form, message, state = "") {
  const status = form.querySelector(".form-status");

  if (!status) return;

  status.textContent = message;

  if (state) {
    status.dataset.state = state;
  } else {
    status.removeAttribute("data-state");
  }
}

function setSubmitting(form, submitting) {
  const button = form.querySelector('button[type="submit"]');

  if (!button) return;

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent.trim();
  }

  button.disabled = submitting;
  button.setAttribute("aria-busy", String(submitting));

  button.textContent = submitting
    ? "Sending..."
    : button.dataset.originalText;
}

/* -------------------------------------------------
   FORM DATA
------------------------------------------------- */

function getFormPayload(form) {
  const formData = new FormData(form);
  const payload = {};

  for (const [key, value] of formData.entries()) {
    if (key === "website") continue;

    payload[key] = cleanString(value);
  }

  if (payload.email) {
    payload.email = cleanEmail(payload.email);
  }

  payload.formId = form.id || "";
  payload.page = window.location.pathname;
  payload.createdAt = serverTimestamp();

  return payload;
}

/* -------------------------------------------------
   SPAM PROTECTION
------------------------------------------------- */

function isSpamSubmission(form) {
  const honeypot = form.querySelector('[name="website"]');

  return Boolean(honeypot?.value?.trim());
}

/* -------------------------------------------------
   FORM SUBMISSIONS
------------------------------------------------- */

async function submitForm(form) {
  if (isSpamSubmission(form)) {
    form.reset();
    setFormStatus(
      form,
      "Thanks! Your submission has been received.",
      "success"
    );
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const collectionName =
    form.dataset.collection || "communitySubmissions";

  const successMessage =
    form.dataset.success ||
    "Thanks! Your submission has been received.";

  const payload = getFormPayload(form);

  setSubmitting(form, true);
  setFormStatus(form, "Sending...");

  try {
    await addDoc(
      collection(db, collectionName),
      payload
    );

    form.reset();

    setFormStatus(
      form,
      successMessage,
      "success"
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
    setSubmitting(form, false);
  }
}

/* -------------------------------------------------
   CONNECT ALL AJAX FORMS
------------------------------------------------- */

function setupForms() {
  document
    .querySelectorAll(".ajax-form")
    .forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        submitForm(form);
      });
    });
}

/* -------------------------------------------------
   COMMUNITY VOTING
------------------------------------------------- */

async function saveVote(detail) {
  const group = cleanString(detail?.group, 50);
  const battleId = cleanString(detail?.battleId, 100);
  const choice = cleanString(detail?.choice, 150);

  if (!group || !battleId || !choice) {
    return;
  }

  try {
    await addDoc(
      collection(db, "votes"),
      {
        group,
        battleId,
        choice,
        page: window.location.pathname,
        createdAt: serverTimestamp()
      }
    );

    document.dispatchEvent(
      new CustomEvent("lumisips:vote-saved", {
        detail: {
          group,
          battleId,
          choice
        }
      })
    );
  } catch (error) {
    console.error(
      "LumiSips vote submission failed:",
      error
    );

    document.dispatchEvent(
      new CustomEvent("lumisips:vote-error", {
        detail: {
          group,
          battleId,
          choice
        }
      })
    );
  }
}

function setupVoting() {
  document.addEventListener(
    "lumisips:vote",
    event => {
      saveVote(event.detail);
    }
  );
}

/* -------------------------------------------------
   INITIALIZE
------------------------------------------------- */

function initializeLumiSipsFirebase() {
  setupForms();
  setupVoting();

  console.info(
    "LumiSips Firebase connected."
  );
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeLumiSipsFirebase,
    { once: true }
  );
} else {
  initializeLumiSipsFirebase();
}
