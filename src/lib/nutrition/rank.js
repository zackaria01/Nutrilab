/**
 * Rank catalog foods by a reported nutrient amount per reference quantity.
 * Missing values are skipped. Reported zeros are not listed as "rich".
 * Omega-3 cards sort by the largest named compound (ALA, EPA, or DHA).
 * They do not invent a combined omega-3 total.
 */
export function rankFoodsForNutrient(foods, nutrient) {
  const rows = []
  for (const food of foods) {
    const parts = []
    for (const key of nutrient.nutrientKeys) {
      const value = food.nutrientsPerReference?.[key]
      if (value == null || !Number.isFinite(value) || value <= 0) continue
      parts.push({ key, value })
    }
    if (parts.length === 0) continue
    const score = Math.max(...parts.map((part) => part.value))
    rows.push({ food, parts, score })
  }
  rows.sort((a, b) => b.score - a.score || a.food.names.en.localeCompare(b.food.names.en))
  return rows
}

export function foodsWithUnspecified18_3(foods) {
  return foods
    .map((food) => ({ food, value: food.nutrientsPerReference?.pufa183UnspecifiedG }))
    .filter((row) => typeof row.value === 'number' && row.value > 0)
    .sort((a, b) => b.value - a.value)
}
