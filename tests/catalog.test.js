import { access } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import credits from '../src/data/imageCredits.json'
import { FOODS } from '../src/data/foods.js'
import { NUTRIENTS } from '../src/data/nutrients.js'
import { MEAL_TYPES, RECIPES } from '../src/data/recipes.js'
import ar from '../src/locales/ar.json'
import en from '../src/locales/en.json'
import fr from '../src/locales/fr.json'

function keysOf(value, prefix = '') {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, child]) => keysOf(child, prefix ? `${prefix}.${key}` : key))
}

describe('catalog', () => {
  it('ships at least 30 sourced foods with calories and macros', () => {
    expect(FOODS.length).toBeGreaterThanOrEqual(30)
    for (const food of FOODS) {
      expect(food.sourceUrl).toContain(food.sourceRecordId)
      for (const key of ['energyKcal', 'proteinG', 'carbohydrateG', 'fatG']) {
        expect(typeof food.nutrientsPerReference[key]).toBe('number')
      }
      expect(food.names.en && food.names.fr && food.names.ar).toBeTruthy()
    }
  })

  it('has five complete recipes in each meal', () => {
    for (const meal of MEAL_TYPES) {
      const items = RECIPES.filter((recipe) => recipe.meal === meal)
      expect(items.length).toBeGreaterThanOrEqual(5)
      for (const recipe of items) {
        expect(recipe.ingredients.length).toBeGreaterThan(0)
        expect(recipe.steps.length).toBeGreaterThan(1)
        expect(recipe.title.ar).toBeTruthy()
        expect(recipe.steps[0].fr).toBeTruthy()
      }
    }
    expect(RECIPES.some((recipe) => recipe.region === 'morocco')).toBe(true)
  })

  it('ships a distinct licensed photo for every food and recipe', async () => {
    const sources = new Set()
    for (const food of FOODS) {
      const credit = credits.foods[food.key]
      expect(credit?.src, food.key).toMatch(/^\/images\/foods\//)
      expect(credit.license).toBeTruthy()
      expect(credit.page).toContain('commons.wikimedia.org')
      sources.add(credit.src)
      await access(path.join(process.cwd(), 'public', credit.src))
    }
    for (const recipe of RECIPES) {
      const credit = credits.recipes[recipe.id]
      expect(credit?.src, recipe.id).toMatch(/^\/images\/recipes\//)
      expect(credit.license).toBeTruthy()
      sources.add(credit.src)
      await access(path.join(process.cwd(), 'public', credit.src))
    }
    expect(sources.size).toBe(FOODS.length + RECIPES.length)
  })

  it('includes the twelve nutrient pages', () => {
    expect(NUTRIENTS.map((item) => item.slug)).toEqual([
      'protein', 'fiber', 'magnesium', 'vitamin-b12', 'omega-3', 'iron',
      'calcium', 'vitamin-c', 'vitamin-d', 'potassium', 'zinc', 'folate',
    ])
  })

  it('keeps locale keys aligned and non-empty', () => {
    const enKeys = keysOf(en).sort()
    expect(keysOf(fr).sort()).toEqual(enKeys)
    expect(keysOf(ar).sort()).toEqual(enKeys)
    for (const tree of [en, fr, ar]) {
      for (const key of keysOf(tree)) {
        const value = key.split('.').reduce((node, part) => node[part], tree)
        expect(typeof value).toBe('string')
        expect(value.trim()).not.toBe('')
        expect(value).not.toContain('[translate]')
      }
    }
  })
})
