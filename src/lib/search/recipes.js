import { normalizeText, scoreFood } from './normalize.js'

export function scoreRecipe(recipe, rawQuery) {
  const query = normalizeText(rawQuery)
  if (!query) return 0
  const blob = {
    names: recipe.title,
    aliases: recipe.aliases || [],
  }
  return scoreFood(blob, query)
}

export function searchRecipes(recipes, rawQuery) {
  const query = normalizeText(rawQuery)
  if (!query) return recipes
  return recipes
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.recipe)
}
