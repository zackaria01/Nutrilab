import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FoodPhoto } from '../../components/ui/FoodImage.jsx'
import { NUTRIENT_TONES, NutrientMark } from '../../components/ui/NutrientMark.jsx'
import { FOODS } from '../../data/foods.js'
import { NUTRIENTS_BY_SLUG } from '../../data/nutrients.js'
import { foodsWithUnspecified18_3, rankFoodsForNutrient } from '../../lib/nutrition/rank.js'
import { NUTRIENT_UNITS, roundForDisplay } from '../../lib/nutrition/units.js'
import { formatNumber, tx } from '../../lib/text.js'

export function NutrientDetailPage() {
  const { slug } = useParams()
  const nutrient = NUTRIENTS_BY_SLUG[slug]
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  if (!nutrient) {
    return <EmptyState title={t('nutrients.missing')} action={t('common.back')} to="/nutrients" />
  }
  const ranked = rankFoodsForNutrient(FOODS, nutrient)
  const unspecified = nutrient.slug === 'omega-3' ? foodsWithUnspecified18_3(FOODS) : []

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <header className={`overflow-hidden rounded-[28px] bg-gradient-to-br ${NUTRIENT_TONES[nutrient.slug] || 'from-mist to-white'} p-6 ring-1 ring-line`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-leaf"><bdi dir="ltr">{nutrient.unit}</bdi></p>
            <h1 className="mt-1 text-3xl font-bold text-ink">{tx(nutrient.name, lang)}</h1>
          </div>
          <NutrientMark slug={nutrient.slug} className="size-14" />
        </div>
        <p className="mt-4 text-lg leading-8">{tx(nutrient.about, lang)}</p>
      </header>
      <p className="text-sm text-muted">{t('nutrients.needsVary')}</p>
      <a className="inline-block text-sm font-semibold underline" href={nutrient.sourceUrl}>{t('nutrients.source')}</a>
      <h2 className="text-xl font-bold text-ink">{t('nutrients.commonFoods')}</h2>
      {ranked.length < 5 ? <p className="text-sm text-muted">{t('nutrients.few', { count: ranked.length })}</p> : null}
      <ul className="space-y-3">
        {ranked.map((row) => (
          <li key={row.food.id}>
            <Link to={`/foods/${encodeURIComponent(row.food.id)}`} className="flex gap-4 rounded-[24px] bg-white p-3 shadow-[0_8px_24px_rgba(23,62,53,0.05)] ring-1 ring-line">
              <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-mist">
                <FoodPhoto food={row.food} alt={tx(row.food.names, lang)} />
              </span>
              <span className="min-w-0">
              <span className="font-bold text-ink">{tx(row.food.names, lang)}</span>
              <span className="mt-1 block text-sm">
                {row.parts.map((part) => (
                  <bdi key={part.key} dir="ltr" className="me-3">
                    {t(`nutrientNames.${part.key}`)} {formatNumber(roundForDisplay(part.key, part.value), lang, 2)} {NUTRIENT_UNITS[part.key]} / 100 g
                  </bdi>
                ))}
              </span>
              <span className="mt-1 block text-sm text-muted">
                <bdi dir="ltr">
                  {formatNumber(roundForDisplay('energyKcal', row.food.nutrientsPerReference.energyKcal), lang, 0)} kcal / 100 g
                </bdi>
              </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {unspecified.length > 0 ? (
        <section className="rounded-[24px] bg-mist p-4">
          <h2 className="font-bold">{t('nutrients.unspecifiedTitle')}</h2>
          <p className="mt-2 text-sm leading-6">{t('nutrients.unspecifiedBody')}</p>
          <ul className="mt-3 space-y-2">
            {unspecified.map((row) => (
              <li key={row.food.id}>
                <Link to={`/foods/${encodeURIComponent(row.food.id)}`} className="underline">
                  {tx(row.food.names, lang)}
                </Link>
                <bdi dir="ltr" className="ms-2 text-sm">
                  {formatNumber(roundForDisplay('pufa183UnspecifiedG', row.value), lang, 2)} g / 100 g
                </bdi>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
