import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../lib/text.js'

const PARTS = [
  { key: 'proteinG', label: 'nutrientNames.proteinG', kcal: 4, color: 'bg-leaf' },
  { key: 'carbohydrateG', label: 'nutrientNames.carbohydrateG', kcal: 4, color: 'bg-apricot' },
  { key: 'fatG', label: 'nutrientNames.fatG', kcal: 9, color: 'bg-ink' },
]

export function MacroBar({ nutrients }) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const known = PARTS.map((part) => {
    const grams = nutrients?.[part.key]
    return { ...part, grams, energy: grams == null ? null : grams * part.kcal }
  })
  const total = known.reduce((sum, part) => sum + (part.energy ?? 0), 0)
  const drawable = known.every((part) => part.energy != null) && total > 0

  return (
    <div className="space-y-3">
      {drawable ? (
        <div className="flex h-3 overflow-hidden rounded-full bg-mist" aria-hidden="true">
          {known.map((part) => (
            <div key={part.key} className={part.color} style={{ width: `${(part.energy / total) * 100}%` }} />
          ))}
        </div>
      ) : null}
      <ul className="grid grid-cols-3 gap-2 text-sm">
        {known.map((part) => (
          <li key={part.key} className="rounded-2xl bg-mist px-2 py-2 text-center">
            <span className="block text-muted">{t(part.label)}</span>
            <bdi dir="ltr" className="font-semibold text-ink">
              {part.grams == null ? t('common.notReported') : `${formatNumber(part.grams, lang, 1)} g`}
            </bdi>
          </li>
        ))}
      </ul>
    </div>
  )
}
