/**
 * Recipe and diary aggregation.
 * Known numbers are summed. A missing value is not treated as zero.
 * If any contributor lacks a nutrient, that nutrient is marked incomplete
 * and the summed figure is only a partial total of the known parts.
 */

import { NUTRIENT_KEYS } from './units.js'
import { scaleNutrients } from './portions.js'

function blankEntry() {
  return { value: null, complete: true, knownCount: 0, contributorCount: 0 }
}

export function aggregateNutrients(nutrientSets) {
  const totals = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, blankEntry()]))
  for (const nutrients of nutrientSets) {
    for (const key of NUTRIENT_KEYS) {
      const entry = totals[key]
      entry.contributorCount += 1
      const value = nutrients?.[key]
      if (value == null || !Number.isFinite(value)) {
        entry.complete = false
        continue
      }
      entry.value = (entry.value ?? 0) + value
      entry.knownCount += 1
    }
  }
  for (const key of NUTRIENT_KEYS) {
    const entry = totals[key]
    if (entry.knownCount === 0) entry.value = null
    if (entry.contributorCount === 0) entry.complete = false
  }
  return totals
}

export function divideTotals(totals, servings) {
  if (typeof servings !== 'number' || !Number.isFinite(servings) || servings <= 0) return null
  const perServing = {}
  for (const key of NUTRIENT_KEYS) {
    const entry = totals[key]
    perServing[key] = {
      value: entry.value == null ? null : entry.value / servings,
      complete: entry.complete,
      knownCount: entry.knownCount,
      contributorCount: entry.contributorCount,
    }
  }
  return perServing
}

/**
 * Ingredient nutrition uses referenceValue * actualQuantity / referenceQuantity.
 * Servings scale ingredient quantities together, so calories per serving stay stable.
 * Cooking loss is not applied; callers must label the result as an estimate.
 */
export function computeRecipeNutrition(recipe, foodsById, servings = recipe.servings) {
  const baseServings = recipe.servings
  if (!baseServings || servings <= 0) return null
  const portionScale = servings / baseServings
  const lines = []
  const sets = []

  for (const ingredient of recipe.ingredients) {
    const food = foodsById[ingredient.foodId]
    const amount = ingredient.amount * portionScale
    if (!food) {
      lines.push({ ...ingredient, amount, food: null, nutrients: null, missingFood: true })
      sets.push(null)
      continue
    }
    const scaled = scaleNutrients(food.nutrientsPerReference, amount, food.referenceAmount)
    lines.push({
      ...ingredient,
      amount,
      unit: ingredient.unit || food.referenceUnit,
      food,
      nutrients: scaled?.nutrients ?? null,
      missingFood: false,
    })
    sets.push(scaled?.nutrients ?? null)
  }

  const total = aggregateNutrients(sets)
  const perServing = divideTotals(total, servings)
  const incomplete = NUTRIENT_KEYS.some((key) => !perServing[key].complete)
  return {
    servings,
    baseServings,
    lines,
    total,
    perServing,
    incomplete,
    estimated: true,
  }
}

export function sumDiarySnapshots(entries) {
  return aggregateNutrients(entries.map((entry) => entry.snapshot || {}))
}
