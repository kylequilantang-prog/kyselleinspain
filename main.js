/* main.js — small, dependency-free behaviour for the site.
   Loaded at the end of <body>, so the DOM already exists by the time this runs. */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Mobile menu toggle
     aria-expanded is what tells a screen reader whether the menu is
     open, so it has to stay in sync with the visual state.
     --------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after tapping a link on small screens.
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------------
     Highlight the nav link for whichever section is on screen
     --------------------------------------------------------------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );

  if (links.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            var matches = link.getAttribute("href") === "#" + entry.target.id;
            if (matches) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) observer.observe(section);
    });
  }

  /* ---------------------------------------------------------------
     Footer year — so you never have to edit it again
     --------------------------------------------------------------- */
  var yearSlot = document.querySelector("[data-current-year]");
  if (yearSlot) {
    yearSlot.textContent = String(new Date().getFullYear());
  }
})();
