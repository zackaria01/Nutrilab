import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FoodPhoto } from '../../components/ui/FoodImage.jsx'
import { NUTRIENT_TONES, NutrientMark } from '../../components/ui/NutrientMark.jsx'
import { FOODS } from '../../data/foods.js'
import { NUTRIENTS } from '../../data/nutrients.js'
import { rankFoodsForNutrient } from '../../lib/nutrition/rank.js'
import { tx } from '../../lib/text.js'

export function NutrientsPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">{t('nutrients.title')}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t('nutrients.intro')}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {NUTRIENTS.map((nutrient) => {
          const foods = rankFoodsForNutrient(FOODS, nutrient).slice(0, 3)
          return (
            <article key={nutrient.slug} className={`overflow-hidden rounded-[28px] bg-gradient-to-br ${NUTRIENT_TONES[nutrient.slug] || 'from-mist to-white'} shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line`}>
              <div className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-leaf"><bdi dir="ltr">{nutrient.unit}</bdi></p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{tx(nutrient.name, lang)}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{tx(nutrient.summary, lang)}</p>
                </div>
                <NutrientMark slug={nutrient.slug} />
              </div>
              {foods.length > 0 ? (
                <div className="flex gap-2 px-5" aria-hidden="true">
                  {foods.map((row) => (
                    <span key={row.food.id} className="relative size-14 overflow-hidden rounded-2xl bg-white ring-1 ring-white">
                      <FoodPhoto food={row.food} alt="" />
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="p-5">
                <Link to={`/nutrients/${nutrient.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
                  {t('nutrients.rich')}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
