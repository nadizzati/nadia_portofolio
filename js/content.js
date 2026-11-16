/* ==========================================================================
   The one file you edit to add your own material.
   Save it, commit, push. The site updates itself.
   ========================================================================== */

/* ---------- 1. Documents ----------
   Files inside this repo (assets/docs/) download directly when clicked.
   To update a document, replace the PDF in assets/docs/ with the same file name.
   Leave "" to show "Link coming soon".

   A full link (https://...) also works, but it opens in a new tab instead of downloading,
   because browsers only force a download for files hosted on the same site.
   Think twice before publishing a transcript or a CV with a phone number to a public
   page: anyone on the internet can open it. */
window.DOCUMENTS = {
  cv: "assets/docs/Nadia_Izzati_CV.pdf",
  transcript: "assets/docs/Nadia_Izzati_Transcript.pdf"
};

/* ---------- 1b. Project screenshots (optional) ----------
   Put a picture in assets/photos/ and map it to the project id used in index.html
   (data-id). The picture then appears inside that project when it is expanded.
   Example:  "zerotouch-net": { src: "assets/photos/zerotouch-topology.jpg", alt: "Network topology" }  */
window.PROJECT_IMAGES = {
  // "zerotouch-net": { src: "assets/photos/zerotouch-topology.jpg", alt: "Network topology of ZeroTouch-Net" },
};

/* ---------- 2. Moments (photos and videos) ----------
   Leave the list empty and the whole "Moments" section stays hidden.
   Each item is one line. Types:

   Photo stored in this repo (put the file in assets/photos/):
     { type: "image", src: "assets/photos/berkemas-1.jpg", alt: "Volunteers handing out snack boxes", caption: "Berkemas Drive Thru, 2025" },

   Short video stored in this repo (keep it under ~20 MB, put it in assets/videos/):
     { type: "video", src: "assets/videos/lab-demo.mp4", caption: "Network lab demo" },

   YouTube (best for long videos; upload as "Unlisted" and copy the id after v=):
     { type: "youtube", id: "dQw4w9WgXcQ", caption: "Campus Dash gameplay" },

   Google Drive video (share as "Anyone with the link", copy the id between /d/ and /view):
     { type: "drive", id: "1AbCdEfGhIjKlMnOpQrStUvWxYz", caption: "Event recap" },
*/
window.GALLERY = [
  // { type: "image", src: "assets/photos/example.jpg", alt: "Describe the photo", caption: "Short caption" },
];
