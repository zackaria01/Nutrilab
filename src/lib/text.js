export function tx(value, language) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  const lang = String(language || 'en').slice(0, 2)
  return value[lang] || value.en || ''
}

export function formatNumber(value, language, digits = 1) {
  if (value == null || !Number.isFinite(value)) return ''
  const locale = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'
  return new Intl.NumberFormat(locale, {
    numberingSystem: 'latn',
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)
}
