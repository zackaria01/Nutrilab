# NutriLab

NutriLab is a mobile-first nutrition education app for people who are new to the subject. It is not a medical device and it does not prescribe a diet. English, French, and Arabic are all first-class, and Arabic uses a right-to-left layout.

## What works now

- Onboarding with an explainable adult BMI (ages 20+ only) and an optional Mifflin–St Jeor estimate that is never derived from BMI alone
- Dashboard, food search, food details with portion math, 20+ recipes, a 12-nutrient explorer, and a daily log stored in the browser
- Cross-language search (`banana`, `banane`, `موز`, and the same idea for other starter foods)
- Curated USDA FoodData Central SR Legacy values so the app is useful with no API key
- Optional remote search: USDA (needs a server key) and Open Food Facts (no key, rate-limited), only when the user submits a search
- Vercel and Netlify configs, with the API key kept on the server

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm test
npm run build
npm run preview
```

Copy `.env.example` to `.env` only if you want USDA remote search during `npm run dev`.

## Deploy to Vercel

1. Import this repository. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
2. Add `FDC_API_KEY` as an environment variable for Production (and Preview if you want). Do not use a `VITE_` prefix.
3. `vercel.json` sends non-API routes to `index.html` so a refresh on `/foods/curated:banana` still loads the app. Functions in `/api` stay server routes.

## Deploy to Netlify

1. Build command: `npm run build`. Publish directory: `dist`. Functions directory is set in `netlify.toml` (`netlify/functions`).
2. Add `FDC_API_KEY` in Site configuration → Environment variables. Server-side only.
3. `/api/*` is proxied to Netlify functions. Other paths fall back to `index.html`.

## API key

Create a free key from [data.gov / FoodData Central](https://fdc.nal.usda.gov/api-guide/). Set it as `FDC_API_KEY` on the host. The browser bundle never receives it. Without the key, local foods, recipes, nutrients, onboarding, and the diary still work. The foods page explains that USDA remote search is unavailable.

Open Food Facts does not need a key. Its public API is rate-limited (about 10 searches per minute). NutriLab calls it only after an explicit remote search, identifies itself with a User-Agent, and caches briefly.

## Data and licenses

- Starter foods are transcribed from the USDA FoodData Central SR Legacy CSV (April 2018 release), public domain / CC0. Each food links to its FDC record. Values are per 100 g. A missing nutrient is `null` (“Not reported”). A numeric `0` is a zero USDA reported.
- PUFA 18:3 is labeled ALA only when USDA nutrient id 1404 is present. Nutrient id 1270 stays “PUFA 18:3 (not labeled ALA)” and is not added into an invented omega-3 total.
- Recipes are home-style estimates from those ingredient weights. Cooking water and unlisted spices are disclosed as not counted. Raw and cooked foods are separate records.
- Open Food Facts results, when shown, stay in their own source and are not merged into USDA rows. Product photos are CC BY-SA from Open Food Facts contributors. The app does not republish a merged database.
- Food and recipe photographs in the starter catalog are individual Wikimedia Commons files (public domain, CC0, CC BY, or CC BY-SA). Each picture links to its file page and names the author and license. Those photos are not nutrition evidence.
- Nutrient explanations are beginner summaries with links to the NIH Office of Dietary Supplements. Adult BMI categories follow the CDC chart for ages 20+.
- Illustrations in the interface are original SVG drawings, not food photographs of the catalog items.

## Not finished (P1 / P2)

Favorites, recent searches, barcode lookup, daily coverage targets, dietary filters beyond the recipe screen, a weekly planner, shopping list, share links, installable PWA, accounts, dietitian mode, label OCR, and photo recognition are not in this version.
