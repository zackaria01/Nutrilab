import fs from 'node:fs'
import readline from 'node:readline'

const IDS = {
  lemon: '167746',
  strawberry: '167762',
  cucumber: '168409',
  spinach: '168462',
  'sweet-potato': '168483',
  semolina: '168933',
  orange: '169097',
  garlic: '169230',
  lettuce: '169249',
  'couscous-cooked': '169700',
  'rice-cooked': '169757',
  flour: '169761',
  onion: '170000',
  'potato-baked': '170093',
  'bell-pepper': '170108',
  walnut: '170187',
  broccoli: '170379',
  carrot: '170393',
  parsley: '170416',
  tomato: '170457',
  almonds: '170567',
  'chicken-raw': '171077',
  milk: '171265',
  yogurt: '171284',
  'egg-raw': '171287',
  'olive-oil': '171413',
  apple: '171688',
  'chicken-roasted': '171477',
  blueberries: '171711',
  dates: '171726',
  'lentils-cooked': '172421',
  'peanut-butter': '172470',
  'bread-whole-wheat': '172688',
  'egg-boiled': '173424',
  tuna: '173709',
  'fava-cooked': '173753',
  'chickpeas-cooked': '173757',
  oats: '173904',
  banana: '173944',
  hummus: '174289',
  sardines: '175139',
  'salmon-cooked': '175168',
  'kidney-beans': '175194',
  'white-beans': '175203',
  chia: '170554',
  flaxseed: '169414',
  'canola-oil': '172336',
  salt: '173468',
}

const KEY_BY_NUTRIENT = {
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
  1270: 'pufa183G',
}

const wanted = new Set(Object.values(IDS))
const byFdc = Object.fromEntries(Object.values(IDS).map((id) => [id, {}]))
const portions = Object.fromEntries(Object.values(IDS).map((id) => [id, []]))

function splitCsv(line) {
  return line.split(',').map((part) => part.replaceAll('"', ''))
}

async function scan(path, onLine) {
  const rl = readline.createInterface({ input: fs.createReadStream(path) })
  let header = true
  for await (const line of rl) {
    if (header) {
      header = false
      continue
    }
    onLine(splitCsv(line))
  }
}

await scan('scripts/usda/food_nutrient.csv', (cols) => {
  const fdcId = cols[1]
  if (!wanted.has(fdcId)) return
  const key = KEY_BY_NUTRIENT[cols[2]]
  if (!key) return
  const amount = Number(cols[3])
  if (!Number.isFinite(amount)) return
  byFdc[fdcId][key] = amount
})

const portionPath = 'scripts/usda/food_portion.csv'
if (!fs.existsSync(portionPath)) {
  const { execSync } = await import('node:child_process')
  execSync(
    'unzip -p scripts/sr-legacy.zip "FoodData_Central_sr_legacy_food_csv_2018-04/food_portion.csv" > scripts/usda/food_portion.csv',
  )
}

await scan('scripts/usda/food_portion.csv', (cols) => {
  const fdcId = cols[1]
  if (!wanted.has(fdcId)) return
  const gramWeight = Number(cols[7])
  if (!Number.isFinite(gramWeight) || gramWeight <= 0) return
  portions[fdcId].push({
    amount: Number(cols[3]),
    description: cols[5],
    modifier: cols[6],
    gramWeight,
  })
})

const output = {}
for (const [key, fdcId] of Object.entries(IDS)) {
  output[key] = {
    fdcId: Number(fdcId),
    nutrients: byFdc[fdcId],
    portions: portions[fdcId],
  }
}

fs.writeFileSync('src/data/nutrientValues.json', JSON.stringify(output, null, 2))
console.log(`wrote ${Object.keys(output).length} foods`)
for (const [key, row] of Object.entries(output)) {
  const n = row.nutrients
  console.log(
    key,
    'kcal',
    n.energyKcal ?? 'NA',
    'P',
    n.proteinG ?? 'NA',
    'C',
    n.carbohydrateG ?? 'NA',
    'F',
    n.fatG ?? 'NA',
    'portions',
    row.portions.length,
  )
}
