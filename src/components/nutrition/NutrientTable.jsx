import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../lib/text.js'
import { NUTRIENT_UNITS, roundForDisplay } from '../../lib/nutrition/units.js'

const GROUPS = [
  {
    title: 'foodDetail.macros',
    keys: ['energyKcal', 'proteinG', 'carbohydrateG', 'fatG', 'saturatedFatG', 'fiberG', 'sugarsG'],
  },
  {
    title: 'foodDetail.minerals',
    keys: ['magnesiumMg', 'calciumMg', 'ironMg', 'potassiumMg', 'zincMg', 'sodiumMg'],
  },
  {
    title: 'foodDetail.vitamins',
    keys: ['vitaminCMg', 'vitaminDUg', 'folateUg', 'b12Ug', 'vitaminAUg', 'vitaminB6Mg'],
  },
  {
    title: 'foodDetail.fatsOfInterest',
    keys: ['omega3AlaG', 'omega3EpaG', 'omega3DhaG', 'pufa183UnspecifiedG'],
  },
]

export function NutrientTable({ nutrients }) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)

  return (
    <div className="space-y-5">
      {GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{t(group.title)}</h3>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {group.keys.map((key) => {
              const value = nutrients?.[key]
              const rounded = roundForDisplay(key, value)
              const digits = key === 'energyKcal'
                ? 0
                : key.endsWith('Ug') || key === 'vitaminB6Mg' || key === 'ironMg' || key === 'zincMg'
                  ? 2
                  : 1
              return (
                <li key={key} className="flex items-center justify-between gap-3 px-3 py-3 text-sm">
                  <span>{t(`nutrientNames.${key}`)}</span>
                  <bdi dir="ltr" className="font-semibold text-ink">
                    {rounded == null
                      ? t('common.notReported')
                      : `${formatNumber(rounded, lang, digits)} ${NUTRIENT_UNITS[key]}`}
                  </bdi>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
