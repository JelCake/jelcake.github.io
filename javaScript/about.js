document.addEventListener("DOMContentLoaded", () => {

  // ─── Hero entrance animation ──────────────────────────────────────

  const aboutHero = document.querySelector(".about-hero");
  const aboutImages = document.querySelectorAll("img");

  const startAboutAnimation = () => {
    if (aboutHero) aboutHero.classList.add("animate-in");
  };

  if (aboutImages.length === 0) {
    startAboutAnimation();
  } else {
    let loaded = 0;
    aboutImages.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded >= aboutImages.length) startAboutAnimation();
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded >= aboutImages.length) startAboutAnimation();
        });
        img.addEventListener("error", () => {
          loaded++;
          if (loaded >= aboutImages.length) startAboutAnimation();
        });
      }
    });
  }

  // ─── Timeline line scroll-fill ─────────────────────────────
  const aboutContent = document.querySelector(".about-content");
  const tlLineFill = document.querySelector(".tl-line-fill");

  if (aboutContent && tlLineFill) {
    const updateFill = () => {
      const rect = aboutContent.getBoundingClientRect();
      const total = rect.height;
      const scrolled = -rect.top;
      const scrollable = total - window.innerHeight;
      if (scrollable <= 0) {
        tlLineFill.style.clipPath = "inset(0 0 0 0)";
        return;
      }
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      tlLineFill.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
    };

    window.addEventListener("scroll", updateFill, { passive: true });
    updateFill();
  }

  // ─── Parallax ───────────────────────────────────────────────
  initHeroParallax(".about-image-bg");
  initContentParallax(".education-item, .edu-img, .edu-backstory");
});
