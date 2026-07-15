document.addEventListener("DOMContentLoaded", () => {

  // ─── Filter buttons ─────────────────────────────────────────────

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── Project cards viewport reveal ──────────────────────────────
  // Odd items slide from left, even from right. Reverses on leave.

  const projectItems = document.querySelectorAll(".project-item");
  if (projectItems.length > 0) {
    projectItems.forEach((item, i) => {
      if (i % 2 === 0) item.classList.add("from-left");
      else item.classList.add("from-right");
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("revealed", entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    projectItems.forEach((item) => cardObserver.observe(item));
  }

  // ─── Page-specific parallax ────────────────────────────────────
  initHeroParallax(".work-image-bg");
  initContentParallax(".projects-bg-1, .card-img");
});
