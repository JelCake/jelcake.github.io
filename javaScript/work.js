document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
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
          console.log(
            `Viewport: ${entry.target.className} is ${entry.isIntersecting ? "in" : "out of"} view`,
          );
        });
      },
      { threshold: 0 },
    );
    observer.observe(el);
  });
});
