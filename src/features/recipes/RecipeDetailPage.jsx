import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FoodPhoto, PhotoCredit, RecipePhoto, creditForRecipe } from '../../components/ui/FoodImage.jsx'
import { MacroBar } from '../../components/nutrition/MacroBar.jsx'
import { FOODS_BY_ID } from '../../data/foods.js'
import { getRecipe } from '../../data/recipes.js'
import { computeRecipeNutrition } from '../../lib/nutrition/aggregate.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'
import { todayISO } from '../../lib/storage.js'
import { formatNumber, tx } from '../../lib/text.js'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack']

export function RecipeDetailPage() {
  const { id } = useParams()
  const recipe = getRecipe(id)
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { addRecipe } = useAppState()
  const [servings, setServings] = useState(recipe?.servings || 1)
  const [meal, setMeal] = useState(recipe?.meal || 'breakfast')

  const nutrition = useMemo(
    () => (recipe ? computeRecipeNutrition(recipe, FOODS_BY_ID, servings) : null),
    [recipe, servings],
  )

  if (!recipe || !nutrition) {
    return <EmptyState title={t('recipes.missing')} action={t('common.back')} to="/recipes" />
  }

  const perServing = Object.fromEntries(
    Object.entries(nutrition.perServing).map(([key, entry]) => [key, entry.value]),
  )
  const kcal = nutrition.perServing.energyKcal

  return (
    <article className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
            <RecipePhoto recipe={recipe} alt={tx(recipe.title, lang)} eager />
          </div>
          <div className="space-y-3 p-5">
            <p className="text-xs font-semibold uppercase text-leaf">{t(`meals.${recipe.meal}`)}</p>
            <h1 className="text-3xl font-bold text-ink">{tx(recipe.title, lang)}</h1>
            <p>{tx(recipe.summary, lang)}</p>
            <p className="text-4xl font-bold">
              <bdi dir="ltr">{kcal?.value == null ? t('common.notReported') : `${formatNumber(roundForDisplay('energyKcal', kcal.value), lang, 0)} kcal`}</bdi>
            </p>
            <p className="text-sm text-muted">{t('recipes.perServing')} · {kcal?.complete ? t('recipes.completeEnergy') : t('recipes.incomplete')}</p>
            <PhotoCredit credit={creditForRecipe(recipe)} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold">{t('recipes.servings')}</h2>
          <div className="mt-3 flex items-center gap-3">
            <button type="button" className="size-11 rounded-full bg-mist text-xl" onClick={() => setServings((value) => Math.max(1, value - 1))} aria-label={t('recipes.less')}>−</button>
            <bdi dir="ltr" className="text-2xl font-bold">{servings}</bdi>
            <button type="button" className="size-11 rounded-full bg-mist text-xl" onClick={() => setServings((value) => value + 1)} aria-label={t('recipes.more')}>+</button>
          </div>
          <p className="mt-2 text-sm text-muted">{t('recipes.scaleNote')}</p>
          <div className="mt-4">
            <MacroBar nutrients={perServing} />
          </div>
        </section>
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold">{t('recipes.ingredients')}</h2>
          <ul className="mt-3 space-y-2">
            {nutrition.lines.map((line) => (
              <li key={line.foodId} className="flex items-center justify-between gap-3 text-sm">
                <Link to={`/foods/${encodeURIComponent(line.foodId)}`} className="flex min-w-0 items-center gap-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <FoodPhoto food={line.food} alt="" />
                  </span>
                  <span className="font-semibold text-ink">{tx(line.food.names, lang)}</span>
                </Link>
                <span className="text-end">
                  <bdi dir="ltr">{formatNumber(line.amount, lang, 1)} g</bdi>
                  {line.household && servings === recipe.servings ? <span className="block text-muted">{tx(line.household, lang)}</span> : null}
                </span>
              </li>
            ))}
          </ul>
          {recipe.allergens.length > 0 ? (
            <p className="mt-3 text-sm text-muted">
              {t('recipes.allergens', { list: recipe.allergens.map((item) => t(`restrictions.${item}`)).join(', ') })}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-muted">{t('recipes.allergenLimit')}</p>
          <p className="mt-2 text-sm text-muted">{t('recipes.estimate')}</p>
        </section>
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold">{t('recipes.steps')}</h2>
          <ol className="mt-3 list-decimal space-y-2 ps-5">
            {recipe.steps.map((item) => (
              <li key={item.en}>{tx(item, lang)}</li>
            ))}
          </ol>
        </section>
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold">{t('foods.addMeal')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {MEALS.map((item) => (
              <button key={item} type="button" aria-pressed={meal === item} className={`min-h-11 rounded-full px-3 ${meal === item ? 'bg-ink text-white' : 'ring-1 ring-line'}`} onClick={() => setMeal(item)}>
                {t(`meals.${item}`)}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 min-h-12 rounded-full bg-leaf px-5 font-semibold text-white"
            onClick={() => addRecipe({ recipe, nutrition: computeRecipeNutrition(recipe, FOODS_BY_ID, 1), meal, date: todayISO(), servings })}
          >
            {t('recipes.add')}
          </button>
        </section>
      </div>
    </article>
  )
}
