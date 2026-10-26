/**
 * One-off lookup of USDA FoodData Central SR Legacy / Foundation foods.
 * Writes a compact nutrient snapshot used to build the curated catalog.
 * Requires network. Uses the public DEMO_KEY only for this local research step.
 */

const QUERIES = [
  ['banana', 'Bananas, raw'],
  ['apple', 'Apples, raw, with skin'],
  ['egg-raw', 'Egg, whole, raw, fresh'],
  ['egg-boiled', 'Egg, whole, cooked, hard-boiled'],
  ['milk', 'Milk, whole, 3.25% milkfat, with added vitamin D'],
  ['yogurt', 'Yogurt, plain, whole milk'],
  ['oats', 'Cereals, oats, regular and quick, unenriched, dry'],
  ['rice-cooked', 'Rice, white, long-grain, regular, unenriched, cooked without salt'],
  ['chicken-raw', 'Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw'],
  ['chicken-roasted', 'Chicken, broiler or fryers, breast, skinless, boneless, meat only, cooked, roasted'],
  ['lentils-cooked', 'Lentils, mature seeds, cooked, boiled, without salt'],
  ['sardines', 'Fish, sardine, Atlantic, canned in oil, drained solids with bone'],
  ['salmon-cooked', 'Fish, salmon, Atlantic, farmed, cooked, dry heat'],
  ['spinach', 'Spinach, raw'],
  ['bread-whole-wheat', 'Bread, whole-wheat, commercially prepared'],
  ['potato-baked', 'Potatoes, baked, flesh and skin, without salt'],
  ['olive-oil', 'Oil, olive, salad or cooking'],
  ['almonds', 'Nuts, almonds'],
  ['peanut-butter', 'Peanut butter, smooth style, without salt'],
  ['chickpeas-cooked', 'Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt'],
  ['carrot', 'Carrots, raw'],
  ['hummus', 'Hummus, commercial'],
  ['tuna', 'Fish, tuna, light, canned in water, drained solids'],
  ['strawberry', 'Strawberries, raw'],
  ['tomato', 'Tomatoes, red, ripe, raw, year round average'],
  ['fava-cooked', 'Broadbeans (fava beans), mature seeds, cooked, boiled, without salt'],
  ['onion', 'Onions, raw'],
  ['cucumber', 'Cucumber, with peel, raw'],
  ['broccoli', 'Broccoli, raw'],
  ['walnut', 'Nuts, walnuts, english'],
  ['sweet-potato', 'Sweet potato, cooked, baked in skin, flesh, without salt'],
  ['dates', 'Dates, deglet noor'],
  ['orange', 'Oranges, raw, all commercial varieties'],
  ['kidney-beans', 'Beans, kidney, red, mature seeds, cooked, boiled, without salt'],
  ['bell-pepper', 'Peppers, sweet, red, raw'],
  ['lettuce', 'Lettuce, green leaf, raw'],
  ['garlic', 'Garlic, raw'],
  ['lemon', 'Lemons, raw, without peel'],
  ['parsley', 'Parsley, fresh'],
  ['white-beans', 'Beans, white, mature seeds, cooked, boiled, without salt'],
  ['couscous-cooked', 'Couscous, cooked'],
  ['flour', 'Wheat flour, white, all-purpose, unenriched'],
  ['semolina', 'Wheat flour, semolina, unenriched'],
  ['blueberries', 'Blueberries, raw'],
]

const KEEP = new Set([
  1008, 1062, 1003, 1004, 1005, 1079, 2000, 1063, 1258,
  1090, 1087, 1089, 1092, 1095, 1093, 1162, 1114, 324,
  1177, 1178, 1106, 1404, 1278, 1272, 1175,
])

async function search(description) {
  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search')
  url.searchParams.set('api_key', 'DEMO_KEY')
  url.searchParams.set('query', description)
  url.searchParams.set('pageSize', '5')
  url.searchParams.set('dataType', 'SR Legacy,Foundation')
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
  if (!response.ok) {
    throw new Error(`${response.status} for ${description}`)
  }
  const data = await response.json()
  const foods = data.foods || []
  const exact = foods.find((food) => food.description?.toLowerCase() === description.toLowerCase())
  return exact || foods[0] || null
}

function compact(food) {
  const nutrients = {}
  for (const item of food.foodNutrients || []) {
    const id = item.nutrientId ?? item.nutrient?.id
    if (!KEEP.has(id)) continue
    nutrients[id] = {
      name: item.nutrientName ?? item.nutrient?.name,
      unit: item.unitName ?? item.nutrient?.unitName,
      value: item.value,
    }
  }
  return {
    fdcId: food.fdcId,
    description: food.description,
    dataType: food.dataType,
    nutrients,
  }
}

const snapshot = {}
for (const [id, description] of QUERIES) {
  try {
    const food = await search(description)
    snapshot[id] = food
      ? compact(food)
      : { error: 'no match', query: description }
    console.error(id, snapshot[id].fdcId, snapshot[id].description)
  } catch (error) {
    snapshot[id] = { error: String(error), query: description }
    console.error(id, error)
  }
  await new Promise((resolve) => setTimeout(resolve, 250))
}

process.stdout.write(JSON.stringify(snapshot, null, 2))
