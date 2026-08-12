import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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
   HELPERS
========================================================= */

function formatTimestamp(value) {
  if (!value) return "";

  try {
    if (
      typeof value.toDate === "function"
    ) {
      return value
        .toDate()
        .toISOString();
    }

    if (
      value.seconds
    ) {
      return new Date(
        value.seconds * 1000
      ).toISOString();
    }

    return String(value);
  } catch {
    return "";
  }
}


function escapeCSV(value) {
  const text =
    String(
      value ?? ""
    );

  return `"${text.replaceAll('"', '""')}"`;
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
      [csv],
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

  link.href = url;
  link.download = filename;

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
   READ COLLECTION
========================================================= */

async function readCollection(
  collectionName
) {
  const snapshot =
    await getDocs(
      collection(
        db,
        collectionName
      )
    );


  return snapshot.docs.map(
    document => ({
      id: document.id,
      ...document.data()
    })
  );
}


/* =========================================================
   WAITLIST EXPORT
========================================================= */

window.exportWaitlistCSV =
  async function () {
    try {
      const data =
        await readCollection(
          "waitlist"
        );


      const rows = [
        [
          "Name",
          "Email",
          "Favorite Zodiac",
          "Preferred Line",
          "Email Consent",
          "Source",
          "Page",
          "Created At"
        ]
      ];


      data.forEach(
        user => {
          rows.push([
            user.name || "",
            user.email || "",
            user.favorite_zodiac || "",
            user.preferred_line || "",
            user.email_consent || "",
            user.source || "",
            user.page || "",
            formatTimestamp(
              user.createdAt
            )
          ]);
        }
      );


      downloadCSV(
        "lumisips-waitlist.csv",
        rows
      );
    } catch (error) {
      console.error(
        "Waitlist export failed:",
        error
      );

      alert(
        "Could not export the waitlist."
      );
    }
  };


/* =========================================================
   PURCHASE REQUEST EXPORT
========================================================= */

window.exportPurchaseRequestsCSV =
  async function () {
    try {
      const data =
        await readCollection(
          "purchaseRequests"
        );


      const rows = [
        [
          "Name",
          "Email",
          "Quantity",
          "Flavor Interest",
          "Format",
          "ZIP Code",
          "Source",
          "Page",
          "Created At"
        ]
      ];


      data.forEach(
        request => {
          rows.push([
            request.name || "",
            request.email || "",
            request.quantity || "",
            request.flavor_interest || "",
            request.format || "",
            request.zip_code || "",
            request.source || "",
            request.page || "",
            formatTimestamp(
              request.createdAt
            )
          ]);
        }
      );


      downloadCSV(
        "lumisips-purchase-requests.csv",
        rows
      );
    } catch (error) {
      console.error(
        "Purchase request export failed:",
        error
      );

      alert(
        "Could not export purchase requests."
      );
    }
  };


/* =========================================================
   COMMUNITY IDEAS EXPORT
========================================================= */

window.exportCommunityIdeasCSV =
  async function () {
    try {
      const data =
        await readCollection(
          "communityIdeas"
        );


      const rows = [
        [
          "Name",
          "Email",
          "Category",
          "Zodiac",
          "Idea",
          "Source",
          "Page",
          "Created At"
        ]
      ];


      data.forEach(
        idea => {
          rows.push([
            idea.name || "",
            idea.email || "",
            idea.category || "",
            idea.zodiac || "",
            idea.message || "",
            idea.source || "",
            idea.page || "",
            formatTimestamp(
              idea.createdAt
            )
          ]);
        }
      );


      downloadCSV(
        "lumisips-community-ideas.csv",
        rows
      );
    } catch (error) {
      console.error(
        "Community ideas export failed:",
        error
      );

      alert(
        "Could not export community ideas."
      );
    }
  };


/* =========================================================
   VOTES EXPORT
========================================================= */

window.exportVotesCSV =
  async function () {
    try {
      const data =
        await readCollection(
          "votes"
        );


      const rows = [
        [
          "Group",
          "Battle ID",
          "Choice",
          "Device ID",
          "Source",
          "Page",
          "Updated At"
        ]
      ];


      data.forEach(
        vote => {
          rows.push([
            vote.group || "",
            vote.battleId || "",
            vote.choice || "",
            vote.deviceId || "",
            vote.source || "",
            vote.page || "",
            formatTimestamp(
              vote.updatedAt
            )
          ]);
        }
      );


      downloadCSV(
        "lumisips-votes.csv",
        rows
      );
    } catch (error) {
      console.error(
        "Vote export failed:",
        error
      );

      alert(
        "Could not export votes."
      );
    }
  };


/* =========================================================
   ALL DATA EXPORT
========================================================= */

window.exportAllLumiSipsData =
  async function () {
    try {
      await window.exportWaitlistCSV();

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            300
          )
      );

      await window.exportPurchaseRequestsCSV();

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            300
          )
      );

      await window.exportCommunityIdeasCSV();

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            300
          )
      );

      await window.exportVotesCSV();
    } catch (error) {
      console.error(
        "LumiSips full export failed:",
        error
      );
    }
  };


console.info(
  "LumiSips Firestore export tools ready."
);
