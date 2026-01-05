const GALLERIES_URL =
  "https://raw.githubusercontent.com/tianten125/friends-gallery-db/main/galleries.json";

const INVITES_URL =
  "https://raw.githubusercontent.com/tianten125/friends-gallery-db/main/invite-codes.json";

let currentCode = null;
let galleries = {};
let invites = {};

async function loadDB() {
  try {
    const gRes = await fetch(GALLERIES_URL);
    if (!gRes.ok) throw new Error("Failed to load galleries.json");
    galleries = await gRes.json();

    const iRes = await fetch(INVITES_URL);
    if (!iRes.ok) throw new Error("Failed to load invite-codes.json");
    invites = await iRes.json();

    console.log("INVITES LOADED:", invites);
    renderGalleries();
  } catch (err) {
    console.error("DB LOAD ERROR:", err);
  }
}

function login() {
  const code = document.getElementById("inviteCode").value.trim();
  const error = document.getElementById("login-error");
  error.textContent = "";

  if (!(code in invites)) {
    error.textContent = "Invalid invite code";
    return;
  }

  currentCode = code;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");
}

function renderGalleries() {
  const container = document.getElementById("gallery-list");
  container.innerHTML = "";

  const keys = Object.keys(galleries);
  if (keys.length === 0) {
    container.innerHTML = "<p>No galleries yet.</p>";
    return;
  }

  keys.forEach(code => {
    const gallery = galleries[code];
    const section = document.createElement("section");
    section.className = "gallery-section";

    const title = document.createElement("h3");
    title.textContent = gallery.name;
    section.appendChild(title);

    const wrap = document.createElement("div");
    wrap.className = "gallery";

    gallery.images.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.loading = "lazy";
      wrap.appendChild(img);
    });

    section.appendChild(wrap);
    container.appendChild(section);
  });
}

loadDB();
