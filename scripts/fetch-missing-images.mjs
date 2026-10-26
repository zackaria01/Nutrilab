import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const source = await readFile(path.join(ROOT, 'scripts/fetch-images.mjs'), 'utf8')
const patched = source
  .replace('await rm(path.join(ROOT, \'scripts/banana-page.html\'), { force: true })', '')
  .replace(/await mkdir[\s\S]*$/, '')
const moduleUrl = path.join(ROOT, 'scripts/.fetch-images-lib.mjs')
await writeFile(moduleUrl, `${patched}\nexport { choose }\n`)

const { choose } = await import(pathToFileURL(moduleUrl).href)
const credits = JSON.parse(await readFile(path.join(ROOT, 'src/data/imageCredits.json'), 'utf8'))

const foods = {
  sardines: ['Sardines in a can.jpg', 'Canned sardines with lemon.jpg'],
  'lentils-cooked': ['Liat Portal for Foodie Disorder - Cooked Lentils with Caramelized Onions.jpg', 'Lentil soup in a bowl.jpg'],
  'canola-oil': ['CanolaOil bottle.jpg', 'Great value canola oil in a bottle.JPG'],
  'egg-boiled': ['Perfectly cooked hard-boiled egg cross-section showing latebra structure.jpg', 'Perfectly Boiled eggs picture.JPG', 'African Boiled eggs. 02.jpg'],
  'chicken-raw': ['CHICKEN BREAST.jpg'],
  'chicken-roasted': ['Generous portion of roasted chicken.jpg', 'Lemon Brined Roasted Chicken.jpg'],
  'chickpeas-cooked': ['Cooked and frozen chickpea (52300548852).jpg'],
  semolina: ['Semolina grains.jpg', 'Liat Portal for Foodie Disorder - Semolina, Flour, and Wheat Grains.jpg'],
}
const recipes = {
  'oatmeal-banana': ['Porridge 01.jpg'],
  'eggs-toast': ['Eggs On Toast - FIKA 2023-09-02.jpg', 'Breakfast in Australia; bacon and fried eggs on toast.jpg'],
  'fruit-smoothie': ['Glass of strawberry smoothie (6828826294).jpg', 'Fresh fruit smoothie being poured into a glass.jpg'],
  msemen: ['Msemmen.jpg', 'Msemmen-Ghrayef.jpg'],
  'chickpea-salad': ['Power protein salad bowl.jpg'],
  'tuna-sandwich': ['Liat Portal for Foodie Disorder - Tuna sandwich and Israeli salad breakfast.jpg', 'Liat Portal for Foodie Disorder - Open tuna salad sandwich with fresh salad.jpg'],
  bissara: ['Bissara Moroccan split pea and fava bean soup.jpg', 'Bissara (Moroccan Dip).JPG'],
  'lentil-soup': ['Lentil soup in a bowl.jpg', 'Lentil soup.jpg'],
  'vegetable-omelet': ['Vegetable Omelette with slice of bread and chutney.JPG', 'Veggie Omelette upside down.jpg'],
  'chicken-potatoes': ['02023 0166 Roasted Chicken and Potatoes with fried Beets.jpg', 'Roast Chicken With Rice.jpg'],
  'baked-salmon': ['Grilled plated salmon fillet.jpg', 'Salmon Fillet (30910417061).jpg'],
  'rice-beans-salad': ['Rice and beans 1.jpg', 'Mexican rice and beans.jpg'],
  harira: ['Liat Portal for Foodie Disorder - Harira soup.jpg', 'Harira de tafilalet.jpg'],
  'apple-almonds': ['Apple.jpg'],
  'yogurt-berries': ['Berries and yogurt in the breakfast buffet (43696401755).jpg'],
  'banana-peanut': ['Peanut butter and banana on toasted homemade bread - Massachusetts.jpg', 'Elvis Banana and Peanut Butter Sandwiches.jpg'],
  'carrot-hummus': ['Hummus and carrot (3841125815).jpg'],
  'egg-orange': ['African Boiled eggs. 02.jpg', 'Perfectly Boiled eggs picture.JPG'],
}

for (const [key, files] of Object.entries(foods)) {
  const credit = await choose(key, files, 'foods')
  if (credit) credits.foods[key] = credit
}
for (const [key, files] of Object.entries(recipes)) {
  const credit = await choose(key, files, 'recipes')
  if (credit) credits.recipes[key] = credit
}
await writeFile(path.join(ROOT, 'src/data/imageCredits.json'), `${JSON.stringify(credits, null, 2)}\n`)
const missing = [...Object.entries(credits.foods), ...Object.entries(credits.recipes)].filter(([, value]) => !value).map(([key]) => key)
if (missing.length) {
  console.error('Still missing', missing.join(', '))
  process.exitCode = 1
}
