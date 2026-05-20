# Do They Talk?

**Do They Talk?** is an interactive web app that explores funny and surprising spurious correlations between unrelated datasets. The goal is to show how two trends can look connected even when there is no real-world cause-and-effect relationship.

Live website: [https://0db48ab4.do-they-talk.pages.dev/](https://0db48ab4.do-they-talk.pages.dev/)

## What This Project Does

The app lets users explore categories like environment, economy, space, food, education, entertainment, and more. For each category, the system compares time-series datasets and finds pairs that appear highly correlated.

The project is built to demonstrate an important idea:

> Correlation does not equal causation.

A chart may look convincing, but that does not mean one thing caused the other.

## How The Data Is Processed

The project uses a local correlation discovery model written in JavaScript. It works like a lightweight ML-style scoring pipeline for time-series data.

The data processing flow is:

1. **Dataset Collection**

   All available datasets are registered in a central dataset registry. Each dataset includes metadata such as name, category, unit, source, and a function that loads the actual time-series values.

   The app uses a mix of public-source and local datasets, including sources such as World Bank, NASA, CDC, USDA, and other historical/statistical sources.

2. **Cleaning The Data**

   Before comparing two datasets, the model cleans each series by:

   - converting years and values into valid numbers
   - removing invalid or missing entries
   - ignoring unrealistic year values
   - averaging duplicate values for the same year
   - reducing extreme outliers using a median-based method

3. **Aligning The Years**

   Two datasets can only be compared for years they both share. The model finds the overlapping year range and aligns both datasets over the same time period.

4. **Handling Missing Values**

   If a dataset has small missing gaps inside the overlapping year range, the app fills them using interpolation. This creates two comparable annual series.

5. **Normalizing Values**

   Since datasets may use completely different units, such as dollars, percentages, people, temperatures, or deaths, the model normalizes the values. This allows the app to compare shape and movement instead of raw scale.

6. **Calculating Correlation**

   The app calculates the Pearson correlation coefficient using `simple-statistics`.

   The model produces:

   - `r` correlation score
   - `r-squared` score
   - absolute correlation strength
   - number of overlapping data points
   - confidence score
   - display labels such as `Dangerously Correlated` or `Suspiciously Similar`

7. **Filtering Results**

   Only strong correlations are shown. The current display threshold is:

   ```js
   MIN_DISPLAY_CORRELATION = 0.87
   ```

   This means the app only displays pairs that appear strongly correlated after cleaning, alignment, normalization, and scoring.

8. **Category Discovery**

   When a user selects a category, the app compares relevant datasets from that category against other datasets in the registry. This creates funny cross-category matches, which is the main idea behind spurious correlations.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Chart.js
- React Chart.js 2
- Framer Motion
- Lucide React
- Simple Statistics
- Axios

## How To Run This Project Locally

### 1. Clone The Repository

```bash
git clone https://github.com/Naisha-Gajkandh/DO-THEY-TALK.git
cd DO-THEY-TALK
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start The Development Server

```bash
npm run dev
```

The app will start locally. Open the local URL shown in your terminal, usually:

```bash
http://localhost:5173/
```

### 4. Build For Production

```bash
npm run build
```

This creates the production-ready files inside the `dist` folder.

## Cloudflare Pages Deployment

This project is deployed on Cloudflare Pages.

Official website:

[https://0db48ab4.do-they-talk.pages.dev/](https://0db48ab4.do-they-talk.pages.dev/)

For deployment, the production build is copied into the `cloudflare-pages` folder so Cloudflare can serve it as a static website.

Recommended Cloudflare settings:

- Framework preset: `None` or `Static HTML`
- Root directory: `cloudflare-pages`
- Build command: leave blank
- Build output directory: leave blank or `.`

## Project Structure

```txt
src/
  api/              API services, cache, fetchers, and normalizers
  components/       React UI components
  contexts/         Theme context
  data/             Dataset registry, categories, filters, and precalculated data
  engine/           Correlation model and discovery logic
  App.jsx           Main app component
  main.jsx          React entry point

cloudflare-pages/
  index.html        Static deployment entry file
  assets/           Production JS, CSS, and image assets
```

## Purpose Of The Project

This project is both educational and playful. It helps users understand that data visualization can be misleading when correlation is mistaken for causation.

The app makes statistics more approachable by showing strange, funny, and visually convincing relationships that should still be questioned critically.

## Author

Created by **Naisha Gajkandh**.
