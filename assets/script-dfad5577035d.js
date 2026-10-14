(() => {
  const mobileOfferQuery = window.matchMedia("(max-width: 720px)");
  const offerButtons = document.querySelectorAll("[data-mobile-offer]");
  const updateOfferTargets = () => {
    const target = mobileOfferQuery.matches ? "#oferta-kit-completo" : "#oferta";
    offerButtons.forEach((link) => link.setAttribute("href", target));
  };

  updateOfferTargets();
  mobileOfferQuery.addEventListener("change", updateOfferTargets);

  const navigationEntry = performance.getEntriesByType("navigation")[0];

  if (navigationEntry?.type === "reload") {
    const scrollToTop = () => {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    };

    window.addEventListener("pageshow", scrollToTop, { once: true });
    scrollToTop();
  }

  const gallery = document.querySelector(".gallery--six");
  const galleryScrollbar = document.querySelector(".gallery-scrollbar");
  const galleryThumb = galleryScrollbar?.querySelector("span");

  if (gallery && galleryScrollbar && galleryThumb) {
    const updateGalleryScrollbar = () => {
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      const trackWidth = galleryScrollbar.clientWidth;
      const thumbWidth = maxScroll > 0
        ? Math.max(48, trackWidth * (gallery.clientWidth / gallery.scrollWidth))
        : trackWidth;
      const maxThumbTravel = Math.max(0, trackWidth - thumbWidth);
      const progress = maxScroll > 0 ? gallery.scrollLeft / maxScroll : 0;

      galleryThumb.style.width = `${thumbWidth}px`;
      galleryThumb.style.transform = `translateX(${maxThumbTravel * progress}px)`;
    };

    gallery.addEventListener("scroll", updateGalleryScrollbar, { passive: true });
    window.addEventListener("resize", updateGalleryScrollbar);
    window.requestAnimationFrame(updateGalleryScrollbar);
  }

  // Encaminha os parâmetros de campanha para o checkout.
  // Parâmetros técnicos do navegador do anúncio não devem chegar ao checkout.
  const campaignParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "src",
    "sck",
    "xcod",
  ];
  const currentParams = new URLSearchParams(window.location.search);
  // O identificador xcod preserva
  // campanha, conjunto e anúncio no formato lido pelo dashboard.
  const attributionFields = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term"];
  const attributionValues = attributionFields.map(param => currentParams.get(param) || "");
  if (!currentParams.get("xcod") && attributionValues.some(Boolean)
      && !attributionValues.some(value => /\{\{.*?\}\}/.test(value))) {
    currentParams.set("xcod", attributionValues.join("hQwK21wXxR"));
  }


  document.querySelectorAll("[data-checkout]").forEach((link) => {
    if (link.getAttribute("aria-disabled") === "true") return;

    try {
      const checkoutUrl = new URL(link.href);

      campaignParams.forEach((param) => {
        const value = currentParams.get(param);
        if (value) checkoutUrl.searchParams.set(param, value);
      });

      link.href = checkoutUrl.toString();
    } catch {
      // Mantém o link original se ele ainda não for uma URL válida de checkout.
    }
  });

  const minutesNode = document.querySelector("[data-minutes]");
  const secondsNode = document.querySelector("[data-seconds]");

  if (!minutesNode || !secondsNode) return;

  const storageKey = "catalogo-lacos-offer-deadline";
  const now = Date.now();
  let deadline = Number(sessionStorage.getItem(storageKey));

  if (!deadline || deadline <= now) {
    deadline = now + 15 * 60 * 1000;
    sessionStorage.setItem(storageKey, String(deadline));
  }

  const render = () => {
    const remaining = Math.max(0, deadline - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesNode.textContent = String(minutes).padStart(2, "0");
    secondsNode.textContent = String(seconds).padStart(2, "0");

    if (remaining === 0) {
      deadline = Date.now() + 15 * 60 * 1000;
      sessionStorage.setItem(storageKey, String(deadline));
    }
  };

  render();
  window.setInterval(render, 1000);

})();
