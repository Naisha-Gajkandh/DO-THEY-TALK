const categories = [
  { id: "spurious-classics", name: "Spurious Classics", icon: "SC", color: "#e11d48", tagline: "Margarine, cheese, and chaos" },
  { id: "google-searches", name: "Google Searches", icon: "GS", color: "#3b82f6", tagline: "Trending queries" },
  { id: "planets", name: "Planets", icon: "PL", color: "#7c3aed", tagline: "Out of orbit, statistically" },
  { id: "stocks", name: "Stocks", icon: "ST", color: "#059669", tagline: "Portfolio-grade nonsense" },
  { id: "memes", name: "Memes", icon: "ME", color: "#eab308", tagline: "Viral coincidences" },
  { id: "weird", name: "Weird & Wacky", icon: "WW", color: "#d946ef", tagline: "Unexplainable data" },
  { id: "crime", name: "Crime", icon: "CR", color: "#475569", tagline: "Statistically suspicious" },
  { id: "death", name: "Death & Danger", icon: "DD", color: "#374151", tagline: "Dark charts, darker coincidences" },
  { id: "baby-names", name: "Baby Names", icon: "BN", color: "#ec4899", tagline: "What is in a name?" },
  { id: "elections", name: "Elections", icon: "EL", color: "#ef4444", tagline: "Statistically elected" },
  { id: "youtube", name: "YouTube", icon: "YT", color: "#dc2626", tagline: "Smash that subscribe button" },
  { id: "occupations", name: "Occupations", icon: "OC", color: "#57534e", tagline: "Working 9 to 5" },
  { id: "sports", name: "Sports", icon: "SP", color: "#f97316", tagline: "Statistically athletic" },
  { id: "weather", name: "Weather", icon: "WE", color: "#0ea5e9", tagline: "Statistically cloudy" },
  { id: "environment", name: "Environment", icon: "EN", color: "#16a34a", tagline: "Springtime for skeptical charts" },
  { id: "energy", name: "Energy", icon: "EG", color: "#eab308", tagline: "High-voltage correlations" },
  { id: "films", name: "Films", icon: "FI", color: "#a855f7", tagline: "Statistically cinematic" },
  { id: "food", name: "Food", icon: "FO", color: "#d97706", tagline: "Market-basket madness" },
  { id: "education", name: "Education", icon: "ED", color: "#4f46e5", tagline: "Statistically educated" }
];

const pairBank = {
  "spurious-classics": ["Cheese consumption", "Civil engineering doctorates", "Margarine spending", "Divorce rates in Maine"],
  "google-searches": ["Searches for houseplants", "Unemployment anxiety", "How to sleep searches", "Umbrella purchases"],
  planets: ["Mars opposition brightness", "Avocado imports", "Jupiter visibility", "Electric guitar sales"],
  stocks: ["Tech stock closes", "Lemonade revenue", "Bank index movement", "Movie sequel releases"],
  memes: ["Meme template mentions", "Energy drink sales", "Viral dance views", "Pizza topping debates"],
  weird: ["UFO reports", "Yogurt aisle choices", "Fortune cookie exports", "Lost left socks"],
  crime: ["Larceny reports", "Ice cream truck licenses", "Traffic citations", "Novelty mug sales"],
  death: ["Lightning injuries", "Pool noodle purchases", "Hazard signage", "Action movie tickets"],
  "baby-names": ["Babies named Luna", "Moon phase searches", "Babies named Arlo", "Acoustic guitar sales"],
  elections: ["Voter turnout", "Pumpkin spice mentions", "Campaign donations", "Raincoat imports"],
  youtube: ["Daily upload hours", "Instant noodle sales", "Thumbnail contrast", "Gym membership starts"],
  occupations: ["Software jobs", "Cold brew sales", "Florist employment", "Romantic comedy releases"],
  sports: ["Baseball attendance", "Hot dog consumption", "Marathon finishers", "Sunscreen imports"],
  weather: ["Average rainfall", "Board game sales", "Heatwave days", "Smoothie purchases"],
  environment: ["Recycling rates", "Reusable bottle searches", "Forest coverage", "Camping hammock sales"],
  energy: ["Solar generation", "Sunglasses sales", "Wind output", "Kite festival attendance"],
  films: ["Box office revenue", "Popcorn shipments", "Oscar mentions", "Black turtleneck sales"],
  food: ["Mozzarella production", "Swimming pool permits", "Coffee imports", "Late-night coding searches"],
  education: ["Math degrees", "Crossword popularity", "Library visits", "Rainy weekend streaming"]
};

const els = {
  html: document.documentElement,
  home: document.querySelector("#home-view"),
  explorer: document.querySelector("#explorer-view"),
  about: document.querySelector("#about-view"),
  grid: document.querySelector("#category-grid"),
  categoryCount: document.querySelector("#category-count"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeIcon: document.querySelector(".theme-icon"),
  pairTitle: document.querySelector("#pair-title"),
  pairSummary: document.querySelector("#pair-summary"),
  explorerCategory: document.querySelector("#explorer-category"),
  scoreValue: document.querySelector("#score-value")
};

let currentCategory = categories[0];
let currentPairIndex = 0;

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function resizeCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function makeSeries(seed, count = 10) {
  const a = [];
  const b = [];
  for (let i = 0; i < count; i += 1) {
    const trend = 34 + i * 5.2;
    const wave = Math.sin(i * 0.82 + seed) * 10;
    a.push(trend + wave + Math.cos(seed * 1.7 + i) * 4);
    b.push(trend + wave * 0.82 + Math.sin(seed + i * 1.4) * 5);
  }
  return [a, b];
}

function drawChart(canvas, category, seed = 1, labels = false) {
  const { ctx, width, height } = resizeCanvas(canvas);
  const accent = category.color;
  const [r, g, b] = hexToRgb(accent);
  const [seriesA, seriesB] = makeSeries(seed, 12);
  const pad = labels ? 46 : 22;
  const max = Math.max(...seriesA, ...seriesB) + 10;
  const min = Math.min(...seriesA, ...seriesB) - 10;
  const xStep = (width - pad * 2) / (seriesA.length - 1);
  const yFor = value => height - pad - ((value - min) / (max - min)) * (height - pad * 2);

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.14)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i += 1) {
    const y = pad + (i * (height - pad * 2)) / 5;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  function line(series, color, widthValue) {
    ctx.beginPath();
    series.forEach((value, index) => {
      const x = pad + index * xStep;
      const y = yFor(value);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = widthValue;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  line(seriesA, accent, labels ? 4 : 3);
  line(seriesB, "rgba(14, 138, 160, 0.95)", labels ? 4 : 3);

  seriesA.forEach((value, index) => {
    ctx.beginPath();
    ctx.arc(pad + index * xStep, yFor(value), labels ? 4 : 3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
  });

  if (labels) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-muted");
    ctx.font = "600 12px JetBrains Mono, monospace";
    ctx.fillText("2008", pad, height - 16);
    ctx.fillText("2020", width - pad - 34, height - 16);
    ctx.fillStyle = accent;
    ctx.fillText("Series A", pad, 24);
    ctx.fillStyle = "rgba(14, 138, 160, 0.95)";
    ctx.fillText("Series B", pad + 86, 24);
  }
}

function miniSvg(category, seed) {
  const points = Array.from({ length: 8 }, (_, index) => {
    const y = 20 + Math.sin(index * 1.2 + seed) * 12 + Math.cos(index * 0.7 + seed * 2) * 8;
    return `${index * 14},${y.toFixed(2)}`;
  }).join(" ");
  return `<svg class="mini-chart" viewBox="0 0 98 40" aria-hidden="true"><polyline points="${points}" fill="none" stroke="${category.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderCategories() {
  els.categoryCount.textContent = `${categories.length} topics`;
  els.grid.innerHTML = categories.map((category, index) => `
    <button class="category-card" type="button" data-category="${category.id}" style="--card-accent:${category.color};--card-soft:${category.color}18;--card-glow:${category.color}2a">
      <span class="category-icon">${category.icon}</span>
      <strong>${category.name}</strong>
      <p>${category.tagline}</p>
      ${miniSvg(category, index * 1.7)}
    </button>
  `).join("");
}

function selectCategory(categoryId, next = false) {
  currentCategory = categories.find(category => category.id === categoryId) || categories[0];
  const bank = pairBank[currentCategory.id] || pairBank.weird;
  if (next) currentPairIndex = (currentPairIndex + 2) % bank.length;
  else currentPairIndex = Math.floor(Math.random() * (bank.length / 2)) * 2;
  const first = bank[currentPairIndex];
  const second = bank[(currentPairIndex + 1) % bank.length];
  const score = (0.86 + ((currentPairIndex + currentCategory.name.length) % 11) / 100).toFixed(2);

  els.home.classList.add("hidden");
  els.about.classList.add("hidden");
  els.explorer.classList.remove("hidden");
  els.explorerCategory.textContent = currentCategory.name;
  els.pairTitle.textContent = `${first} vs. ${second}`;
  els.pairSummary.textContent = `The trend lines for ${first.toLowerCase()} and ${second.toLowerCase()} move together just enough to look meaningful. They probably are not.`;
  els.scoreValue.textContent = score;
  drawChart(document.querySelector("#detail-chart"), currentCategory, currentPairIndex + currentCategory.name.length, true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHome() {
  els.explorer.classList.add("hidden");
  els.about.classList.add("hidden");
  els.home.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAbout() {
  els.home.classList.add("hidden");
  els.explorer.classList.add("hidden");
  els.about.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function surprise() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  selectCategory(category.id);
}

function setTheme(theme) {
  els.html.dataset.theme = theme;
  localStorage.setItem("spurious-static-theme", theme);
  els.themeIcon.textContent = theme === "dark" ? "☼" : "☾";
  drawChart(document.querySelector("#hero-chart"), categories[0], 3, true);
  if (!els.explorer.classList.contains("hidden")) {
    drawChart(document.querySelector("#detail-chart"), currentCategory, currentPairIndex + currentCategory.name.length, true);
  }
}

function setupParticles() {
  const canvas = document.querySelector("#particle-canvas");
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 46 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 1 + Math.random() * 2.5,
    speed: 0.00025 + Math.random() * 0.00055,
    phase: i
  }));

  function draw(time) {
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent");
    ctx.fillStyle = color;
    particles.forEach(particle => {
      const x = (particle.x * window.innerWidth + Math.sin(time * particle.speed + particle.phase) * 34) % window.innerWidth;
      const y = (particle.y * window.innerHeight + Math.cos(time * particle.speed + particle.phase) * 24) % window.innerHeight;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(x, y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

renderCategories();
setupParticles();
setTheme(localStorage.getItem("spurious-static-theme") || "light");

document.querySelector("#home-button").addEventListener("click", showHome);
document.querySelector("#about-button").addEventListener("click", showAbout);
document.querySelector("#about-back-button").addEventListener("click", showHome);
document.querySelector("#back-button").addEventListener("click", showHome);
document.querySelector("#surprise-button").addEventListener("click", surprise);
document.querySelector("#quick-surprise-button").addEventListener("click", surprise);
document.querySelector("#next-pair-button").addEventListener("click", () => selectCategory(currentCategory.id, true));
els.themeToggle.addEventListener("click", () => setTheme(els.html.dataset.theme === "dark" ? "light" : "dark"));
els.grid.addEventListener("click", event => {
  const card = event.target.closest("[data-category]");
  if (card) selectCategory(card.dataset.category);
});

window.addEventListener("resize", () => {
  drawChart(document.querySelector("#hero-chart"), categories[0], 3, true);
  if (!els.explorer.classList.contains("hidden")) {
    drawChart(document.querySelector("#detail-chart"), currentCategory, currentPairIndex + currentCategory.name.length, true);
  }
});
