document.addEventListener("DOMContentLoaded", () => {
  // ─── Data config ────────────────────────────────────────────────
  // One skill = one carousel card. Add an image/link to fill it in,
  // leave them out for a placeholder. The carousel card count always
  // matches the number of skills.

  const skills = [
    {
      id: "typescript",
      name: "TypeScript/JavaScript",
      image: "img/typescript.png",
      link: "work.html",
      filter: "javascript",
    },
    {
      id: "nodejs",
      name: "Node.js",
      image: "img/node.js.png",
      link: "work.html",
      filter: "javascript",
    },
    {
      id: "express",
      name: "Express",
      image: "img/express.png",
      link: "work.html",
      filter: "javascript",
    },
    { id: "htmlcss", name: "HTML/CSS", image: "img/html-css.png", filter: "javascript" },
    { id: "java", name: "Java", image: "img/java.png", link: "work.html", filter: "java" },
    { id: "mysql", name: "MySQL", image: "img/sql.png" },
  ];

  // ─── Build skills grid ──────────────────────────────────────────

  const skillsGrid = document.querySelector(".skills-grid");
  if (skillsGrid) {
    skills.forEach((skill) => {
      const item = document.createElement("div");
      item.className = "skill-item";
      item.dataset.skill = skill.id;
      item.innerHTML = `<span class="skill-label">${skill.name}</span>`;
      skillsGrid.appendChild(item);
    });
  }

  // ─── Build carousel ─────────────────────────────────────────────

  const carouselTrack = document.querySelector(".carousel-track");
  const carouselDots = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const carouselEl = document.querySelector(".carousel");

  if (carouselTrack && skills.length > 0) {
    skills.forEach((skill, i) => {
      // Card
      const card = document.createElement("div");
      card.className = "photo-card" + (i === 0 ? " active" : "");
      card.dataset.skill = skill.id;

      if (skill.image) {
        card.innerHTML = `
          <img class="photo-card-img" src="${skill.image}" alt="${skill.name}">
          <a class="photo-card-btn" href="${skill.link || "#"}${skill.filter ? `?filter=${skill.filter}` : ""}#projects">
            View Project using <em>${skill.name}</em>
          </a>`;
      } else {
        card.innerHTML = `
          <div class="photo-card-img photo-card-placeholder">
            <span>${skill.name}</span>
          </div>
          <span class="photo-card-btn">
            <em>${skill.name}</em>
          </span>`;
      }

      carouselTrack.appendChild(card);
    });

    // Dots
    skills.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      carouselDots.appendChild(dot);
    });

    // ─── Carousel logic ───────────────────────────────────────────

    const cards = carouselTrack.querySelectorAll(".photo-card");
    const dots = carouselDots.querySelectorAll(".carousel-dot");
    const skillItems = document.querySelectorAll(".skill-item");
    let current = 0;
    const total = skills.length;
    const interval = 6000;
    let timer;
    let startTime;
    let remaining = interval;

    const highlightSkill = (skillId) => {
      skillItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.skill === skillId);
      });
    };

    const goTo = (index) => {
      cards[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + total) % total;
      cards[current].classList.add("active");
      dots[current].classList.add("active");
      carouselTrack.style.transform = `translateX(-${current * 100}%)`;
      highlightSkill(cards[current].dataset.skill);
    };

    const tick = () => {
      clearTimeout(timer);
      startTime = Date.now();
      timer = setTimeout(() => {
        goTo(current + 1);
        remaining = interval;
        tick();
      }, remaining);
    };

    const pauseTimer = () => {
      clearTimeout(timer);
      remaining = Math.max(remaining - (Date.now() - startTime), 0);
    };

    tick();
    highlightSkill(cards[0].dataset.skill);

    const resetTimer = () => {
      remaining = interval;
      tick();
    };

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        goTo(current - 1);
        resetTimer();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        goTo(current + 1);
        resetTimer();
      });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goTo(i);
        resetTimer();
      });
    });

    // Click a skill item → jump carousel to that skill's card
    skillItems.forEach((item) => {
      item.addEventListener("click", () => {
        const idx = skills.findIndex((s) => s.id === item.dataset.skill);
        if (idx !== -1) {
          goTo(idx);
          resetTimer();
        }
      });
    });

    // Pause on hover — stops countdown, resumes on leave from where it left off
    if (carouselEl) carouselEl.addEventListener("mouseenter", pauseTimer);
    if (carouselEl) carouselEl.addEventListener("mouseleave", tick);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", pauseTimer);
      card.addEventListener("mouseleave", tick);
    });
  }

  // ─── Hero entrance animation ────────────────────────────────────
  // Waits for all images to load, then adds .animate-in to trigger
  // CSS keyframe animations on the hero section elements.

  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title h1");
  const images = document.querySelectorAll("img");

  const startAnimation = () => {
    if (hero) {
      hero.classList.add("animate-in");
    }

  };

  // ─── Image preloader ────────────────────────────────────────────
  // Counts every <img> on the page. Once all have loaded or errored,
  // startAnimation() fires.

  if (images.length === 0) {
    startAnimation();
  } else {
    let loaded = 0;
    const total = images.length;

    const checkDone = () => {
      loaded++;
      if (loaded >= total) {
        startAnimation();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkDone();
      } else {
        img.addEventListener("load", checkDone);
        img.addEventListener("error", checkDone);
      }
    });
  }

  // ─── Render projects from shared data ──────────────────────────
  const projectsGrid = document.querySelector(".projects-grid");
  const projectsList = window.projectsData || [];

  if (projectsGrid && projectsList.length > 0) {
    projectsList.forEach((project) => {
      const item = document.createElement("div");
      item.className = "project-item";
      const borderClass = project.border === "orange" ? " border-orange" : "";
      const techHtml = project.tech.map((t) => `<span>${t}</span>`).join("");
      const imgHtml = project.image
        ? `<img class="card-img" src="${project.image}" alt="${project.title}" loading="lazy">`
        : `<div class="card-img card-img-placeholder"><span class="coming-soon">Coming Soon</span></div>`;
      item.innerHTML = `
        <div class="card${borderClass}">
          <h4>${project.title}</h4>
          ${imgHtml}
          <div class="card-body">
            <span class="kicker">${project.kicker}</span>
            <p>${project.description}</p>
            <div class="tech">${techHtml}</div>
          </div>
        </div>
      `;
      projectsGrid.appendChild(item);
    });
  }

  // ─── Scroll reveal observer ─────────────────────────────────────
  // Main.js handles [data-observe] with clip-path reveal.
  // This section only handles project cards with staggered timing.

  // ─── Project cards viewport reveal ──────────────────────────────
  // Each .project-item fades up and scales in (staggered via CSS
  // transition-delays) when it enters the viewport.

  const projectItems = document.querySelectorAll(".project-item");
  if (projectItems.length > 0) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("revealed", entry.isIntersecting);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    projectItems.forEach((item) => cardObserver.observe(item));
  }

  // ─── Skill items viewport reveal ────────────────────────────────
  // Each skill-item fades up with a stagger delay as it enters.

  const skillItems = document.querySelectorAll(".skill-item");
  if (skillItems.length > 0) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("skill-revealed", entry.isIntersecting);
        });
      },
      { threshold: 0.2 },
    );

    skillItems.forEach((item, i) => {
      item.style.setProperty("--i", i);
      skillObserver.observe(item);
    });
  }

  // ─── Page-specific parallax ────────────────────────────────────
  initHeroParallax(".hero-image-bg");
  initContentParallax(".skills-bg-1, .projects-bg-1");
});
