/**
 * Unicode-safe search normalization.
 * French accents, œ, and Arabic diacritics/alef variants fold to a shared form
 * so a query can match any language alias regardless of the UI locale.
 */

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g

export function normalizeText(value) {
  if (value == null) return ''
  return String(value)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(left, right) {
  if (Math.abs(left.length - right.length) > 1) return 2
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index])
  for (let column = 1; column <= right.length; column += 1) rows[0][column] = column
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
    }
  }
  return rows[left.length][right.length]
}

function searchableStrings(food) {
  return [food.names?.en, food.names?.fr, food.names?.ar, ...(food.aliases || [])]
    .filter(Boolean)
    .map((name) => normalizeText(name))
}

export function scoreFood(food, rawQuery) {
  const query = normalizeText(rawQuery)
  if (!query) return 0
  const names = searchableStrings(food)
  if (names.some((name) => name === query)) return 100
  if (names.some((name) => name.startsWith(query) || name.includes(query))) return 80
  const tokens = query.split(' ').filter(Boolean)
  if (tokens.length > 1 && tokens.every((token) => names.some((name) => name.includes(token)))) {
    return 70
  }
  if (query.length >= 4 && /^[a-z0-9 ]+$/.test(query)) {
    const close = names.some((name) => {
      const head = name.split(' ')[0]
      return levenshtein(query, head) <= 1 || levenshtein(query, name) <= 1
    })
    if (close) return 50
  }
  return 0
}

export function searchFoods(foods, rawQuery) {
  const query = normalizeText(rawQuery)
  if (!query) return foods
  return foods
    .map((food) => ({ food, score: scoreFood(food, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.food.names.en.localeCompare(b.food.names.en))
    .map((entry) => entry.food)
}
