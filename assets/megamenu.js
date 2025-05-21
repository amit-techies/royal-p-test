document.addEventListener("DOMContentLoaded", function () {
  function initMegamenu() {
    const megamenuButtons = document.querySelectorAll(".megamenu-button");
    const megamenuCards = document.querySelectorAll(".megamenu-card");
    const linkButtons = document.querySelectorAll(".link-level-1 .button");
    const linkLists = document.querySelectorAll(".linklist-main-2");

    function resetActiveStates() {
      megamenuButtons.forEach((b) => b.classList.remove("active"));
      megamenuCards.forEach((c) => c.classList.remove("active"));
      linkLists.forEach((l) => l.classList.remove("active"));
      linkButtons.forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".link-level-1")
        .forEach((el) => el.classList.remove("active"));
    }

    function setDefaultActive() {
      resetActiveStates();

      const firstButton = megamenuButtons[0];
      const firstCard = megamenuCards[0];

      if (firstButton && firstCard) {
        firstButton.classList.add("active");
        firstCard.classList.add("active");

        const firstLinkButton = firstCard.querySelector(
          ".link-level-1 .button"
        );
        const firstLinkList = firstCard.querySelector(".linklist-main-2");
        const parentGroup = firstLinkButton?.closest(".link-level-1");

        if (firstLinkButton) firstLinkButton.classList.add("active");
        if (parentGroup) parentGroup.classList.add("active");
        if (firstLinkList) firstLinkList.classList.add("active");
      }
    }

    function fadeIn(elem, callback) {
      let opacity = 0;
      elem.style.display = "flex";
      elem.style.opacity = opacity;
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        elem.classList.add("active");
      }, 500);

      function animate() {
        opacity += 0.05;
        elem.style.opacity = opacity;
        if (opacity < 1) {
          requestAnimationFrame(animate);
        } else {
          elem.style.opacity = 1;
          if (typeof callback === "function") callback();
        }
      }
      requestAnimationFrame(animate);
    }

    function fadeOut(elem, callback) {
      let opacity = 1;

      function animate() {
        opacity -= 1;
        if (opacity < 0) opacity = 0;

        elem.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          elem.style.opacity = 0;
          elem.style.display = "none";
          elem.classList.remove("active");
          document.body.style.overflow = "auto";
          resetActiveStates();
          if (typeof callback === "function") callback();
        }
      }
      requestAnimationFrame(animate);
    }

    megamenuButtons.forEach((button) => {
      const card = button.nextElementSibling;

      button.addEventListener("mouseenter", () => {
        resetActiveStates();

        button.classList.add("active");
        if (card && card.classList.contains("megamenu-card")) {
          card.classList.add("active");

          const firstLinkButton = card.querySelector(".link-level-1 .button");
          const firstLinkList = card.querySelector(".linklist-main-2");
          const parentGroup = firstLinkButton?.closest(".link-level-1");

          if (firstLinkButton) firstLinkButton.classList.add("active");
          if (parentGroup) parentGroup.classList.add("active");
          if (firstLinkList) firstLinkList.classList.add("active");
        }
      });
    });

    linkButtons.forEach((button) => {
      const list = button.nextElementSibling;

      button.addEventListener("mouseenter", () => {
        const currentCard = button.closest(".megamenu-card");
        const parentGroup = button.closest(".link-level-1");

        if (currentCard) {
          currentCard
            .querySelectorAll(".link-level-1")
            .forEach((group) => group.classList.remove("active"));
          currentCard
            .querySelectorAll(".link-level-1 .button, .linklist-main-2")
            .forEach((el) => el.classList.remove("active"));

          button.classList.add("active");

          if (parentGroup) parentGroup.classList.add("active");

          if (list && list.classList.contains("linklist-main-2")) {
            list.classList.add("active");
          }
        }
      });
    });

    let currentOpenMenu = null; 

    document.querySelectorAll(".menu-toggle-button").forEach((button) => {
      button.addEventListener("click", function () {
        const targetSelector = this.getAttribute("data-target");
        const elem = document.querySelector(targetSelector);
        if (!elem) return;

        const computedStyle = getComputedStyle(elem);
        const isHidden =
          computedStyle.display === "none" ||
          parseFloat(computedStyle.opacity) === 0;

        if (isHidden) {
          fadeIn(elem, () => {
            setDefaultActive();
          });
          currentOpenMenu = elem; 
        } else {
          fadeOut(elem);
          currentOpenMenu = null;
        }
      });
    });

    document.querySelectorAll(".megamenu-overlay").forEach((overlay) => {
      overlay.addEventListener("click", function () {
        if (currentOpenMenu) {
          fadeOut(currentOpenMenu);
          currentOpenMenu = null;
        }
      });
    });

    // Set initial state on normal page load
    setDefaultActive();
  }

  // Run on initial page load
  initMegamenu();

  // Listen for Shopify section load event (theme editor)
  document.addEventListener("shopify:section:load", function () {
    initMegamenu();
  });
});
