document.addEventListener("DOMContentLoaded", () => {

  // ─── Hero entrance animation ──────────────────────────────────────

  const contactHero = document.querySelector(".contact-hero");
  const contactImages = document.querySelectorAll("img");

  const startContactAnimation = () => {
    if (contactHero) contactHero.classList.add("animate-in");
  };

  if (contactImages.length === 0) {
    startContactAnimation();
  } else {
    let loaded = 0;
    contactImages.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded >= contactImages.length) startContactAnimation();
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded >= contactImages.length) startContactAnimation();
        });
        img.addEventListener("error", () => {
          loaded++;
          if (loaded >= contactImages.length) startContactAnimation();
        });
      }
    });
  }

  document.querySelectorAll("[data-observe]").forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
          window.dispatchEvent(
            new CustomEvent("viewport:change", {
              detail: {
                element: entry.target,
                isIntersecting: entry.isIntersecting,
              },
            }),
          );
        });
      },
      { threshold: 0 },
    );
    observer.observe(el);
  });

  // ─── Contact cards scroll-reveal ────────────────────────────────

  const cards = document.querySelectorAll(".contact-link-card");
  if (cards.length) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    cards.forEach((card) => cardObserver.observe(card));
  }

  // ─── Page-specific parallax ────────────────────────────────────
  initHeroParallax(".contact-image-bg");
});
