/**
 * Save one Wikimedia Commons photograph per food and recipe.
 * Downloads go through Special:FilePath. License and author come from the file page.
 * NC licenses are rejected. Credits are written to src/data/imageCredits.json.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const UA = 'NutriLab/1.0 (educational nutrition app; local image catalog)'

const FOODS = {
  banana: ['Banana-Single.jpg'],
  apple: ['Red_Apple.jpg', 'Apple.jpg'],
  orange: ['Orange-Whole-&-Split.jpg'],
  strawberry: ['Strawberry.jpg', 'PerfectStrawberry.jpg'],
  blueberries: ['Blueberries.jpg', 'PattsBlueberries.jpg'],
  dates: ['Dates.jpg', 'Medjool_dates.jpg'],
  lemon: ['Lemon.jpg'],
  tomato: ['Tomatoes_plain_and_sliced.jpg', 'Tomato_je.jpg'],
  cucumber: ['ARS_cucumber.jpg', 'Cucumber_BNC.jpg'],
  spinach: ['Spinach_leaves.jpg'],
  broccoli: ['Broccoli_and_cross_section_edit.jpg', 'Broccoli.jpg'],
  carrot: ['Carrots_of_many_colors.jpg', 'Carrot.jpg', 'Carrots.JPG'],
  'bell-pepper': ['Red_capsicum_and_cross_section.jpg', 'Red_bell_pepper.jpg', 'Paprika_rot.jpg'],
  lettuce: ['Romaine_lettuce.jpg', 'Iceberg_lettuce.jpg', 'Lactuca_sativa.jpg'],
  onion: ['Onions.jpg', 'Red_onion.jpg', 'Zwiebeln.jpg'],
  garlic: ['Garlic_bulbs.jpg', 'Garlic.jpg', 'Knoblauch.jpg'],
  parsley: ['Parsley.jpg', 'Petroselinum_crispum_foliage.jpg', 'Petersilie.jpg'],
  'potato-baked': ['Baked_potato.jpg', 'Jacket_potato.jpg', 'Ofen-Kartoffel.jpg'],
  'sweet-potato': ['Sweet_potato.jpg', 'Ipomoea_batatas.jpg', 'Süßkartoffel.jpg'],
  'egg-raw': ['Brown_chicken_egg.jpg', 'Egg.jpg', 'Hühnerei.jpg'],
  'egg-boiled': ['Boiled_egg.jpg', 'Hard-boiled_egg.jpg', 'Gekochtes_Ei.jpg'],
  milk: ['Glass_of_Milk_(33657535532).jpg', 'Glass_of_milk.jpg', 'Milchglas.jpg'],
  yogurt: ['Joghurt.jpg', 'Yogurt.jpg', 'Plain_yogurt.jpg'],
  'chicken-raw': ['Raw_chicken_breast.jpg', 'Chicken_breast.jpg', 'Rohes_Hähnchenbrustfilet.jpg'],
  'chicken-roasted': ['Grilled_chicken_breast.jpg', 'Roast_chicken.jpg', 'Gegrillte_Hähnchenbrust.jpg'],
  sardines: ['Sardines.jpg', 'Canned_sardines.jpg', 'Sardinen.jpg'],
  'salmon-cooked': ['Grilled_salmon.jpg', 'Salmon_fillet.jpg', 'Gegrillter_Lachs.jpg'],
  tuna: ['Canned_tuna.jpg', 'Tuna_can.jpg', 'Thunfisch_Dose.jpg'],
  'lentils-cooked': ['Cooked_lentils.jpg', 'Lentils.jpg', 'Linsen.jpg'],
  'chickpeas-cooked': ['Chickpeas.jpg', 'Cooked_chickpeas.jpg', 'Kichererbsen.jpg'],
  'fava-cooked': ['Broad_beans.jpg', 'Fava_beans.jpg', 'Dicke_Bohnen.jpg'],
  'kidney-beans': ['Kidney_beans.jpg', 'Red_kidney_beans.jpg', 'Kidneybohnen.jpg'],
  'white-beans': ['White_beans.jpg', 'Navy_beans.jpg', 'Weiße_Bohnen.jpg'],
  hummus: ['Hummus.jpg', 'Hummus_from_The_Nile.jpg'],
  oats: ['Rolled_oats.jpg', 'Oatmeal.jpg', 'Haferflocken.jpg'],
  'rice-cooked': ['Cooked_rice.jpg', 'White_rice.jpg', 'Gekochter_Reis.jpg'],
  'bread-whole-wheat': ['Whole_wheat_bread.jpg', 'Whole_grain_bread.jpg', 'Vollkornbrot.jpg'],
  flour: ['Wheat_flour.jpg', 'Flour.jpg', 'Weizenmehl.jpg'],
  semolina: ['Semolina.jpg', 'Hartweizengrieß.jpg', 'Semoule.jpg'],
  'couscous-cooked': ['Couscous.jpg', 'Couscous_marocain.jpg'],
  'olive-oil': ['Olive_oil_from_Oneglia.jpg', 'Olive_oil.jpg', 'Olivenöl.jpg'],
  'canola-oil': ['Canola_oil.jpg', 'Rapeseed_oil.jpg', 'Rapsöl.jpg'],
  almonds: ['Almonds.jpg', 'Almond.jpg', 'Mandeln.jpg'],
  walnut: ['Walnuts.jpg', 'Walnut.jpg', 'Walnüsse.jpg'],
  'peanut-butter': ['PeanutButter.jpg', 'Peanut_butter.jpg', 'Erdnussbutter.jpg'],
  chia: ['Chia_seeds.jpg', 'Salvia_hispanica.jpg', 'Chiasamen.jpg'],
  flaxseed: ['Flax_seeds.jpg', 'Linseed.jpg', 'Leinsamen.jpg'],
  salt: ['Salt_shaker_on_white_background.jpg', 'Sea_salt.jpg', 'Speisesalz.jpg'],
}

const RECIPES = {
  'oatmeal-banana': ['Oatmeal.jpg', 'Porridge.jpg', 'Haferbrei.jpg'],
  'eggs-toast': ['Fried_eggs.jpg', 'Eggs_and_bacon.jpg', 'Spiegelei.jpg'],
  'yogurt-fruit-oats': ['Yogurt_with_fruit.jpg', 'Joghurt_mit_Früchten.jpg', 'Yogurt_parfait.jpg'],
  'tomato-omelet': ['Omelette.jpg', 'Tomato_omelette.jpg', 'Omelett.jpg'],
  'fruit-smoothie': ['Smoothie.jpg', 'Fruit_smoothie.jpg', 'Strawberry_smoothie.jpg'],
  baghrir: ['Baghrir.jpg', 'Beghrir.jpg', 'Baghrir_marocain.jpg'],
  msemen: ['Msemen.jpg', 'Msemmen.jpg', 'Msemen_marocain.jpg'],
  'chicken-rice-veg': ['Chicken_and_rice.jpg', 'Chicken_rice.jpg', 'Hähnchen_mit_Reis.jpg'],
  'sardine-salad': ['Sardine_salad.jpg', 'Salad_with_sardines.jpg'],
  'chickpea-salad': ['Chickpea_salad.jpg', 'Kichererbsensalat.jpg'],
  'tuna-sandwich': ['Tuna_sandwich.jpg', 'Thunfischsandwich.jpg'],
  bissara: ['Bissara.jpg', 'Bessara.jpg', 'Bissara_soup.jpg'],
  'lentil-soup': ['Lentil_soup.jpg', 'Linsensuppe.jpg'],
  'vegetable-omelet': ['Vegetable_omelette.jpg', 'Gemüseomelett.jpg'],
  'chicken-potatoes': ['Roast_chicken.jpg', 'Roast_chicken_and_potatoes.jpg', 'Brathähnchen.jpg'],
  'baked-salmon': ['Baked_salmon.jpg', 'Grilled_salmon_fillet.jpg', 'Lachsfilet.jpg'],
  'rice-beans-salad': ['Rice_and_beans.jpg', 'Reis_und_Bohnen.jpg'],
  harira: ['Harira.jpg', 'Harira_soup.jpg', 'Moroccan_harira.jpg'],
  'apple-almonds': ['Apple_slices.jpg', 'Sliced_apple.jpg'],
  'yogurt-berries': ['Yogurt_with_berries.jpg', 'Joghurt_mit_Beeren.jpg'],
  'banana-peanut': ['Peanut_butter_banana.jpg', 'Banana_sandwich.jpg'],
  'carrot-hummus': ['Hummus_and_vegetables.jpg', 'Hummus_plate.jpg'],
  'egg-orange': ['Breakfast_egg.jpg', 'Boiled_eggs.jpg'],
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function decode(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function metaFromHtml(html) {
  const start = html.search(/fileinfotpl/i)
  if (start < 0) return null
  const slice = html.slice(start, start + 14000)
  const text = decode(slice.replace(/<[^>]+>/g, '\n'))
  if (/non-?commercial/i.test(text)) return null
  let license = null
  const share = text.match(/Attribution-Share ?Alike(?: \d(?:\.\d)?)?(?: Unported| International)?/i)
  const by = text.match(/Creative Commons Attribution(?!-Share)(?: \d(?:\.\d)?)?/i)
  if (/CC0|Public domain|No restrictions/i.test(text) && !share && !by) {
    license = /CC0/i.test(text) ? 'CC0' : 'Public domain'
  } else if (share) {
    const version = share[0].match(/\d(?:\.\d)?/)
    license = `CC BY-SA${version ? ` ${version[0]}` : ''}`
  } else if (by || /CC BY \d/i.test(text)) {
    const version = (by?.[0] || text).match(/\d(?:\.\d)?/)
    license = `CC BY${version ? ` ${version[0]}` : ''}`
  }
  if (!license) return null
  const authorMatch = text.match(/\bAuthor\s+(.{2,140})/)
  const author = decode(authorMatch?.[1] || 'Wikimedia Commons contributor')
    .split(/\b(?:Permission|Other versions|Date|Source)\b/)[0]
    .replace(/[|]+/g, ' ')
    .trim()
    .slice(0, 160)
  return { author: author || 'Wikimedia Commons contributor', license }
}

async function fileExists(filename) {
  const response = await fetch(`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=720`, {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  })
  const type = response.headers.get('content-type') || ''
  if (!response.ok || !type.startsWith('image/') || type.includes('svg')) return null
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 8000) return null
  return { bytes, type }
}

async function readMeta(filename) {
  const response = await fetch(`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`, {
    headers: { 'User-Agent': UA },
  })
  if (!response.ok) return null
  return metaFromHtml(await response.text())
}

async function choose(key, files, folder) {
  for (const filename of files) {
    await wait(350)
    const image = await fileExists(filename)
    if (!image) {
      console.log('skip-missing', key, filename)
      continue
    }
    await wait(350)
    const meta = await readMeta(filename)
    if (!meta) {
      console.log('skip-license', key, filename)
      continue
    }
    const ext = image.type.includes('png') ? 'png' : 'jpg'
    const relative = `/images/${folder}/${key}.${ext}`
    await writeFile(path.join(ROOT, 'public/images', folder, `${key}.${ext}`), image.bytes)
    console.log('ok', folder, key, filename, meta.license, `${Math.round(image.bytes.length / 1024)}kb`)
    return {
      src: relative,
      author: meta.author,
      license: meta.license,
      page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`,
      file: filename,
    }
  }
  console.error('MISSING', folder, key)
  return null
}

await rm(path.join(ROOT, 'scripts/banana-page.html'), { force: true })
await mkdir(path.join(ROOT, 'public/images/foods'), { recursive: true })
await mkdir(path.join(ROOT, 'public/images/recipes'), { recursive: true })

const foods = {}
const recipes = {}
for (const [key, files] of Object.entries(FOODS)) foods[key] = await choose(key, files, 'foods')
for (const [key, files] of Object.entries(RECIPES)) recipes[key] = await choose(key, files, 'recipes')

const missing = [
  ...Object.entries(foods).filter(([, value]) => !value).map(([key]) => key),
  ...Object.entries(recipes).filter(([, value]) => !value).map(([key]) => key),
]
await writeFile(path.join(ROOT, 'src/data/imageCredits.json'), `${JSON.stringify({ foods, recipes }, null, 2)}\n`)
if (missing.length) {
  console.error('Still missing:', missing.join(', '))
  process.exitCode = 1
}
