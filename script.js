
/* ==========================================
   DIRECTOR SOZO — EDITORIAL INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Replace with Director Sozo's official email.
  const CONTACT_EMAIL = "";

  const header = document.getElementById("siteHeader");
  const menuTrigger = document.getElementById("menuTrigger");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuLinks = [
    ...document.querySelectorAll(".overlay-nav a")
  ];

  /* ICONS */

  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* FULLSCREEN NAVIGATION */

  let menuOpen = false;
  let previousFocus = null;

  function setMenu(open) {
    menuOpen = open;

    if (open) {
      previousFocus = document.activeElement;
    }

    menuOverlay.classList.toggle("open", open);
    menuTrigger.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);

    menuTrigger.setAttribute("aria-expanded", String(open));
    menuTrigger.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );

    menuOverlay.setAttribute("aria-hidden", String(!open));
    menuOverlay.inert = !open;

    menuTrigger.querySelector("span").textContent =
      open ? "CLOSE" : "MENU";

    if (open) {
      menuLinks[0]?.focus();
    } else if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  menuTrigger.addEventListener("click", () => {
    setMenu(!menuOpen);
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", event => {
    if (!menuOpen) return;

    if (event.key === "Escape") {
      setMenu(false);
      return;
    }

    if (event.key === "Tab") {
      const focusable = [menuTrigger, ...menuLinks];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* HEADER */

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 100);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* SCROLL REVEALS */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = [
    ...document.querySelectorAll(
      ".identity-heading, .identity-copy, " +
      ".identity-photo-main, .manifesto h2, " +
      ".story-heading, .story-chapter, " +
      ".enterprise-intro, .enterprise-content, " +
      ".journey-heading, .journey-item, " +
      ".journal-heading, .lookbook figure, " +
      ".contact-heading, .contact-layout"
    )
  ];

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealElements.forEach(el => el.classList.add("reveal"));
    document.body.classList.add("js-ready");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /* CONTACT FORM */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    if (!CONTACT_EMAIL) {
      formStatus.textContent =
        "Please configure the official contact email.";
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    const emailSubject = "Director Sozo Enquiry: " + subject;

    const emailBody = [
      "DIRECTOR SOZO WEBSITE ENQUIRY",
      "",
      "Name: " + name,
      "Email: " + email,
      "Enquiry: " + subject,
      "",
      "Message:",
      message
    ].join("\n");

    const mailto = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(emailSubject) +
      "&body=" + encodeURIComponent(emailBody);

    formStatus.textContent =
      "Opening your email application. Send the prepared message to complete your enquiry.";

    window.location.href = mailto;
  });

  /* FOOTER YEAR */

  document.getElementById("year").textContent =
    new Date().getFullYear();

  /* IMAGE FALLBACKS */

  document.querySelectorAll("img").forEach(img => {
    function onError() {
      img.style.opacity = "0";
      img.parentElement.style.backgroundColor = "#123B5D";
    }

    img.addEventListener("error", onError);

    if (img.complete && img.naturalWidth === 0) {
      onError();
    }
  });

});
