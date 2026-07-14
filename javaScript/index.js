document.addEventListener("DOMContentLoaded", () => {
  // ─── Data config ────────────────────────────────────────────────
  // One skill = one carousel card. Add an image/link to fill it in,
  // leave them out for a placeholder. The carousel card count always
  // matches the number of skills.

  const skills = [
    {
      id: "typescript",
      name: "TypeScript/JavaScript",
      image: "img/index-page/code-background.jpg",
      link: "work.html",
    },
    {
      id: "nodejs",
      name: "Node.js",
      image: "img/index-page/cool-face.jpg",
      link: "work.html",
    },
    {
      id: "express",
      name: "Express",
      image: "img/index-page/connected.jpg",
      link: "work.html",
    },
    { id: "htmlcss", name: "HTML/CSS" },
    { id: "java", name: "Java" },
    { id: "mysql", name: "MySQL" },
    { id: "git", name: "GIT" },
    { id: "drawio", name: "Draw.io" },
  ];

  // ─── Build skills grid ──────────────────────────────────────────

  const skillsGrid = document.querySelector(".skills-grid");
  if (skillsGrid) {
    skills.forEach((skill) => {
      const item = document.createElement("div");
      item.className = "skill-item";
      item.dataset.skill = skill.id;
      item.innerHTML = `<div class="skill-icon"></div><span class="skill-label">${skill.name}</span>`;
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
          <a class="photo-card-btn" href="${skill.link || "#"}">
            View Project using <em>${skill.name}</em>
          </a>`;
      } else {
        card.innerHTML = `
          <div class="photo-card-img photo-card-placeholder">
            <span>${skill.name}</span>
          </div>
          <a class="photo-card-btn" href="#">
            <em>${skill.name}</em> — coming soon
          </a>`;
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

    // ─── Scramble text effect ─────────────────────────────────────
    // Randomly cycles through letters before revealing the real text,
    // starts after the hero text has slid into view.

    let scrambleTriggered = false;
    const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const scrambleText = () => {
      if (scrambleTriggered || !heroTitle) return;
      scrambleTriggered = true;

      const lines = heroTitle.innerText.split("\n");
      const lineLengths = lines.map((l) => l.length);
      const totalLength = lineLengths.reduce((a, b) => a + b, 0);
      let revealed = 0;

      const interval = setInterval(() => {
        let charIndex = 0;
        const result = lines.map((line, li) => {
          const start = charIndex;
          charIndex += lineLengths[li];
          return line
            .split("")
            .map((letter, i) => {
              if (start + i < revealed) return letter;
              return scrambleChars[Math.floor(Math.random() * 26)];
            })
            .join("");
        });
        heroTitle.innerText = result.join("\n");

        if (revealed < totalLength) {
          revealed++;
        } else {
          clearInterval(interval);
        }
      }, 30);
    };

    setTimeout(scrambleText, 500);
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

  // ─── Scroll reveal observer ─────────────────────────────────────
  // Main.js handles [data-observe] with clip-path reveal.
  // This section only handles project cards with staggered timing.

  // ─── Project cards viewport reveal ──────────────────────────────
  // Each .project-item slides in from left or right based on column
  // position, with staggered delays. Reverses out when leaving.

  const projectItems = document.querySelectorAll(".project-item");
  if (projectItems.length > 0) {
    const cols = 3;

    projectItems.forEach((item, i) => {
      const col = i % cols;
      item.classList.add(col % 2 === 0 ? "from-left" : "from-right");
    });

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
});
