/**
 * Server-only food search. USDA needs FDC_API_KEY. Open Food Facts does not.
 * Profile data must never be sent here — callers pass a food query only.
 * Micronutrients from Open Food Facts are left unknown: community units are easy to mis-scale.
 */
import { kjToKcal } from '../src/lib/nutrition/units.js'
import { NUTRIENT_KEYS } from '../src/lib/nutrition/units.js'

const USDA_IDS = {
  1008: 'energyKcal',
  1003: 'proteinG',
  1004: 'fatG',
  1005: 'carbohydrateG',
  1079: 'fiberG',
  2000: 'sugarsG',
  1258: 'saturatedFatG',
  1090: 'magnesiumMg',
  1087: 'calciumMg',
  1089: 'ironMg',
  1092: 'potassiumMg',
  1095: 'zincMg',
  1093: 'sodiumMg',
  1162: 'vitaminCMg',
  1114: 'vitaminDUg',
  1177: 'folateUg',
  1178: 'b12Ug',
  1106: 'vitaminAUg',
  1175: 'vitaminB6Mg',
  1404: 'omega3AlaG',
  1278: 'omega3EpaG',
  1272: 'omega3DhaG',
}

const cache = new Map()
const recent = []

function allowRequest() {
  const now = Date.now()
  while (recent.length && now - recent[0] > 60_000) recent.shift()
  if (recent.length >= 8) return false
  recent.push(now)
  return true
}

function remember(key, value) {
  cache.set(key, { at: Date.now(), value })
  if (cache.size > 100) cache.delete(cache.keys().next().value)
}

function recall(key) {
  const hit = cache.get(key)
  if (!hit || Date.now() - hit.at > 10 * 60_000) return null
  return hit.value
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'NutriLab/1.0 (educational nutrition app)', Accept: 'application/json', ...headers },
    signal: AbortSignal.timeout(8000),
  })
  if (response.status === 429) {
    const error = new Error('rate_limited')
    error.code = 'rate_limited'
    throw error
  }
  if (!response.ok) {
    const error = new Error('upstream')
    error.code = 'upstream'
    throw error
  }
  return response.json()
}

function blankNutrients() {
  return Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, null]))
}

function nutrientsFromUsda(foodNutrients = []) {
  const nutrients = blankNutrients()
  for (const item of foodNutrients) {
    const id = item.nutrientId ?? item.nutrient?.id
    const key = USDA_IDS[id]
    if (!key || item.value == null || !Number.isFinite(Number(item.value))) continue
    nutrients[key] = Number(item.value)
  }
  const kj = foodNutrients.find((item) => (item.nutrientId ?? item.nutrient?.id) === 1062)
  if (nutrients.energyKcal == null && kj?.value != null) {
    nutrients.energyKcal = kjToKcal(Number(kj.value))
  }
  return nutrients
}

function usdaFood(food) {
  const description = food.description || food.lowercaseDescription || 'USDA food'
  return {
    id: `usda:${food.fdcId}`,
    source: 'usda',
    sourceRecordId: String(food.fdcId),
    sourceUrl: `https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`,
    sourceName: 'USDA FoodData Central',
    names: { en: description, fr: null, ar: null },
    originalName: description,
    category: 'other',
    kind: 'whole',
    preparation: food.dataType || null,
    description: {
      en: 'Result from USDA FoodData Central. The name is shown in the source language.',
      fr: 'Résultat de USDA FoodData Central. Le nom est celui de la source.',
      ar: 'نتيجة من USDA FoodData Central. الاسم كما ورد في المصدر.',
    },
    referenceAmount: 100,
    referenceUnit: 'g',
    servings: [],
    nutrientsPerReference: nutrientsFromUsda(food.foodNutrients),
    dataCompleteness: 'partial',
  }
}

function offNumber(nutriments, key) {
  if (!nutriments || !Object.prototype.hasOwnProperty.call(nutriments, key)) return null
  const value = Number(nutriments[key])
  return Number.isFinite(value) ? value : null
}

function offFood(product) {
  const nutriments = product.nutriments || {}
  const nutrients = blankNutrients()
  nutrients.energyKcal = offNumber(nutriments, 'energy-kcal_100g')
  if (nutrients.energyKcal == null) {
    const kj = offNumber(nutriments, 'energy-kj_100g')
    if (kj != null) nutrients.energyKcal = kjToKcal(kj)
  }
  nutrients.proteinG = offNumber(nutriments, 'proteins_100g')
  nutrients.carbohydrateG = offNumber(nutriments, 'carbohydrates_100g')
  nutrients.fatG = offNumber(nutriments, 'fat_100g')
  nutrients.fiberG = offNumber(nutriments, 'fiber_100g')
  nutrients.sugarsG = offNumber(nutriments, 'sugars_100g')
  nutrients.saturatedFatG = offNumber(nutriments, 'saturated-fat_100g')
  const sodiumGrams = offNumber(nutriments, 'sodium_100g')
  nutrients.sodiumMg = sodiumGrams == null ? null : sodiumGrams * 1000
  const name = product.product_name || product.product_name_en || product.code
  return {
    id: `off:${product.code}`,
    source: 'off',
    sourceRecordId: String(product.code),
    sourceUrl: `https://world.openfoodfacts.org/product/${product.code}`,
    sourceName: 'Open Food Facts',
    names: {
      en: product.product_name_en || null,
      fr: product.product_name_fr || null,
      ar: product.product_name_ar || null,
    },
    originalName: name,
    imageUrl: product.image_front_small_url || product.image_front_url || null,
    imageAttribution: 'Open Food Facts contributors, CC BY-SA',
    category: 'packaged',
    kind: 'packaged',
    preparation: 'packaged',
    description: {
      en: 'Packaged product from Open Food Facts. The label can be incomplete, and a photo does not verify the numbers.',
      fr: 'Produit emballé d’Open Food Facts. L’étiquette peut être incomplète, et la photo ne vérifie pas les chiffres.',
      ar: 'منتج معلب من Open Food Facts. قد تكون البطاقة ناقصة، والصورة لا تثبت الأرقام.',
    },
    referenceAmount: 100,
    referenceUnit: 'g',
    servings: [],
    nutrientsPerReference: nutrients,
    dataCompleteness: 'partial',
  }
}

async function searchUsda(query, apiKey) {
  if (!apiKey) {
    const error = new Error('missing_key')
    error.code = 'missing_key'
    throw error
  }
  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search')
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('query', query)
  url.searchParams.set('pageSize', '8')
  url.searchParams.set('dataType', 'Foundation,SR Legacy')
  const data = await fetchJson(url)
  return (data.foods || []).map(usdaFood)
}

async function searchOff(query) {
  const url = new URL('https://world.openfoodfacts.org/api/v2/search')
  url.searchParams.set('search_terms', query)
  url.searchParams.set('page_size', '5')
  url.searchParams.set('fields', 'code,product_name,product_name_en,product_name_fr,product_name_ar,nutriments,image_front_small_url')
  const data = await fetchJson(url)
  return (data.products || []).filter((product) => product.code).map(offFood)
}

export async function searchRemote(rawQuery, apiKey) {
  const query = String(rawQuery || '').replace(/[^\p{L}\p{N}\s.'’-]/gu, '').trim().slice(0, 80)
  if (!query) return { usda: [], off: [], errors: ['empty'], apiKeyConfigured: Boolean(apiKey) }
  const cached = recall(`q:${query}:${Boolean(apiKey)}`)
  if (cached) return cached
  if (!allowRequest()) return { usda: [], off: [], errors: ['rate_limited'], apiKeyConfigured: Boolean(apiKey) }

  const errors = []
  const [usda, off] = await Promise.all([
    searchUsda(query, apiKey).catch((error) => {
      errors.push(error.code || 'usda_failed')
      return []
    }),
    searchOff(query).catch((error) => {
      errors.push(error.code === 'rate_limited' ? 'off_rate_limited' : 'off_failed')
      return []
    }),
  ])
  const value = { usda, off, errors, apiKeyConfigured: Boolean(apiKey) }
  remember(`q:${query}:${Boolean(apiKey)}`, value)
  return value
}

export async function fetchRemoteFood(source, id, apiKey) {
  if (source === 'usda') {
    if (!apiKey) {
      const error = new Error('missing_key')
      error.code = 'missing_key'
      throw error
    }
    const url = new URL(`https://api.nal.usda.gov/fdc/v1/food/${encodeURIComponent(id)}`)
    url.searchParams.set('api_key', apiKey)
    const food = await fetchJson(url)
    return usdaFood(food)
  }
  if (source === 'off') {
    const data = await fetchJson(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(id)}.json`)
    if (!data.product) return null
    return offFood(data.product)
  }
  return null
}
