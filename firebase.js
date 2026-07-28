import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ================================
// PASTE YOUR FIREBASE CONFIG HERE
// ================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.querySelectorAll(".ajax-form").forEach((form) => {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const status = form.querySelector(".form-status");
    const button = form.querySelector("button");

    button.disabled = true;
    button.innerText = "Submitting...";

    status.innerText = "";

    const data = {};

    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });

    let collectionName = "waitlist";

    if (data.form_type === "Community Suggestion") {
      collectionName = "communityIdeas";
    }

    if (data.form_type === "Contact Form") {
      collectionName = "contactMessages";
    }

    if (data.form_type === "Waitlist Signup") {
      collectionName = "waitlist";
    }

    try {

      await addDoc(collection(db, collectionName), {

        ...data,

        submittedAt: serverTimestamp(),

        website: "lumisips.com"

      });

      status.style.color = "#64ffb4";
      status.innerText =
        form.dataset.success ||
        "Submitted successfully.";

      form.reset();

    }

    catch (error) {

      console.error(error);

      status.style.color = "#ff7070";
      status.innerText =
        "Submission failed. Please try again.";

    }

    button.disabled = false;
    button.innerText =
      button.dataset.original ||
      "Submit";

  });

});
