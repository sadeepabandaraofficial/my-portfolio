(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const nav = document.querySelector(".site-nav");
  const copyButton = document.querySelector(".copy-email");
  const copyStatus = document.querySelector(".copy-status");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectItems = document.querySelectorAll(".project-item");
  const emptyMessage = document.querySelector(".filter-empty");

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    root.dataset.bsTheme = theme;
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
      themeToggle.innerHTML = `<i class="bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}" aria-hidden="true"></i>`;
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#0b1020" : "#f5f7fc";
  };

  setTheme(root.dataset.theme || "dark");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved.", error);
    }
  });

  const updateNav = () => nav?.classList.toggle("is-scrolled", window.scrollY > 40);
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visibleCount = 0;
      projectItems.forEach((item) => {
        const categories = (item.dataset.type || "").split(/\s+/);
        const visible = filter === "all" || categories.includes(filter);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  copyButton?.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) copyStatus.textContent = "Email copied to clipboard.";
    } catch (error) {
      if (copyStatus) copyStatus.textContent = "Couldn’t copy automatically. Select the email address shown below.";
      console.warn("Email could not be copied.", error);
    }
  });

  const year = document.querySelector("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll("#primaryNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const navCollapse = document.querySelector("#primaryNav");
      if (navCollapse?.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });
})();
