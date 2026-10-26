/**
 * Body mass index helpers.
 * BMI is a screening measure for adults 20+, not a diagnosis or a target weight.
 * Formula: weightKg / (heightMeters^2). CDC adult categories apply only at age >= 20.
 */

function isPositive(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function calculateBmi(weightKg, heightCm) {
  if (!isPositive(weightKg) || !isPositive(heightCm)) return null
  const heightMeters = heightCm / 100
  return weightKg / (heightMeters * heightMeters)
}

/** One decimal for display. Intermediate math should keep the raw BMI. */
export function roundBmi(bmi) {
  if (bmi == null || !Number.isFinite(bmi)) return null
  return Math.round(bmi * 10) / 10
}

/**
 * Adult screening category. Returns "not-adult" under age 20 so callers
 * never apply adult thresholds to children or teens.
 */
export function bmiCategory(bmi, ageYears) {
  if (typeof ageYears !== 'number' || !Number.isFinite(ageYears) || ageYears < 20) {
    return 'not-adult'
  }
  if (bmi == null || !Number.isFinite(bmi)) return null
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'healthy'
  if (bmi < 30) return 'overweight'
  return 'obesity'
}

export function feetInchesToCm(feet, inches) {
  const ft = Number(feet) || 0
  const inch = Number(inches) || 0
  if (ft < 0 || inch < 0) return null
  const totalInches = ft * 12 + inch
  if (totalInches <= 0) return null
  return totalInches * 2.54
}

export function poundsToKg(pounds) {
  const value = Number(pounds)
  if (!Number.isFinite(value) || value <= 0) return null
  return value * 0.45359237
}
