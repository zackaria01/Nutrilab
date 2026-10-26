/**
 * Portion scaling. Same compatible units only (grams with a per-100 g reference,
 * millilitres with a per-100 mL reference). Unknown nutrients stay null.
 */

import { NUTRIENT_KEYS } from './units.js'

function isPositive(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function scaleFactor(selectedAmount, referenceAmount) {
  if (!isPositive(selectedAmount) || !isPositive(referenceAmount)) return null
  return selectedAmount / referenceAmount
}

/**
 * Multiply each known nutrient by selected/reference.
 * Null stays null so a missing micronutrient is never turned into zero.
 */
export function scaleNutrients(nutrientsPerReference, selectedAmount, referenceAmount) {
  const factor = scaleFactor(selectedAmount, referenceAmount)
  if (factor == null) return null
  const source = nutrientsPerReference || {}
  const nutrients = {}
  for (const key of NUTRIENT_KEYS) {
    const value = source[key]
    nutrients[key] = value == null || !Number.isFinite(value) ? null : value * factor
  }
  return { factor, nutrients }
}

export function emptyNutrients() {
  return Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, null]))
}
