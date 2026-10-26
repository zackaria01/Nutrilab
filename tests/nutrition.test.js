import { describe, expect, it } from 'vitest'
import { computeRecipeNutrition } from '../src/lib/nutrition/aggregate.js'
import { bmiCategory, calculateBmi, roundBmi } from '../src/lib/nutrition/bmi.js'
import { mifflinStJeor } from '../src/lib/nutrition/energy.js'
import { scaleNutrients } from '../src/lib/nutrition/portions.js'
import { kjToKcal, vitaminDIuToUg } from '../src/lib/nutrition/units.js'
import { getRecipe } from '../src/data/recipes.js'
import { FOODS_BY_ID } from '../src/data/foods.js'

describe('BMI', () => {
  it('computes 24.2 for 70 kg and 170 cm', () => {
    expect(roundBmi(calculateBmi(70, 170))).toBe(24.2)
    expect(bmiCategory(calculateBmi(70, 170), 30)).toBe('healthy')
  })

  it('does not apply adult categories under age 20', () => {
    expect(bmiCategory(calculateBmi(70, 170), 16)).toBe('not-adult')
    expect(bmiCategory(calculateBmi(70, 170), 19)).toBe('not-adult')
  })

  it('does not invent an energy target from BMI alone', () => {
    expect(mifflinStJeor({ weightKg: 70, heightCm: 170, ageYears: 30, sexParameter: null, activity: 'sitting' })).toBeNull()
    expect(mifflinStJeor({ weightKg: 70, heightCm: 170, ageYears: 16, sexParameter: 'female', activity: 'sitting' })).toBeNull()
  })
})

describe('portions and units', () => {
  it('scales 150 g to exactly 1.5 and keeps unknowns null', () => {
    const scaled = scaleNutrients({ energyKcal: 89, proteinG: 1.09, fiberG: null }, 150, 100)
    expect(scaled.factor).toBe(1.5)
    expect(scaled.nutrients.energyKcal).toBe(133.5)
    expect(scaled.nutrients.proteinG).toBeCloseTo(1.635)
    expect(scaled.nutrients.fiberG).toBeNull()
  })

  it('converts kJ and vitamin D IU without a hidden factor of 1000', () => {
    expect(kjToKcal(418.4)).toBeCloseTo(100)
    expect(vitaminDIuToUg(40)).toBe(1)
  })
})

describe('recipes', () => {
  it('marks a recipe incomplete when a nutrient is missing and does not treat it as zero', () => {
    const recipe = getRecipe('oatmeal-banana')
    const nutrition = computeRecipeNutrition(recipe, FOODS_BY_ID, 1)
    expect(nutrition.perServing.energyKcal.value).toBeGreaterThan(0)
    expect(nutrition.perServing.omega3AlaG.complete).toBe(false)
    expect(nutrition.perServing.omega3AlaG.value == null || nutrition.perServing.omega3AlaG.value >= 0).toBe(true)
    expect(nutrition.incomplete).toBe(true)
  })

  it('keeps calories per serving stable when servings change', () => {
    const recipe = getRecipe('bissara')
    const one = computeRecipeNutrition(recipe, FOODS_BY_ID, recipe.servings)
    const doubled = computeRecipeNutrition(recipe, FOODS_BY_ID, recipe.servings * 2)
    expect(doubled.perServing.energyKcal.value).toBeCloseTo(one.perServing.energyKcal.value)
    expect(doubled.lines[0].amount).toBeCloseTo(one.lines[0].amount * 2)
  })
})
