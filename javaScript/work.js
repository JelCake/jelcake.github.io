document.addEventListener("DOMContentLoaded", () => {

  // ─── Project data ────────────────────────────────────────────────

  const projects = [
    {
      id: 1,
      kicker: "Web Application",
      title: "Project One",
      description: "A web application that simplifies task management with real-time collaboration features.",
      tech: ["React", "Node.js", "Socket.io"],
      category: "web",
      link: "https://github.com/yourusername/project-one",
    },
    {
      id: 2,
      kicker: "Open Source",
      title: "Project Two",
      description: "An open-source utility library that helps developers handle common data transformations.",
      tech: ["TypeScript", "Vitest"],
      category: "web",
      link: "https://github.com/yourusername/project-two",
    },
    {
      id: 3,
      kicker: "Design System",
      title: "Project Three",
      description: "A design system with reusable components built for consistency across products.",
      tech: ["React", "Storybook", "CSS Modules"],
      category: "design",
      link: "https://github.com/yourusername/project-one",
    },
    {
      id: 4,
      kicker: "This Website",
      title: "This Portfolio",
      description: "The very website you're browsing — built from scratch with a focus on clean design and smooth interactions.",
      tech: ["HTML/CSS", "JavaScript"],
      category: "web",
      link: "https://github.com/yourusername/portfolio",
    },
    {
      id: 5,
      kicker: "Algorithms",
      title: "C++ Algorithms",
      description: "A collection of data structures and algorithms implemented in C++, including sorting, searching, and graph traversals.",
      tech: ["C++"],
      category: "cpp",
      link: "https://github.com/yourusername/cpp-algorithms",
    },
  ];

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

      item.innerHTML = `
        <div class="card">
          <div class="card-img">[Image]</div>
        </div>
        <div class="card-body">
          <span class="kicker">${p.kicker}</span>
          <h4>${p.title}</h4>
          <p>${p.description}</p>
          <div class="tech">${techHtml}</div>
          <a href="${p.link}" class="project-link" target="_blank" rel="noopener">
            View Project Source Code <span class="arrow">&rarr;</span>
          </a>
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
          entry.target.classList.toggle("revealed", entry.isIntersecting);
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
  initContentParallax(".card-img");
});