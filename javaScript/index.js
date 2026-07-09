document.querySelectorAll(".hero-title h1").forEach((el) => {
  const original = el.innerText;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let interval;

  const scramble = () => {
    let revealed = 0;

    interval = setInterval(() => {
      el.innerText = original
        .split("")
        .map((letter, i) => {
          if (i < revealed) return letter;
          return chars[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (revealed < original.length) {
        revealed++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  setTimeout(scramble, 300);
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
