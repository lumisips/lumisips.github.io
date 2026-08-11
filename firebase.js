import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW_HC9OVcpkLc4TFY6MR8brufTPniwXEg",
  authDomain: "lumisips-b280f.firebaseapp.com",
  projectId: "lumisips-b280f",
  storageBucket: "lumisips-b280f.firebasestorage.app",
  messagingSenderId: "980927514380",
  appId: "1:980927514380:web:5e92f1aeb27ba46a9eeb29",
  measurementId: "G-D307MPGWL1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*
 * LumiSips Firebase form routing
 *
 * data-collection on the form takes priority.
 * This prevents forms from accidentally being written
 * to the wrong Firestore collection.
 */
function getCollectionName(form) {
  const declaredCollection = form.dataset.collection?.trim();

  if (declaredCollection) {
    return declaredCollection;
  }

  const formType =
    form.querySelector('[name="form_type"]')?.value?.trim();

  switch (formType) {
    case "Community Idea":
    case "Community Suggestion":
      return "communityIdeas";

    case "Contact Form":
      return "contactMessages";

    case "Purchase Request":
      return "purchaseRequests";

    case "Waitlist Signup":
      return "waitlist";

    default:
      return "waitlist";
  }
}

/*
 * Basic client-side spam protection.
 */
function isSpam(form) {
  const honeypot = form.querySelector('[name="website"]');
  return Boolean(honeypot?.value?.trim());
}

/*
 * Generic LumiSips AJAX form handler.
 */
document.querySelectorAll(".ajax-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-status");

    if (!button || !status) {
      console.error("LumiSips form is missing its submit button or status element.");
      return;
    }

    if (isSpam(form)) {
      return;
    }

    const originalButtonText = button.innerText;

    button.disabled = true;
    button.innerText = "Submitting...";
    status.innerText = "";
    status.removeAttribute("data-state");

    try {
      const formData = new FormData(form);
      const data = {};

      formData.forEach((value, key) => {
        if (key !== "website") {
          data[key] = value;
        }
      });

      const collectionName = getCollectionName(form);

      await addDoc(collection(db, collectionName), {
        ...data,
        submittedAt: serverTimestamp(),
        source: "lumisips.github.io"
      });

      status.style.color = "#64ffb4";
      status.dataset.state = "success";
      status.innerText =
        form.dataset.success || "Successfully submitted!";

      form.reset();

    } catch (error) {
      console.error(
        `LumiSips submission failed for collection "${getCollectionName(form)}":`,
        error
      );

      status.style.color = "#ff6b6b";
      status.dataset.state = "error";
      status.innerText =
        "Something went wrong. Please try again.";

    } finally {
      button.disabled = false;
      button.innerText = originalButtonText;
    }
  });
});


/*
 * Centralized community voting
 *
 * script.js dispatches:
 *
 * document.dispatchEvent(
 *   new CustomEvent("lumisips:vote", {
 *     detail: {
 *       group,
 *       battleId,
 *       choice
 *     }
 *   })
 * );
 */
document.addEventListener("lumisips:vote", async (event) => {
  const { group, battleId, choice } = event.detail || {};

  if (!group || !battleId || !choice) {
    console.warn("Invalid LumiSips vote:", event.detail);
    return;
  }

  try {
    await addDoc(collection(db, "votes"), {
      group,
      battleId,
      choice,
      submittedAt: serverTimestamp(),
      source: "lumisips.github.io"
    });

    /*
     * Tell the UI that the vote was successfully saved.
     */
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
    console.error("LumiSips vote submission failed:", error);

    document.dispatchEvent(
      new CustomEvent("lumisips:vote-error", {
        detail: {
          group,
          battleId,
          choice,
          error
        }
      })
    );
  }
});
