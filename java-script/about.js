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

  // ─── Timeline line scroll-fill + sync reveals ────────────
  const aboutContent = document.querySelector(".about-content");
  const tlLine = document.querySelector(".tl-line");
  const tlLineFill = document.querySelector(".tl-line-fill");
  const eduRows = document.querySelectorAll(".edu-row");
  const cardRevealThreshold = 0.15;

  const initRowPositions = () => {
    if (!eduRows.length || !aboutContent) return;
    const first = eduRows[0].getBoundingClientRect();
    const last = eduRows[eduRows.length - 1].getBoundingClientRect();
    const parentRect = aboutContent.getBoundingClientRect();

    const lineTop = first.top - parentRect.top;
    const lineBottom = last.bottom - parentRect.top;
    const lineHeight = (lineBottom - lineTop) * 0.9;

    [tlLine, tlLineFill].forEach((el) => {
      if (!el) return;
      el.style.top = `${lineTop}px`;
      el.style.height = `${lineHeight}px`;
    });

    const aboutContentTop = parentRect.top + window.scrollY;

    eduRows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowTop = rect.top - parentRect.top;
      const rowOffset = rowTop - lineTop;
      const rowEntryScroll = aboutContentTop + rowTop - window.innerHeight * 0.8;
      row._entryScroll = rowEntryScroll;
    });

    aboutContent._lineTop = lineTop;
    aboutContent._lineHeight = lineHeight;
    aboutContent._aboutTop = aboutContentTop;
  };

  if (aboutContent && tlLineFill) {
    initRowPositions();

    const updateFill = () => {
      const scrolled = window.scrollY;
      const lineTop = aboutContent._lineTop || 0;
      const lineHeight = aboutContent._lineHeight || 1;
      const aboutTop = aboutContent._aboutTop || 0;
      const startScroll = aboutTop + lineTop - window.innerHeight * 0.8;
      const scrollRange = lineHeight;
      let progress = 1;
      if (scrollRange > 0) {
        progress = Math.max(0, Math.min(1, (scrolled - startScroll) / scrollRange));
      }
      tlLineFill.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;

      eduRows.forEach((row) => {
        const entryScroll = row._entryScroll || 0;
        const revealScroll = entryScroll - cardRevealThreshold * lineHeight;
        if (scrolled >= revealScroll && !row.classList.contains("revealed")) {
          row.classList.add("revealed");
        }
      });
    };

    window.addEventListener("scroll", updateFill, { passive: true });
    window.addEventListener("resize", () => { initRowPositions(); updateFill(); });
    updateFill();
  }

  // ─── Parallax ───────────────────────────────────────────────
  initHeroParallax(".about-image-bg");
  initContentParallax(".education-item, .edu-img, .edu-backstory");
});
