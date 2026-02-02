const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cursorLight = document.querySelector(".cursor-light");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");
const burger = document.getElementById("burger");
const mobilePanel = document.getElementById("mobilePanel");
const demoToggle = document.getElementById("demoToggle");
const tiltCards = document.querySelectorAll("[data-tilt]");
const counters = document.querySelectorAll("[data-count]");

// Smooth scroll for navigation and mobile links
const smoothLinks = document.querySelectorAll("a[href^='#']");

smoothLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (mobilePanel.classList.contains("open")) {
      toggleMobileMenu(false);
    }
  });
});

// Cursor light effect
if (!prefersReducedMotion) {
  window.addEventListener("mousemove", (event) => {
    cursorLight.style.opacity = "1";
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });
}

// Scroll-based header state + scrollspy
const sections = document.querySelectorAll("section");

const handleScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
  const scrollPos = window.scrollY + 160;
  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href='#${section.id}']`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
};

window.addEventListener("scroll", handleScroll);
handleScroll();

// Reveal animations with IntersectionObserver
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.06}s`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Tilt effect for cards
if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -12;
      const rotateY = ((x / rect.width) - 0.5) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

// Mobile menu
const toggleMobileMenu = (forceState) => {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !mobilePanel.classList.contains("open");
  mobilePanel.classList.toggle("open", shouldOpen);
  burger.classList.toggle("open", shouldOpen);
  burger.setAttribute("aria-expanded", shouldOpen);
  mobilePanel.setAttribute("aria-hidden", !shouldOpen);
};

burger.addEventListener("click", () => toggleMobileMenu());

// Demo mode toggle
if (demoToggle) {
  demoToggle.addEventListener("change", (event) => {
    document.body.classList.toggle("demo-mode", event.target.checked);
  });
}

// Animated counters for skill bars
const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const step = () => {
      current += 1;
      counter.textContent = `${current}%`;
      if (current < target) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  });
};

if (!prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.6 }
  );

  const skillsSection = document.getElementById("skills");
  if (skillsSection) counterObserver.observe(skillsSection);
} else {
  counters.forEach((counter) => {
    counter.textContent = `${counter.dataset.count}%`;
  });
}
