document.addEventListener("DOMContentLoaded", () => {
  // The year pin + transition is pure CSS (position: sticky) — no JS needed.
  // Only the parallax drift on the cards/photos/watermarks is JS-driven
  // via the shared helpers in main.js.

  initHeroParallax(".about-image-bg");
  initContentParallax(".education-item, .edu-img, .edu-backstory");
});
