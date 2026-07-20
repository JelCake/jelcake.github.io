document.addEventListener("DOMContentLoaded", () => {

  // ─── Project data ────────────────────────────────────────────────

  const projects = window.projectsData || [];

  // ─── Render projects ───────────────────────────────────────────

  const grid = document.getElementById("projects-grid");

  function renderProjects(filter) {
    grid.innerHTML = "";
    const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

    filtered.forEach((p, i) => {
      const item = document.createElement("div");
      item.className = "project-item";
      item.dataset.category = p.category;

      const techHtml = p.tech.map((t) => `<span>${t}</span>`).join("");

      const linkHtml = p.link
        ? `<a href="${p.link}" class="project-link" target="_blank" rel="noopener">
             View Project Source Code <span class="arrow">&rarr;</span>
           </a>`
        : "";

      const borderClass = p.border === "orange" ? " border-orange" : "";

      const imgHtml = p.image
        ? `<img class="card-img" src="${p.image}" alt="${p.title}" loading="lazy">`
        : `<div class="card-img card-img-placeholder"><span class="coming-soon">Coming Soon</span></div>`;

      item.innerHTML = `
        <div class="card${borderClass}">
          ${imgHtml}
        </div>
        <div class="card-body">
          <span class="kicker">${p.kicker}</span>
          <h4>${p.title}</h4>
          <p>${p.description}</p>
          <div class="tech">${techHtml}</div>
          ${linkHtml}
        </div>
      `;

      grid.appendChild(item);
    });

    // Observe newly rendered items
    observeItems();
  }

  // ─── Reveal observer ─────────────────────────────────────────

  let cardObserver = null;

  function observeItems() {
    if (cardObserver) cardObserver.disconnect();

    const items = document.querySelectorAll(".project-item");
    if (!items.length) return;

    cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    items.forEach((item) => cardObserver.observe(item));
  }

  // ─── Filter buttons ─────────────────────────────────────────

  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.filter);
    });
  });

  // ─── Init ──────────────────────────────────────────────────────

  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get("filter") || "all";

  // Set active button to match the initial filter
  filterBtns.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === initialFilter);
  });

  renderProjects(initialFilter);

  // Scroll to projects section if navigated with hash
  if (window.location.hash === "#projects") {
    const target = document.getElementById("projects");
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  // ─── Hero entrance animation ──────────────────────────────────────

  const workHero = document.querySelector(".work-hero");
  const workImages = document.querySelectorAll("img");

  const startWorkAnimation = () => {
    if (workHero) workHero.classList.add("animate-in");
  };

  if (workImages.length === 0) {
    startWorkAnimation();
  } else {
    let loaded = 0;
    workImages.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded >= workImages.length) startWorkAnimation();
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded >= workImages.length) startWorkAnimation();
        });
        img.addEventListener("error", () => {
          loaded++;
          if (loaded >= workImages.length) startWorkAnimation();
        });
      }
    });
  }

  initHeroParallax(".work-image-bg");
});
