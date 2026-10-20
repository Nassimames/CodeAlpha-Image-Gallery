const translations = {
  fr: {
    documentTitle: "Luméa — galerie du monde",
    description: "Explorez les paysages de 194 pays dans la galerie visuelle Luméa.",
    languageLabel: "Choisir la langue",
    home: "Luméa, accueil",
    footerHome: "Luméa, retour en haut",
    heroImageAlt: "Soleil levant sur une prairie brumeuse",
    headerNote: "Un atlas de belles choses",
    explore: "Explorer",
    collection: "Collection visuelle · N° 01",
    heroTitle: "L’art de<br />regarder <em>ailleurs.</em>",
    heroDescription:
      "Des fragments de lumière, des lieux qui nous appellent et des instants qu’on aimerait garder un peu plus longtemps.",
    discover: "Découvrir la collection",
    aside: "Une fenêtre<br />sur le monde.",
    countryTotal: "194 pays souverains",
    heroCaption: "Matin calme, Toscane",
    footerNote: "Fait pour les esprits qui vagabondent.",
    backToTop: "Retour en haut",
    galleryEyebrow: "Un voyage à travers le monde",
    galleryTitle: "Le monde en <em>images</em>",
    filtersLabel: "Filtrer par continent",
    searchLabel: "Rechercher un pays",
    searchPlaceholder: "Rechercher un pays…",
    filterAll: "Tous les pays",
    filterAfrica: "Afrique",
    filterAmericas: "Amériques",
    filterAsia: "Asie",
    filterEurope: "Europe",
    filterOceania: "Océanie",
    loadMore: "Voir plus de pays",
    loadingCountries: "Préparation de la galerie du monde…",
    loadingPhoto: "Recherche d’une photo…",
    photoUnavailable: "Photo indisponible",
    countryLoadError: "Impossible de charger la liste des pays. Vérifie ta connexion puis réessaie.",
    noResults: "Aucun pays ne correspond à cette recherche.",
    retry: "Réessayer",
    destinations: "destinations",
    closeViewer: "Fermer la visionneuse",
    viewerLabel: "Visionneuse d’images",
    close: "Fermer",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    openImage: "Découvrir {country}",
    photoBy: "Photo de",
    license: "Licence",
  },
  en: {
    documentTitle: "Luméa — world gallery",
    description: "Explore landscapes from 194 countries in the Luméa visual gallery.",
    languageLabel: "Choose language",
    home: "Luméa, home",
    footerHome: "Luméa, back to top",
    heroImageAlt: "Sunrise over a misty meadow",
    headerNote: "An atlas of beautiful things",
    explore: "Explore",
    collection: "Visual collection · No. 01",
    heroTitle: "The art of<br />looking <em>elsewhere.</em>",
    heroDescription:
      "Fragments of light, places that call to us, and moments we wish we could hold on to a little longer.",
    discover: "Explore the collection",
    aside: "A window<br />to the world.",
    countryTotal: "194 sovereign states",
    heroCaption: "A quiet morning, Tuscany",
    footerNote: "Made for wandering minds.",
    backToTop: "Back to top",
    galleryEyebrow: "A journey around the world",
    galleryTitle: "The world in <em>pictures</em>",
    filtersLabel: "Filter by continent",
    searchLabel: "Search for a country",
    searchPlaceholder: "Search countries…",
    filterAll: "All countries",
    filterAfrica: "Africa",
    filterAmericas: "Americas",
    filterAsia: "Asia",
    filterEurope: "Europe",
    filterOceania: "Oceania",
    loadMore: "Load more countries",
    loadingCountries: "Preparing the world gallery…",
    loadingPhoto: "Finding a photo…",
    photoUnavailable: "Photo unavailable",
    countryLoadError: "Could not load the country list. Check your connection and try again.",
    noResults: "No countries match your search.",
    retry: "Try again",
    destinations: "destinations",
    closeViewer: "Close image viewer",
    viewerLabel: "Image viewer",
    close: "Close",
    previousImage: "Previous image",
    nextImage: "Next image",
    openImage: "Discover {country}",
    photoBy: "Photo by",
    license: "License",
  },
};

const sovereignCountryCodes = new Set(
  "AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(" "),
);

const pageSize = 24;
const apiUrl = "https://api.first.org/data/v1/countries?limit=300";
const commonsApiUrl = "https://commons.wikimedia.org/w/api.php";
const countryNames = {
  fr: new Intl.DisplayNames(["fr"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};
const grid = document.querySelector("#gallery-grid");
const countSummary = document.querySelector("#country-summary");
const galleryStatus = document.querySelector("#gallery-status");
const searchInput = document.querySelector("#country-search");
const filterButtons = document.querySelectorAll(".filter-button");
const languageButtons = document.querySelectorAll(".language-button");
const languageSwitch = document.querySelector(".language-switch");
const loadMoreButton = document.querySelector("#load-more");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxLocation = document.querySelector("#lightbox-location");
const lightboxCounter = document.querySelector("#lightbox-counter");
const lightboxCredit = document.querySelector("#lightbox-credit");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const regionDisplayNames = new Intl.DisplayNames(["en"], { type: "region" });
let countries = [];
let currentCountries = [];
let activeRegion = "all";
let visibleCount = pageSize;
let activeIndex = 0;
let currentLanguage = getSavedLanguage();
let previouslyFocusedElement = null;
let requestSequence = 0;
let activePhotoRequests = 0;
const photoQueue = [];

const photoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      photoObserver.unobserve(entry.target);
      const country = countries.find((item) => item.code === entry.target.dataset.code);
      if (country) loadCountryPhoto(country, entry.target);
    });
  },
  { rootMargin: "500px 0px" },
);

function getSavedLanguage() {
  try {
    return localStorage.getItem("lumea-language") === "en" ? "en" : "fr";
  } catch (error) {
    console.warn("Luméa could not read the saved language preference.", error);
    return "fr";
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem("lumea-language", language);
  } catch (error) {
    console.warn("Luméa could not save the language preference.", error);
  }
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(currentLanguage);
}

function countryName(country) {
  return (
    countryNames[currentLanguage].of(country.code) ||
    country.name
  );
}

function regionName(region) {
  const continent = {
    Africa: "filterAfrica",
    Americas: "filterAmericas",
    Asia: "filterAsia",
    Europe: "filterEurope",
    Oceania: "filterOceania",
  }[continentFor(region)];
  return continent ? translations[currentLanguage][continent] : region;
}

function continentFor(region) {
  if (["North America", "Central America", "South America", "The Caribbean"].includes(region)) {
    return "Americas";
  }
  if (region === "Middle East") return "Asia";
  return region;
}

function translatePage() {
  const copy = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = copy.documentTitle;
  document.querySelector('meta[name="description"]').content = copy.description;
  languageSwitch.setAttribute("aria-label", copy.languageLabel);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = copy[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", copy[element.dataset.i18nAria]);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = copy[element.dataset.i18nAlt];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = copy[element.dataset.i18nPlaceholder];
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderGallery();
  if (lightbox.classList.contains("is-open")) updateLightbox();
}

function filterCountries() {
  const query = normalize(searchInput.value.trim());
  currentCountries = countries
    .filter((country) => activeRegion === "all" || continentFor(country.region) === activeRegion)
    .filter(
      (country) =>
        !query ||
        [
          countryNames.fr.of(country.code),
          countryNames.en.of(country.code),
          country.name,
          country.code,
        ].some((name) => normalize(name || "").includes(query)),
    )
    .sort((a, b) => countryName(a).localeCompare(countryName(b), currentLanguage));

  visibleCount = pageSize;
  renderGallery();
}

function renderGallery() {
  const copy = translations[currentLanguage];
  const fragment = document.createDocumentFragment();
  const visibleCountries = currentCountries.slice(0, visibleCount);
  photoObserver.disconnect();

  visibleCountries.forEach((country, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card country-card";

    const openButton = document.createElement("button");
    openButton.className = "card-image-button";
    openButton.type = "button";
    openButton.dataset.code = country.code;
    openButton.setAttribute(
      "aria-label",
      copy.openImage.replace("{country}", countryName(country)),
    );

    const imageWrap = document.createElement("span");
    imageWrap.className = "card-image-wrap country-image-wrap";
    const photo = document.createElement("img");
    photo.className = [
      "card-image",
      "country-image",
      country.photoUrl ? "is-photo" : "",
      country.photoFailed ? "is-fallback" : "",
    ]
      .filter(Boolean)
      .join(" ");
    photo.src =
      country.photoUrl ||
      `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
    photo.alt = country.photoUrl ? country.photoAlt : "";
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.dataset.code = country.code;

    const photoStatus = document.createElement("span");
    photoStatus.className = "photo-status";
    photoStatus.textContent = country.photoFailed
      ? copy.photoUnavailable
      : country.photoUrl
        ? ""
        : copy.loadingPhoto;
    photoStatus.hidden = Boolean(country.photoUrl);
    imageWrap.append(photo, photoStatus);

    const openIcon = document.createElement("span");
    openIcon.className = "card-open";
    openIcon.setAttribute("aria-hidden", "true");
    openIcon.textContent = "↗";
    imageWrap.append(openIcon);
    openButton.append(imageWrap);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = countryName(country);
    const region = document.createElement("span");
    region.className = "card-category";
    region.textContent = regionName(country.region);
    meta.append(title, region);

    card.append(openButton, meta);
    fragment.append(card);
  });

  grid.replaceChildren(fragment);
  grid.setAttribute(
    "aria-label",
    `${currentCountries.length} ${copy.destinations}`,
  );
  countSummary.textContent = countries.length
    ? `${visibleCountries.length} / ${currentCountries.length} ${copy.destinations}`
    : "";
  galleryStatus.textContent = countries.length
    ? currentCountries.length
      ? ""
      : copy.noResults
    : copy.loadingCountries;
  loadMoreButton.hidden = visibleCount >= currentCountries.length;
  visibleCountries.forEach((country) => {
    if (!country.photoUrl && !country.photoFailed) {
      photoObserver.observe(grid.querySelector(`.country-image[data-code="${country.code}"]`));
    }
  });
}

async function fetchCommonsPhoto(country) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${country.name} landscape`,
    gsrnamespace: "6",
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1100",
    format: "json",
    origin: "*",
  });
  const response = await fetch(`${commonsApiUrl}?${params}`);
  if (!response.ok) throw new Error(`Wikimedia Commons returned ${response.status}.`);

  const result = await response.json();
  const pages = Object.values(result.query?.pages || {});
  const normalizedCountry = normalize(country.name);
  const matchingPage = pages.find((page) =>
    normalize(page.title.replace(/^File:/, "")).includes(normalizedCountry),
  );
  const page = matchingPage || pages[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl || !info?.descriptionurl) {
    throw new Error(`No Wikimedia Commons image was found for ${country.name}.`);
  }

  const metadata = info.extmetadata || {};
  const artistMarkup = metadata.Artist?.value || "";
  const artist = new DOMParser().parseFromString(artistMarkup, "text/html").body.textContent.trim();
  return {
    url: info.thumburl,
    pageUrl: info.descriptionurl,
    artist,
    license: metadata.LicenseShortName?.value || "",
    alt: page.title.replace(/^File:/, "").replaceAll("_", " "),
  };
}

function getCountryPhoto(country) {
  country.photoPromise ||= new Promise((resolve, reject) => {
    photoQueue.push({ country, resolve, reject });
    processPhotoQueue();
  });
  return country.photoPromise;
}

function processPhotoQueue() {
  while (activePhotoRequests < 4 && photoQueue.length) {
    const request = photoQueue.shift();
    activePhotoRequests += 1;
    fetchCommonsPhoto(request.country)
      .then(request.resolve, request.reject)
      .finally(() => {
        activePhotoRequests -= 1;
        processPhotoQueue();
      });
  }
}

async function loadCountryPhoto(country, imageElement) {
  const card = imageElement.closest(".country-image-wrap");
  const status = card.querySelector(".photo-status");
  status.hidden = false;
  status.textContent = translations[currentLanguage].loadingPhoto;

  try {
    country.photoData ||= await getCountryPhoto(country);
    country.photoUrl = country.photoData.url;
    country.photoAlt = country.photoData.alt;
    if (imageElement.isConnected) {
      imageElement.addEventListener(
        "load",
        () => {
          status.hidden = true;
        },
        { once: true },
      );
      imageElement.addEventListener(
        "error",
        () => {
          country.photoFailed = true;
          country.photoUrl = null;
          country.photoData = null;
          imageElement.src = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
          imageElement.alt = "";
          imageElement.classList.add("is-fallback");
          status.hidden = false;
          status.textContent = translations[currentLanguage].photoUnavailable;
          console.warn(`Luméa could not load the Commons photo for ${country.name}.`);
        },
        { once: true },
      );
      imageElement.src = country.photoUrl;
      imageElement.alt = country.photoAlt;
      imageElement.classList.add("is-photo");
      imageElement.classList.remove("is-fallback");
    }
  } catch (error) {
    country.photoFailed = true;
    if (imageElement.isConnected) {
      imageElement.classList.add("is-fallback");
      imageElement.alt = "";
      status.hidden = false;
      status.textContent = translations[currentLanguage].photoUnavailable;
    }
    console.warn(`Luméa could not find a Commons photo for ${country.name}.`, error);
  }
}

function updateLightbox() {
  const country = currentCountries[activeIndex];
  if (!country) return;

  lightboxImage.src =
    country.photoUrl ||
    `https://flagcdn.com/w640/${country.code.toLowerCase()}.png`;
  lightboxImage.alt = country.photoAlt || countryName(country);
  lightboxTitle.textContent = countryName(country);
  lightboxLocation.textContent = regionName(country.region);
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(3, "0")} / ${String(currentCountries.length).padStart(3, "0")}`;
  lightboxCredit.hidden = !country.photoData;
  if (country.photoData) {
    const { artist, license, pageUrl } = country.photoData;
    lightboxCredit.href = pageUrl;
    lightboxCredit.textContent = [
      artist ? `${translations[currentLanguage].photoBy} ${artist}` : "",
      license ? `${translations[currentLanguage].license}: ${license}` : "",
      "Wikimedia Commons",
    ]
      .filter(Boolean)
      .join(" · ");
  }

  if (!country.photoUrl && !country.photoFailed) {
    const imageRequest = ++requestSequence;
    getCountryPhoto(country)
      .then((photo) => {
        country.photoData = photo;
        country.photoUrl = photo.url;
        country.photoAlt = photo.alt;
        if (lightbox.classList.contains("is-open") && imageRequest === requestSequence) {
          updateLightbox();
        }
      })
      .catch((error) => {
        country.photoFailed = true;
        console.warn(`Luméa could not find a Commons photo for ${country.name}.`, error);
      });
  }
}

function openLightbox(code) {
  activeIndex = currentCountries.findIndex((country) => country.code === code);
  previouslyFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add("is-open");
  lightbox.inert = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.inert = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  requestSequence += 1;
  if (previouslyFocusedElement?.isConnected) previouslyFocusedElement.focus();
}

function moveLightbox(direction) {
  activeIndex =
    (activeIndex + direction + currentCountries.length) % currentCountries.length;
  updateLightbox();
}

function showCountryLoadError() {
  galleryStatus.replaceChildren();
  galleryStatus.append(document.createTextNode(`${translations[currentLanguage].countryLoadError} `));
  const retryButton = document.createElement("button");
  retryButton.className = "retry-button";
  retryButton.type = "button";
  retryButton.textContent = translations[currentLanguage].retry;
  retryButton.addEventListener("click", loadCountries, { once: true });
  galleryStatus.append(retryButton);
}

async function loadCountries() {
  grid.replaceChildren();
  galleryStatus.textContent = translations[currentLanguage].loadingCountries;
  loadMoreButton.hidden = true;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Country data service returned ${response.status}.`);
    const result = await response.json();
    if (result.status !== "OK" || !result.data) {
      throw new Error("Country data service returned an unexpected response.");
    }

    countries = Object.entries(result.data)
      .filter(([code]) => sovereignCountryCodes.has(code))
      .map(([code, country]) => ({ code, name: country.country, region: country.region }))
      .sort((a, b) => countryName(a).localeCompare(countryName(b), currentLanguage));

    if (countries.length !== sovereignCountryCodes.size) {
      throw new Error(
        `Expected ${sovereignCountryCodes.size} sovereign states, received ${countries.length}.`,
      );
    }

    filterCountries();
  } catch (error) {
    console.error("Luméa could not load the country list.", error);
    showCountryLoadError();
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRegion = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    filterCountries();
  });
});

searchInput.addEventListener("input", filterCountries);
loadMoreButton.addEventListener("click", () => {
  visibleCount += pageSize;
  renderGallery();
});
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.language;
    saveLanguage(currentLanguage);
    translatePage();
    filterCountries();
  });
});

grid.addEventListener("click", (event) => {
  const openButton = event.target.closest(".card-image-button");
  if (openButton) openLightbox(openButton.dataset.code);
});
previousButton.addEventListener("click", () => moveLightbox(-1));
nextButton.addEventListener("click", () => moveLightbox(1));
lightbox.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeLightbox);
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);

  if (event.key === "Tab") {
    const focusable = [...lightbox.querySelectorAll(".lightbox-panel button, .lightbox-panel a:not([hidden])")];
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

translatePage();
loadCountries();
