import { describe, expect, it } from 'vitest'
import { FOODS } from '../src/data/foods.js'
import { RECIPES } from '../src/data/recipes.js'
import { searchFoods } from '../src/lib/search/normalize.js'
import { searchRecipes } from '../src/lib/search/recipes.js'

describe('cross-language search', () => {
  it('maps banana, banane, and موز to the same food', () => {
    const ids = ['banana', 'banane', 'موز'].map((query) => searchFoods(FOODS, query)[0].id)
    expect(new Set(ids)).toEqual(new Set(['curated:banana']))
  })

  it('maps egg, œuf, oeuf, and بيض to egg foods', () => {
    for (const query of ['egg', 'œuf', 'oeuf', 'بيض']) {
      const ids = searchFoods(FOODS, query).map((food) => food.id)
      expect(ids.some((id) => id.startsWith('curated:egg'))).toBe(true)
    }
  })

  it('finds harira and bissara recipes without guessing a single mixed-dish food', () => {
    expect(searchRecipes(RECIPES, 'حريرة')[0].id).toBe('harira')
    expect(searchRecipes(RECIPES, 'bissara')[0].id).toBe('bissara')
    expect(searchRecipes(RECIPES, 'مسمن')[0].id).toBe('msemen')
    expect(searchRecipes(RECIPES, 'بغرير')[0].id).toBe('baghrir')
  })
})
