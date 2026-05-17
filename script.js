// Hyundai AutoEver — HR AX Drive TFT
// Interactions:
//  1. Reveal-on-scroll via IntersectionObserver
//  2. Animated number counters (hero rail + impact grid)
//  3. Nav state on scroll (border opacity)
//  4. Reduced motion fallback

(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ---------- reveal-on-scroll ----------
  const reveals = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // ---------- animated counters ----------
  const counters = document.querySelectorAll("[data-count]");

  const formatNumber = (value, target) => {
    // honor decimals based on the target's own format (e.g. 1.2 → 1 decimal)
    const decimals = String(target).split(".")[1]?.length ?? 0;
    if (decimals > 0) return value.toFixed(decimals);
    // preserve leading zeros if the placeholder length suggests so
    const intStr = Math.floor(value).toString();
    const targetStr = Math.floor(Number(target)).toString();
    if (targetStr.length > intStr.length) {
      return intStr.padStart(targetStr.length, "0");
    }
    return intStr;
  };

  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const fromZero = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = fromZero + (target - fromZero) * eased;
      el.textContent = formatNumber(value, target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, target);
    };
    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      if (!Number.isNaN(target)) el.textContent = formatNumber(target, target);
    });
  } else {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countIO.observe(el));
  }

  // ---------- nav border on scroll ----------
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.style.borderBottomColor = "rgba(255,255,255,0.18)";
        nav.style.background = "rgba(6,8,15,0.85)";
      } else {
        nav.style.borderBottomColor = "rgba(255,255,255,0.08)";
        nav.style.background = "rgba(6,8,15,0.65)";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- press feedback for buttons ----------
  document.querySelectorAll(".btn, .nav__cta").forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        btn.style.transform = "scale(0.97)";
      }
    });
    btn.addEventListener("keyup", () => (btn.style.transform = ""));
    btn.addEventListener("blur", () => (btn.style.transform = ""));
  });
})();
