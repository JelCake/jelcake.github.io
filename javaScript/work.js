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
      { threshold: 0.2 },
    );

    projectItems.forEach((item) => cardObserver.observe(item));
  }

  // ─── Scroll reveal observer ─────────────────────────────────────

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
});
