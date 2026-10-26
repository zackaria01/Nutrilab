/**
 * Canonical nutrient keys and unit conversions.
 * Null means unknown. A numeric zero means the source reported zero.
 * Presentation rounding happens here; callers keep full precision until display.
 */

export const NUTRIENT_KEYS = [
  'energyKcal',
  'proteinG',
  'carbohydrateG',
  'fatG',
  'fiberG',
  'sugarsG',
  'saturatedFatG',
  'magnesiumMg',
  'calciumMg',
  'ironMg',
  'potassiumMg',
  'zincMg',
  'sodiumMg',
  'vitaminCMg',
  'vitaminDUg',
  'folateUg',
  'b12Ug',
  'vitaminAUg',
  'vitaminB6Mg',
  'omega3AlaG',
  'omega3EpaG',
  'omega3DhaG',
  'pufa183UnspecifiedG',
]

export const NUTRIENT_UNITS = {
  energyKcal: 'kcal',
  proteinG: 'g',
  carbohydrateG: 'g',
  fatG: 'g',
  fiberG: 'g',
  sugarsG: 'g',
  saturatedFatG: 'g',
  magnesiumMg: 'mg',
  calciumMg: 'mg',
  ironMg: 'mg',
  potassiumMg: 'mg',
  zincMg: 'mg',
  sodiumMg: 'mg',
  vitaminCMg: 'mg',
  vitaminDUg: 'µg',
  folateUg: 'µg',
  b12Ug: 'µg',
  vitaminAUg: 'µg',
  vitaminB6Mg: 'mg',
  omega3AlaG: 'g',
  omega3EpaG: 'g',
  omega3DhaG: 'g',
  pufa183UnspecifiedG: 'g',
}

/** kcal = kJ / 4.184. Does not invent calories from macronutrients. */
export function kjToKcal(kilojoules) {
  if (typeof kilojoules !== 'number' || !Number.isFinite(kilojoules)) return null
  return kilojoules / 4.184
}

/** Vitamin D labeled in IU converts as µg = IU / 40. */
export function vitaminDIuToUg(iu) {
  if (typeof iu !== 'number' || !Number.isFinite(iu)) return null
  return iu / 40
}

export function roundForDisplay(key, value) {
  if (value == null || !Number.isFinite(value)) return null
  if (key === 'energyKcal') return Math.round(value)
  if (key === 'b12Ug' || key === 'vitaminDUg' || key === 'vitaminB6Mg') {
    return Math.round(value * 100) / 100
  }
  if (key.endsWith('Ug') || key === 'ironMg' || key === 'zincMg') {
    return Math.round(value * 100) / 100
  }
  return Math.round(value * 10) / 10
}

export function formatAmount(key, value) {
  const rounded = roundForDisplay(key, value)
  if (rounded == null) return null
  const unit = NUTRIENT_UNITS[key] || ''
  return { value: rounded, unit, text: `${rounded} ${unit}`.trim() }
}
