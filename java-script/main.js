// ─── Page transitions ─────────────────────────────────────────────
// Shows the loader on link click, navigates after a brief delay.

const pageEl = document.getElementById("page");
const loader = document.querySelector(".loader");

const TRANSITION_MS = 800;

if (pageEl) pageEl.classList.add("page-enter");

if (loader) {
  document.querySelectorAll('a[href*=".html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === window.location.pathname.split("/").pop()) return;
      e.preventDefault();

      loader.style.zIndex = "";
      loader.style.background = "";
      loader.classList.remove("hidden");
      loader.style.display = "";

      setTimeout(() => { window.location.href = href; }, TRANSITION_MS);
    });
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      loader.classList.add("hidden");
      loader.style.display = "";
    }
  });
}

// ─── Header scroll effect ─────────────────────────────────────────
// Toggles .scrolled on <header> when the page has scrolled past the
// hero, so the nav gets a solid background / blur.

(function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  const checkScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
  };

  checkScroll();
  window.addEventListener("scroll", checkScroll, { passive: true });
})();

// ─── Magnetic hover on nav links + social links ──────────────────
// Elements subtly follow the cursor when hovered, snap back on leave.

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const magneticEls = document.querySelectorAll("header nav a, .social-link, .show-more-btn");

if (!prefersReducedMotion) {
  magneticEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => { el.style.transition = ""; }, 400);
    });
  });
}

// ─── Reusable parallax helpers ───────────────────────────────────
// Page-specific scripts (index.js / work.js / about.js / contact.js)
// call these with the selectors that exist on their own page, so the
// parallax logic lives in one shared place while the triggers stay
// per-page. Carousels (.photo-card-img) are intentionally excluded.

function initHeroParallax(selector) {
  const bgs = document.querySelectorAll(selector);
  if (bgs.length === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  let ready = false;
  setTimeout(() => { ready = true; }, 1500);

  window.addEventListener("scroll", () => {
    if (!ticking && ready) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        bgs.forEach((bg) => {
          bg.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.25}px))`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initContentParallax(selector) {
  const pics = document.querySelectorAll(selector);
  if (pics.length === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const measure = () => {
    pics.forEach((el) => {
      el.style.setProperty("--py", "0px");
      const rect = el.getBoundingClientRect();
      el._baseCenter = rect.top + window.scrollY + rect.height / 2;
      el._speed =
        parseFloat(el.dataset.speed) ||
        (el.classList.contains("card-img") ||
          el.classList.contains("edu-img") ||
          el.classList.contains("edu-year")
          ? 0.05
          : 0.14);
    });
  };

  let ticking = false;

  const apply = () => {
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    pics.forEach((el) => {
      const distance = (el._baseCenter || 0) - viewportCenter;
      el.style.setProperty("--py", `${(-distance * el._speed).toFixed(2)}px`);
    });
    ticking = false;
  };

  measure();
  apply();

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    measure();
    apply();
  });
}

// ─── Smooth section reveal ────────────────────────────────────
// Sections animate in from the bottom with a clip-path sweep as
// they enter the viewport.

const revealSections = document.querySelectorAll("[data-observe]");

if (revealSections.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        } else {
          entry.target.style.opacity = "0";
          entry.target.style.transform = "translateY(30px)";
        }
      });
    },
    { threshold: 0.08 },
  );

  revealSections.forEach((el) => {
    if (el.classList.contains("hero") || el.classList.contains("work-hero") || el.classList.contains("about-hero") || el.classList.contains("contact-hero") || el.classList.contains("project-item")) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    revealObserver.observe(el);
  });
}

// ─── Mobile menu toggle ──────────────────────────────────────────
// Injects a hamburger button into each header and toggles the nav.

function initMobileNav() {
  document.querySelectorAll("header").forEach((header) => {
    if (header.querySelector(".menu-toggle")) return;
    const container = header.querySelector(".container");
    if (!container) return;

    const toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.setAttribute("type", "button");
    toggle.setAttribute("aria-label", "Toggle menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    container.appendChild(toggle);

    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    header.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll("header.nav-open").forEach((h) => {
        h.classList.remove("nav-open");
        const t = h.querySelector(".menu-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });
}

initMobileNav();

// ─── Auto-update copyright year ──────────────────────────────────
const footerCopy = document.querySelector(".footer-copy");
if (footerCopy) {
  const year = new Date().getFullYear();
  footerCopy.textContent = footerCopy.textContent.replace(/\d{4}/, year);
}
