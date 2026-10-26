/**
 * Optional rough daily energy estimate using Mifflin–St Jeor.
 * The sex parameter is an equation input, not gender identity.
 * Not offered for people under 20. Never derived from BMI alone.
 */

export const ACTIVITY_FACTORS = {
  sitting: 1.2,
  some: 1.375,
  regular: 1.55,
  very: 1.725,
}

export function mifflinStJeor({ weightKg, heightCm, ageYears, sexParameter, activity }) {
  if (typeof ageYears !== 'number' || ageYears < 20) return null
  if (sexParameter !== 'male' && sexParameter !== 'female') return null
  if (![weightKg, heightCm].every((value) => typeof value === 'number' && value > 0)) return null
  const activityFactor = ACTIVITY_FACTORS[activity]
  if (!activityFactor) return null

  const constant = sexParameter === 'male' ? 5 : -161
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + constant
  return {
    equation: 'mifflin-st-jeor',
    bmr,
    activityFactor,
    estimatedKcal: bmr * activityFactor,
    sexParameter,
    activity,
  }
}
