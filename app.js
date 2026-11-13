const projects = {
  botanical: {
    features: ["Ribbon-tied opening animation", "Wedding itinerary and venue details", "Guest RSVP layout"],
    frames: ["Ribbon-tied cover", "Opened garden invitation"],
    demo: "./demos/botanical/index.html"
  },
  royal: {
    features: ["Carved gate opening animation", "Multi-day celebration itinerary", "Venue directions and guest RSVP"],
    frames: ["Palace gates", "Opened royal invitation"],
    demo: "./demos/royal/index.html"
  },
  gilded: {
    features: ["Personalised monogram", "Cinematic opening sequence", "Engagement details and venue information"],
    frames: ["Monogram cover", "Reception hall reveal"]
  },
  silver: {
    features: ["Animated wax seal and envelope", "Lace-edged anniversary letter", "Celebration details"],
    frames: ["Wax-sealed envelope", "Anniversary letter"],
    demo: "./demos/silver/index.html"
  }
};

const preview = document.querySelector("#preview-dialog");
const inquiry = document.querySelector("#inquiry-dialog");
const menuToggle = document.querySelector(".menu-toggle");
const menuLabel = menuToggle.querySelector("[data-menu-label]");
const filters = document.querySelector(".filters");
const pieces = [...document.querySelectorAll(".piece")];
const previewImage = document.querySelector("#preview-image");
const previewCaption = document.querySelector("#preview-caption");
const previewDemo = document.querySelector("#preview-demo");
const inquiryForm = document.querySelector("#inquiry-form");
const occasion = document.querySelector("#inquiry-occasion");

let activePiece;
let previewOrigin;
let frameIndex = 0;
let inquiryDesign = "";
let inquiryOrigin;

function renderFrame(index) {
  const key = activePiece.dataset.project;
  const { frames } = projects[key];
  frameIndex = (index + frames.length) % frames.length;
  const label = frames[frameIndex];
  previewImage.alt = label;
  previewImage.src = `./assets/${key}-${frameIndex === 0 ? "cover" : "open"}.webp`;
  previewCaption.textContent = `${label} · ${frameIndex + 1} of ${frames.length}`;
}

function openPreview(piece, origin) {
  previewOrigin = origin;
  activePiece = piece;
  const { features, demo } = projects[piece.dataset.project];
  document.querySelector("#preview-title").textContent = piece.querySelector("h3").textContent;
  document.querySelector("#preview-type").textContent = piece.querySelector(".piece-type").textContent;
  document.querySelector("#preview-description").textContent = piece.querySelector(".piece-description").textContent;
  document.querySelector("#preview-price").textContent = `${piece.querySelector(".piece-price").textContent.trim()} · Indicative`;
  document.querySelector("#preview-features").replaceChildren(...features.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));
  previewDemo.hidden = !demo;
  if (demo) previewDemo.href = demo;
  renderFrame(0);
  preview.showModal();
}

function openInquiry(origin, piece) {
  inquiryOrigin = origin;
  inquiryDesign = piece?.querySelector("h3").textContent || "";
  occasion.value = piece ? piece.dataset.category.replace(/^./, (letter) => letter.toUpperCase()) : "";
  document.querySelector("#inquiry-intro").textContent = inquiryDesign
    ? `Ask about personalising ${inquiryDesign} for your celebration.`
    : "Share a few details to start your conversation on WhatsApp.";
  inquiry.showModal();
}

function useDialogLink(link, callback) {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    callback();
  });
}

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuLabel.textContent = open ? "Close" : "Menu";
}

menuToggle.hidden = false;
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
document.querySelectorAll("#navigation a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.querySelector(".header").addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

filters.hidden = false;
const filterButtons = [...filters.querySelectorAll("button")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    pieces.forEach((piece) => {
      piece.hidden = category !== "all" && piece.dataset.category !== category;
    });
    const count = pieces.filter((piece) => !piece.hidden).length;
    document.querySelector("#filter-status").textContent = `${count} ${count === 1 ? "design" : "designs"} shown.`;
  });
});

if (typeof preview.showModal === "function") {
  pieces.forEach((piece) => {
    piece.querySelectorAll("[data-preview]").forEach((link) => useDialogLink(link, () => openPreview(piece, link)));
  });

  document.querySelector("#preview-prev").addEventListener("click", () => renderFrame(frameIndex - 1));
  document.querySelector("#preview-next").addEventListener("click", () => renderFrame(frameIndex + 1));
  preview.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      renderFrame(frameIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  document.querySelectorAll("[data-inquire]").forEach((link) => {
    useDialogLink(link, () => openInquiry(link));
  });
  useDialogLink(document.querySelector("#preview-inquire"), () => {
    preview.close();
    openInquiry(previewOrigin, activePiece);
  });

  inquiry.addEventListener("close", () => inquiryOrigin?.focus({ preventScroll: true }));
  inquiryForm.addEventListener("submit", () => {
    const name = document.querySelector("#inquiry-name").value.trim();
    const date = document.querySelector("#inquiry-date").value;
    const details = document.querySelector("#inquiry-details").value.trim();
    const lines = [
      `Hi Eternal Blyss! I’m ${name}. I’d love to discuss an invitation website.`,
      `Occasion: ${occasion.value}`
    ];
    if (inquiryDesign) lines.push(`Design: ${inquiryDesign}`);
    if (date) lines.push(`Event date: ${date}`);
    if (details) lines.push(`Ideas: ${details}`);
    document.querySelector("#inquiry-text").value = lines.join("\n");
  });
}
