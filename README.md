# The Recipe Box

A small cookbook: recipe tiles, aisle-sorted grocery checklists, all prep together, and cooking steps with amounts and ingredient forms included.

**Live:** https://prateekmadhikar.github.io/recipe-box/

## Edit or add a recipe

1. Edit `recipes/instant-pot-chili.json`, or copy it to a new `.json` file in `recipes/`.
2. Give the new recipe a unique lowercase `slug` (for example `lemon-chicken`). Put its photo in `assets/` and set `image` to its filename. Fill in the title, descriptions, tags, timing, equipment, grocery aisles, prep, cooking, notes, storage, and sources. Ingredient IDs must be unique within a recipe. Set `batchCount` to the number of equal batches; steps are repeated for each batch with independent checkmarks. Single-batch recipes omit the batch heading. Optional `methodTitle`, `methodLabel`, `storageLabel`, and `storageSubtitle` fields customize section labels for no-cook recipes. For single-batch recipes, use `1` and describe the full quantities.
3. Run `npm run build && npm run check` with Node.js 20 or later. No packages need installing.
4. Commit both the source changes and the generated `docs/` folder, then push to `main`. GitHub Pages republishes automatically.

For local preview: `python3 -m http.server 8080 --directory docs`, then open http://localhost:8080.

## Hosting

GitHub Pages serves the `docs/` folder on `main`. The site uses plain HTML, CSS, and JavaScript; recipes are pre-rendered, so the content and section toggles also work without JavaScript. Relative URLs support GitHub Pages project hosting and direct recipe-page links. The 404 page uses the `/recipe-box/` path; update it in `scripts/build.mjs` if renaming the repository.

Fonts are loaded from Google Fonts, with local serif/sans-serif fallbacks. Recipe photos are stored in the repository. Grocery, prep, and cooking checkmarks use browser-local storage per recipe; they do not sync between devices. Reset buttons affect only their own section. Print opens every recipe section and restores the previous open state afterward.

## Chili cooking notes

The chili recipe is written for **two batches in a 6-quart cooker**, each with 1½ cups broth (3 cups total) and a fully natural pressure release, following manufacturer guidance. It has not been kitchen-tested. Yield is approximate. Check cooker-specific liquid and fill limits. Canned Romano beans can replace kidney or pinto beans.

Food-handling and manufacturer references are linked on the recipe page. The chili photograph is AI-generated, not a photo of a tested finished batch. Its generation prompt and tool are documented in `assets/image-provenance.json`. The sapota ice cream photo is also AI-generated; its prompt is in `assets/sapota-image-provenance.json`.
