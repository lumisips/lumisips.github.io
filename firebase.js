import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ==========================================
// LumiSips Firebase Configuration
// ==========================================

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

// ==========================================
// Form Submission
// ==========================================

document.querySelectorAll(".ajax-form").forEach((form) => {

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const button = form.querySelector("button");
    const status = form.querySelector(".form-status");

    const originalText = button.innerText;

    button.disabled = true;
    button.innerText = "Submitting...";

    status.innerText = "";

    const formData = new FormData(form);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    let collectionName = "waitlist";

    switch (data.form_type) {

      case "Community Suggestion":
        collectionName = "communityIdeas";
        break;

      case "Contact Form":
        collectionName = "contactMessages";
        break;

      case "Waitlist Signup":
        collectionName = "waitlist";
        break;

    }

    try {

      await addDoc(collection(db, collectionName), {

        ...data,

        submittedAt: serverTimestamp(),

        source: "lumisips.github.io"

      });

      status.style.color = "#64ffb4";

      status.innerText =
        form.dataset.success ||
        "Successfully submitted!";

      form.reset();

    }

    catch (error) {

      console.error(error);

      status.style.color = "#ff6b6b";

      status.innerText =
        "Something went wrong. Please try again.";

    }

    button.disabled = false;
    button.innerText = originalText;

  });

});
