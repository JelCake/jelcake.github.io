// ─── Page transitions ─────────────────────────────────────────────
// Fades overlay in on link click, navigates, then fades content in
// on load.

const overlay = document.querySelector(".page-transition");
const page = document.getElementById("page");

if (page) page.classList.add("page-enter");

if (overlay) {
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === window.location.pathname.split("/").pop()) return;
      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });

  window.addEventListener("pageshow", () => {
    overlay.classList.remove("active");
  });
}

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

// ─── Scroll-linked parallax on hero backgrounds ──────────────────
// Hero images move at a slower rate than the scroll, creating depth.
// Only starts after the hero has finished its entrance animation.

const heroBgs = document.querySelectorAll(".hero-image-bg, .work-image-bg, .about-image-bg, .contact-image-bg");

if (heroBgs.length > 0 && !prefersReducedMotion) {
  let ticking = false;
  let parallaxReady = false;

  // Wait for hero animation to finish before enabling parallax
  setTimeout(() => { parallaxReady = true; }, 1500);

  window.addEventListener("scroll", () => {
    if (!ticking && parallaxReady) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroBgs.forEach((bg) => {
          const speed = 0.25;
          bg.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── Smooth section reveal with clip-path ────────────────────────
// Sections reveal from bottom with a smooth clip-path animation
// as they enter the viewport, instead of just fading in.

const revealSections = document.querySelectorAll("[data-observe]");

if (revealSections.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.clipPath = "inset(0 0 0 0)";
          entry.target.style.opacity = "1";
        } else {
          entry.target.style.clipPath = "inset(15% 0 15% 0)";
          entry.target.style.opacity = "0";
        }
      });
    },
    { threshold: 0.1 },
  );

  revealSections.forEach((el) => {
    if (el.classList.contains("hero") || el.classList.contains("work-hero") || el.classList.contains("about-hero") || el.classList.contains("contact-hero") || el.classList.contains("project-item")) return;
    el.style.clipPath = "inset(15% 0 15% 0)";
    el.style.opacity = "0";
    el.style.transition = "clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
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
