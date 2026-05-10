// Hyundai AutoEver Careers — light interactions
// 1. Reveal-on-scroll using IntersectionObserver
// 2. Press feedback for keyboard activation (matches scale(0.95) press state)

(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ---- Reveal-on-scroll ----------------------------------
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // ---- Pill button press feedback for keyboard users -----
  document.querySelectorAll(".btn-pill, .btn-utility").forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        btn.style.transform = "scale(0.95)";
      }
    });
    btn.addEventListener("keyup", () => {
      btn.style.transform = "";
    });
    btn.addEventListener("blur", () => {
      btn.style.transform = "";
    });
  });

  // ---- Tighten sub-nav shadow once scrolled --------------
  const subNav = document.querySelector(".sub-nav");
  if (subNav) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        subNav.style.borderBottomColor = "rgba(0,0,0,0.12)";
      } else {
        subNav.style.borderBottomColor = "rgba(0,0,0,0.06)";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
