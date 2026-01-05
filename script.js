const DB_REPO = "friends-gallery-db";
const USERNAME = "tianten125";
const GALLERIES_FILE = "galleries.json";
const INVITES_FILE = "invite-codes.json";

const RAW_BASE = `https://raw.githubusercontent.com/${USERNAME}/${DB_REPO}/main`;

let currentCode = null;
let galleries = {};
let invites = {};

async function loadDB() {
  try {
    const gRes = await fetch(`${RAW_BASE}/${GALLERIES_FILE}`);
    galleries = await gRes.json();

    const iRes = await fetch(`${RAW_BASE}/${INVITES_FILE}`);
    invites = await iRes.json();

    renderGalleries();
  } catch (err) {
    console.error("Failed to load database", err);
  }
}

function login() {
  alert("login() is running");
  
  const code = document.getElementById("inviteCode").value.trim();
  const error = document.getElementById("login-error");

  error.textContent = "";

  if (!invites[code]) {
    error.textContent = "Invalid invite code";
    return;
  }

  if (galleries[code]) {
    error.textContent = "This invite code was already used";
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

function createGallery() {
  const name = document.getElementById("galleryName").value.trim();
  const urls = document
    .getElementById("imageUrls")
    .value.split("\n")
    .map(u => u.trim())
    .filter(Boolean);

  if (!name || urls.length === 0) {
    alert("Please enter a gallery name and image URLs.");
    return;
  }

  galleries[currentCode] = {
    name,
    images: urls
  };

  renderGalleries();
  alert("Gallery created locally ✅ (saving to GitHub comes next)");
}

loadDB();
