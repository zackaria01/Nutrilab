import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../lib/text.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'

const PARTS = [
  { key: 'proteinG', label: 'macros.protein', cap: 25, bar: 'bg-leaf' },
  { key: 'carbohydrateG', label: 'macros.carbs', cap: 40, bar: 'bg-apricot' },
  { key: 'fatG', label: 'macros.fat', cap: 20, bar: 'bg-ink' },
]

export function MacroHints({ nutrients }) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  return (
    <ul className="grid grid-cols-3 gap-2">
      {PARTS.map((part) => {
        const grams = nutrients?.[part.key]
        const width = grams == null ? 0 : Math.max(8, Math.min(100, (grams / part.cap) * 100))
        return (
          <li key={part.key}>
            <span className="block text-[11px] text-muted">{t(part.label)}</span>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden="true">
              {grams == null ? null : <span className={`block h-full rounded-full ${part.bar}`} style={{ width: `${width}%` }} />}
            </span>
            <bdi dir="ltr" className="mt-1 block text-xs font-semibold text-ink">
              {grams == null ? t('common.notReported') : `${formatNumber(roundForDisplay(part.key, grams), lang, 1)} g`}
            </bdi>
          </li>
        )
      })}
    </ul>
  )
}
