const DOGS = [
  {
    id: "buddy",
    name: "Buddy",
    age: 3,
    breed: "Golden Retriever mix",
    image: "https://placedog.net/400/196?id=57",
    heroImage: "https://placedog.net/600/500?id=57",
    alt: "Buddy, a friendly golden dog",
    personalities: ["Friendly", "Playful", "Loyal"],
    featured: true
  },
  {
    id: "luna",
    name: "Luna",
    age: 2,
    breed: "Beagle mix",
    image: "https://placedog.net/400/194?id=73",
    heroImage: "https://placedog.net/600/500?id=73",
    alt: "Luna, a calm beagle mix",
    personalities: ["Calm", "Curious", "Gentle"],
    featured: true
  },
  {
    id: "max",
    name: "Max",
    age: 4,
    breed: "Border Collie mix",
    image: "https://placedog.net/400/133?id=223",
    heroImage: "https://placedog.net/600/500?id=223",
    alt: "Max, an energetic border collie mix",
    personalities: ["Smart", "Active", "Loving"],
    featured: true
  },
  {
    id: "daisy",
    name: "Daisy",
    age: 1,
    breed: "Labrador mix",
    image: "https://placedog.net/400/278?id=218",
    heroImage: "https://placedog.net/600/500?id=218",
    alt: "Daisy, a gentle labrador mix",
    personalities: ["Sweet", "Social", "Happy"],
    featured: true
  },
  {
    id: "rocky",
    name: "Rocky",
    age: 6,
    breed: "Terrier mix",
    image: "https://placedog.net/400/280?id=102",
    heroImage: "https://placedog.net/600/500?id=102",
    alt: "Rocky, a confident terrier mix",
    personalities: ["Confident", "Loyal", "Alert"],
    featured: false
  },
  {
    id: "bella",
    name: "Bella",
    age: 7,
    breed: "Spaniel mix",
    image: "https://placedog.net/400/270?id=88",
    heroImage: "https://placedog.net/600/500?id=88",
    alt: "Bella, a sweet senior spaniel mix",
    personalities: ["Gentle", "Calm", "Sweet"],
    featured: false
  }
];

const favoriteStorageKey = "sipShelterFavorites";

function getFavorites() {
  return JSON.parse(localStorage.getItem(favoriteStorageKey)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
}

function isFavorite(dogId) {
  return getFavorites().includes(dogId);
}

function toggleFavorite(dogId) {
  const favorites = getFavorites();

  if (favorites.includes(dogId)) {
    saveFavorites(favorites.filter((id) => id !== dogId));
  } else {
    saveFavorites([...favorites, dogId]);
  }

  renderDogAreas();
}

function getAgeLabel(age) {
  return age === 1 ? "1 year" : `${age} years`;
}

function getAgeGroup(age) {
  if (age <= 2) return "young";
  if (age <= 6) return "adult";
  return "senior";
}

function getPersonalityText(dog) {
  return dog.personalities.join(" · ");
}

function createDogCard(dog, contactHref) {
  const favoriteClass = isFavorite(dog.id) ? " is-favorite" : "";
  const favoriteLabel = isFavorite(dog.id)
    ? `Remove ${dog.name} from favorites`
    : `Add ${dog.name} to favorites`;

  return `
    <figure class="dog-card">
      <div class="dog-image-wrap">
        <img src="${dog.image}" alt="${dog.alt}" loading="lazy">

        <span class="dog-badge">Available</span>

        <button
          class="favorite-button${favoriteClass}"
          type="button"
          data-favorite="${dog.id}"
          aria-label="${favoriteLabel}"
        >
          ♥
        </button>
      </div>

      <figcaption>
        <div class="dog-card-header">
          <h3>${dog.name}</h3>
          <span>${getAgeLabel(dog.age)}</span>
        </div>

        <p>${dog.breed}</p>

        <div class="dog-personality" aria-label="${dog.name}'s personality">
          ${dog.personalities
            .map((personality) => `<span class="personality-pill">${personality}</span>`)
            .join("")}
        </div>

        <a href="${contactHref}" class="card-button">Ask About ${dog.name}</a>
      </figcaption>
    </figure>
  `;
}

function setupMenu() {
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".navbar-links");

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}

function setupFavoriteButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    toggleFavorite(button.dataset.favorite);
  });
}

function renderFeaturedDogs() {
  const carousel = document.querySelector("[data-dog-carousel]");
  if (!carousel) return;

  carousel.innerHTML = DOGS
    .filter((dog) => dog.featured)
    .map((dog) => createDogCard(dog, "#contact"))
    .join("");
}

function renderDogSelect() {
  const select = document.querySelector("[data-dog-select]");
  if (!select) return;

  select.innerHTML = `
    <option value="">Select a dog</option>
    ${DOGS.map((dog) => `<option value="${dog.id}">${dog.name}</option>`).join("")}
  `;
}

function renderPersonalityFilters() {
  const container = document.querySelector("[data-personality-filters]");
  if (!container) return;

  const personalities = [...new Set(DOGS.flatMap((dog) => dog.personalities))].sort();

  container.innerHTML = personalities
    .map((personality) => `
      <button class="filter-chip" type="button" data-personality="${personality}">
        ${personality}
      </button>
    `)
    .join("");
}

function getSelectedPersonalities() {
  return [...document.querySelectorAll("[data-personality].is-active")]
    .map((button) => button.dataset.personality);
}

function getFilteredDogs() {
  const searchInput = document.querySelector("[data-dog-search]");
  const ageFilter = document.querySelector("[data-age-filter]");

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedAge = ageFilter ? ageFilter.value : "all";
  const selectedPersonalities = getSelectedPersonalities();

  return DOGS.filter((dog) => {
    const searchableText = [
      dog.name,
      dog.breed,
      ...dog.personalities
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);
    const matchesAge = selectedAge === "all" || getAgeGroup(dog.age) === selectedAge;
    const matchesPersonalities =
      selectedPersonalities.length === 0 ||
      selectedPersonalities.every((personality) => dog.personalities.includes(personality));

    return matchesSearch && matchesAge && matchesPersonalities;
  });
}

function renderDogsPage() {
  const dogsGrid = document.querySelector("[data-dogs-grid]");
  const resultsCount = document.querySelector("[data-results-count]");
  const favoritesCount = document.querySelector("[data-favorites-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  if (!dogsGrid) return;

  const filteredDogs = getFilteredDogs();

  dogsGrid.innerHTML = filteredDogs
    .map((dog) => createDogCard(dog, "index.html#contact"))
    .join("");

  if (resultsCount) resultsCount.textContent = filteredDogs.length;
  if (favoritesCount) favoritesCount.textContent = getFavorites().length;
  if (emptyState) emptyState.hidden = filteredDogs.length > 0;
}

function setupDatabaseFilters() {
  const searchInput = document.querySelector("[data-dog-search]");
  const ageFilter = document.querySelector("[data-age-filter]");
  const clearButton = document.querySelector("[data-clear-filters]");
  const personalityContainer = document.querySelector("[data-personality-filters]");

  if (searchInput) {
    searchInput.addEventListener("input", renderDogsPage);
  }

  if (ageFilter) {
    ageFilter.addEventListener("change", renderDogsPage);
  }

  if (personalityContainer) {
    personalityContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-personality]");
      if (!button) return;

      button.classList.toggle("is-active");
      renderDogsPage();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (ageFilter) ageFilter.value = "all";

      document
        .querySelectorAll("[data-personality].is-active")
        .forEach((button) => button.classList.remove("is-active"));

      renderDogsPage();
    });
  }
}

function setupHeroSlideshow() {
  const slideshow = document.querySelector(".hero-slideshow");
  const image = document.querySelector("[data-hero-image]");
  const name = document.querySelector("[data-hero-name]");
  const age = document.querySelector("[data-hero-age]");
  const breed = document.querySelector("[data-hero-breed]");
  const personality = document.querySelector("[data-hero-personality]");
  const prevButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");

  if (
    !slideshow ||
    !image ||
    !name ||
    !age ||
    !breed ||
    !personality ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }

  const heroDogs = DOGS.filter((dog) => dog.featured);
  let currentIndex = 0;
  let isChanging = false;

  function showHeroDog(index) {
    if (isChanging) return;

    isChanging = true;
    const dog = heroDogs[index];
    slideshow.classList.add("is-changing");

    setTimeout(() => {
      image.src = dog.heroImage;
      image.alt = dog.alt;
      name.textContent = dog.name;
      age.textContent = getAgeLabel(dog.age);
      breed.textContent = dog.breed;
      personality.textContent = getPersonalityText(dog);

      slideshow.classList.remove("is-changing");
      isChanging = false;
    }, 280);
  }

  prevButton.addEventListener("click", () => {
    currentIndex = currentIndex - 1;

    if (currentIndex < 0) {
      currentIndex = heroDogs.length - 1;
    }

    showHeroDog(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex = currentIndex + 1;

    if (currentIndex >= heroDogs.length) {
      currentIndex = 0;
    }

    showHeroDog(currentIndex);
  });

  showHeroDog(currentIndex);
}

function setupCarouselDragging() {
  const carousel = document.querySelector("[data-dog-carousel]");
  if (!carousel) return;

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  carousel.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".dog-card")) return;

    isDragging = true;
    startX = event.clientX;
    startScrollLeft = carousel.scrollLeft;

    carousel.classList.add("dragging");
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const distance = event.clientX - startX;
    carousel.scrollLeft = startScrollLeft - distance;
  });

  function stopDragging() {
    isDragging = false;
    carousel.classList.remove("dragging");
  }

  carousel.addEventListener("pointerup", stopDragging);
  carousel.addEventListener("pointercancel", stopDragging);
}

function renderDogAreas() {
  renderFeaturedDogs();
  renderDogsPage();
  renderDogSelect();
}

setupMenu();
setupFavoriteButtons();
renderPersonalityFilters();
renderDogAreas();
setupDatabaseFilters();
setupHeroSlideshow();
setupCarouselDragging();
