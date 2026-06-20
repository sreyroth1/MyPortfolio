document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  const typingRole = document.getElementById("typing-role");
  const revealTargets = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".progress");
  const sections = document.querySelectorAll("section[id]");
  const achievementCards = document.querySelectorAll(".achievement-card");
  const achievementModal = document.querySelector(".achievement-modal");
  const achievementModalImage = document.querySelector(
    ".achievement-modal-image",
  );
  const achievementModalTitle = document.getElementById(
    "achievement-modal-title",
  );
  const achievementModalDescription = document.getElementById(
    "achievement-modal-description",
  );
  const achievementModalClose = document.querySelector(
    ".achievement-modal-close",
  );
  const achievementModalCounter = document.querySelector(
    ".achievement-modal-counter",
  );
  const achievementModalBackdrop = document.querySelector(
    ".achievement-modal-backdrop",
  );
  let currentAchievementImages = [];
  let currentAchievementAlts = [];
  let currentAchievementIndex = 0;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeIcon && savedTheme === "dark") {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  if (themeToggleBtn && themeIcon) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
      }
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      const hamIcon = hamburger.querySelector("i");
      if (!hamIcon) {
        return;
      }

      if (navLinks.classList.contains("nav-active")) {
        hamIcon.classList.replace("fa-bars", "fa-times");
      } else {
        hamIcon.classList.replace("fa-times", "fa-bars");
      }
    });
  }

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navLinks || !hamburger) {
        return;
      }

      navLinks.classList.remove("nav-active");
      const hamIcon = hamburger.querySelector("i");
      if (hamIcon) {
        hamIcon.classList.replace("fa-times", "fa-bars");
      }
    });
  });

  const updateScrollProgress = () => {
    if (!scrollProgressBar) {
      return;
    }

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(100, progress)}%`;
  };

  const setTypingRole = () => {
    if (!typingRole) {
      return;
    }

    const roles = ["Web Developer", "Problem Solver", "Creative Thinker"];

    if (reduceMotion) {
      typingRole.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex];
      const nextText = deleting
        ? current.slice(0, Math.max(0, charIndex - 1))
        : current.slice(0, charIndex + 1);

      typingRole.textContent = nextText;

      if (!deleting && nextText === current) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      }

      if (deleting && nextText === "") {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        window.setTimeout(tick, 300);
        return;
      }

      charIndex += deleting ? -1 : 1;
      window.setTimeout(tick, deleting ? 45 : 70);
    };

    tick();
  };

  const createAchievementPreview = (title) => {
    const safeTitle = title.toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a86ff" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.28)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#bg)" rx="42" />
        <circle cx="220" cy="170" r="150" fill="rgba(255,255,255,0.18)" />
        <circle cx="980" cy="520" r="180" fill="rgba(255,255,255,0.12)" />
        <ellipse cx="600" cy="340" rx="430" ry="240" fill="url(#glow)" />
        <rect x="110" y="110" width="980" height="455" rx="34" fill="rgba(15,23,42,0.20)" stroke="rgba(255,255,255,0.35)" />
        <text x="600" y="295" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="70" font-weight="700" fill="#ffffff">${safeTitle}</text>
        <text x="600" y="375" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="30" font-weight="500" fill="rgba(255,255,255,0.92)">Achievement Preview</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const updateAchievementModalImage = () => {
    if (!achievementModalImage || currentAchievementImages.length === 0) {
      return;
    }

    const currentImage = currentAchievementImages[currentAchievementIndex];
    const currentAlt =
      currentAchievementAlts[currentAchievementIndex] ||
      `${achievementModalTitle?.textContent || "Achievement"} preview`;

    achievementModalImage.src = currentImage;
    achievementModalImage.alt = currentAlt;

    if (achievementModalCounter) {
      achievementModalCounter.textContent = `${currentAchievementIndex + 1} / ${currentAchievementImages.length}`;
    }
  };

  const switchAchievementModalImage = () => {
    if (!achievementModalImage || currentAchievementImages.length <= 1) {
      return;
    }

    achievementModalImage.classList.add("is-switching");
    currentAchievementIndex =
      (currentAchievementIndex + 1) % currentAchievementImages.length;

    window.setTimeout(() => {
      updateAchievementModalImage();
      window.requestAnimationFrame(() => {
        achievementModalImage.classList.remove("is-switching");
      });
    }, 140);
  };

  const showNextAchievementImage = () => {
    switchAchievementModalImage();
  };

  const openAchievementModal = (card) => {
    if (
      !achievementModal ||
      !achievementModalImage ||
      !achievementModalTitle ||
      !achievementModalDescription
    ) {
      return;
    }

    const title =
      card.querySelector("h4")?.textContent?.trim() || "Achievement";
    const description = card.querySelector("p")?.textContent?.trim() || "";
    const previewImages = card.dataset.previewImages;
    const previewAlts = card.dataset.previewAlts;

    currentAchievementImages = previewImages
      ? previewImages
          .split("|")
          .map((image) => image.trim())
          .filter(Boolean)
      : [createAchievementPreview(title)];

    currentAchievementAlts = previewAlts
      ? previewAlts
          .split("|")
          .map((alt) => alt.trim())
          .filter(Boolean)
      : [`${title} preview`, `${title} preview 2`];

    currentAchievementIndex = 0;

    achievementModalTitle.textContent = title;
    achievementModalDescription.textContent = description;
    updateAchievementModalImage();
    achievementModal.classList.add("is-open");
    achievementModal.setAttribute("aria-hidden", "false");
  };

  const closeAchievementModal = () => {
    if (!achievementModal || !achievementModalImage) {
      return;
    }

    achievementModal.classList.remove("is-open");
    achievementModal.setAttribute("aria-hidden", "true");
    achievementModalImage.removeAttribute("src");
    currentAchievementImages = [];
    currentAchievementAlts = [];
    currentAchievementIndex = 0;
  };

  achievementCards.forEach((card) => {
    card.addEventListener("click", () => openAchievementModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openAchievementModal(card);
      }
    });
  });

  if (achievementModalClose) {
    achievementModalClose.addEventListener("click", closeAchievementModal);
  }

  if (achievementModalImage) {
    achievementModalImage.addEventListener("click", showNextAchievementImage);
  }

  if (achievementModalBackdrop) {
    achievementModalBackdrop.addEventListener("click", closeAchievementModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAchievementModal();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("active");

        if (entry.target.classList.contains("skill-box")) {
          const progress = entry.target.querySelector(".progress");
          if (progress) {
            progress.style.width = progress.dataset.width || "0";
          }
        }
      });
    },
    { threshold: 0.15 },
  );

  revealTargets.forEach((target) => observer.observe(target));
  skillBars.forEach((bar) => {
    const skillBox = bar.closest(".skill-box");
    if (skillBox) {
      observer.observe(skillBox);
    }
  });

  const setActiveNav = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const navLink = sectionId
        ? document.querySelector(`.nav-links a[href="#${sectionId}"]`)
        : null;

      if (!navLink) {
        return;
      }

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLink.classList.add("is-active");
      } else {
        navLink.classList.remove("is-active");
      }
    });
  };

  const runInitialState = () => {
    updateScrollProgress();
    setActiveNav();
    setTypingRole();

    if (reduceMotion) {
      revealTargets.forEach((target) => target.classList.add("active"));
      skillBars.forEach((bar) => {
        bar.style.width = bar.dataset.width || "0";
      });
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      updateScrollProgress();
      setActiveNav();
    },
    { passive: true },
  );

  window.addEventListener("resize", updateScrollProgress);
  runInitialState();
});
