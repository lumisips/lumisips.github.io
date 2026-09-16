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



/* =========================================================
   TIMESTAMP FORMATTER
========================================================= */

function formatTimestamp(
  value
) {

  if (!value) {
    return "";
  }


  try {

    if (
      typeof value.toDate ===
      "function"
    ) {

      return value
        .toDate()
        .toISOString();

    }


    if (
      value.seconds
    ) {

      return new Date(

        value.seconds *
        1000

      ).toISOString();

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

      return parsed
        .toISOString();

    }


    return String(
      value
    );

  } catch {

    return "";

  }

}



/* =========================================================
   CSV SECURITY / ESCAPING
========================================================= */

function escapeCSV(
  value
) {

  let text =
    String(
      value ?? ""
    );


  /*
    Protect against spreadsheet
    formula injection.
  */

  if (
    /^[=+\-@]/.test(
      text
    )
  ) {

    text =
      `'${text}`;

  }


  return `"${text.replaceAll(
    '"',
    '""'
  )}"`;

}



/* =========================================================
   DOWNLOAD CSV
========================================================= */

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
        "\uFEFF",
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


  link.style.display =
    "none";



  document.body.appendChild(
    link
  );


  link.click();


  link.remove();



  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}



/* =========================================================
   READ FIRESTORE COLLECTION
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

      id:
        document.id,

      ...document.data()

    })

  );

}



/* =========================================================
   SORT NEWEST FIRST
========================================================= */

function timestampToMilliseconds(
  value
) {

  if (!value) {
    return 0;
  }


  try {

    if (
      typeof value.toDate ===
      "function"
    ) {

      return value
        .toDate()
        .getTime();

    }


    if (
      value.seconds
    ) {

      return value.seconds *
        1000;

    }


    const date =
      new Date(
        value
      );


    return Number.isNaN(
      date.getTime()
    )
      ? 0
      : date.getTime();

  } catch {

    return 0;

  }

}



function sortNewest(
  data
) {

  return [...data].sort(

    (
      a,
      b
    ) => {

      const first =
        timestampToMilliseconds(

          a.createdAt
          ||
          a.updatedAt

        );


      const second =
        timestampToMilliseconds(

          b.createdAt
          ||
          b.updatedAt

        );


      return second -
        first;

    }

  );

}



/* =========================================================
   WAITLIST EXPORT
========================================================= */

window.exportWaitlistCSV =
  async function () {

    try {

      const data =
        sortNewest(

          await readCollection(
            "waitlist"
          )

        );



      const rows = [

        [

          "Name",

          "Email",

          "Favorite Zodiac",

          "Preferred Line",

          "Email Consent",

          "Form Type",

          "Source",

          "Page",

          "Created At"

        ]

      ];



      data.forEach(
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
            user.zodiac
            ||
            "",

            user.preferred_line
            ||
            "",

            user.email_consent
            ||
            "",

            user.form_type
            ||
            "",

            user.source
            ||
            "",

            user.page
            ||
            "",

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



    } catch (
      error
    ) {

      console.error(

        "Waitlist export failed:",

        error

      );


      alert(

        "Could not export the LumiSips waitlist."

      );

    }

  };



/* =========================================================
   FIRST RELEASE / PURCHASE REQUEST EXPORT
========================================================= */

window.exportPurchaseRequestsCSV =
  async function () {

    try {

      const data =
        sortNewest(

          await readCollection(
            "purchaseRequests"
          )

        );



      const rows = [

        [

          "Name",

          "Email",

          "Quantity",

          "Flavor Interest",

          "Packaging",

          "ZIP Code",

          "Form Type",

          "Source",

          "Page",

          "Created At"

        ]

      ];



      data.forEach(
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

            request.form_type
            ||
            "",

            request.source
            ||
            "",

            request.page
            ||
            "",

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



    } catch (
      error
    ) {

      console.error(

        "Purchase request export failed:",

        error

      );


      alert(

        "Could not export LumiSips First Release requests."

      );

    }

  };



/* =========================================================
   COMMUNITY LAB EXPORT

   Supports:
   - New Flavor field
   - New Color field
   - New Function field
   - New Packaging field
   - New Collaboration field
   - Old category/message submissions
========================================================= */

window.exportCommunityIdeasCSV =
  async function () {

    try {

      const data =
        sortNewest(

          await readCollection(
            "communityIdeas"
          )

        );



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

          "Form Type",

          "Source",

          "Page",

          "Created At"

        ]

      ];



      data.forEach(
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

            idea.form_type
            ||
            "",

            idea.source
            ||
            "",

            idea.page
            ||
            "",

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



    } catch (
      error
    ) {

      console.error(

        "Community Lab export failed:",

        error

      );


      alert(

        "Could not export LumiSips Community Lab submissions."

      );

    }

  };



/* =========================================================
   VOTE EXPORT
========================================================= */

window.exportVotesCSV =
  async function () {

    try {

      const data =
        sortNewest(

          await readCollection(
            "votes"
          )

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

            vote.source
            ||
            "",

            vote.page
            ||
            "",

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



    } catch (
      error
    ) {

      console.error(

        "Vote export failed:",

        error

      );


      alert(

        "Could not export LumiSips votes."

      );

    }

  };



/* =========================================================
   COMPLETE DATA EXPORT
========================================================= */

window.exportAllLumiSipsData =
  async function () {

    try {

      await window
        .exportWaitlistCSV();



      await new Promise(
        resolve =>

          setTimeout(
            resolve,
            350
          )
      );



      await window
        .exportPurchaseRequestsCSV();



      await new Promise(
        resolve =>

          setTimeout(
            resolve,
            350
          )
      );



      await window
        .exportCommunityIdeasCSV();



      await new Promise(
        resolve =>

          setTimeout(
            resolve,
            350
          )
      );



      await window
        .exportVotesCSV();



    } catch (
      error
    ) {

      console.error(

        "Complete LumiSips export failed:",

        error

      );

    }

  };



/* =========================================================
   READY
========================================================= */

console.info(

  "LumiSips Firestore export tools ready."

);
