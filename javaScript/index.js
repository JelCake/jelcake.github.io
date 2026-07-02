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
