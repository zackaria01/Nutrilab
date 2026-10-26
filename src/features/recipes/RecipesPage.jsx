import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { useAppState } from '../../app/AppState.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { RecipePhoto } from '../../components/ui/FoodImage.jsx'
import { FOODS_BY_ID } from '../../data/foods.js'
import { MEAL_TYPES, RECIPES } from '../../data/recipes.js'
import { computeRecipeNutrition } from '../../lib/nutrition/aggregate.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'
import { formatNumber, tx } from '../../lib/text.js'

const ALLERGENS = ['milk', 'egg', 'fish', 'peanut', 'tree-nut', 'gluten', 'sesame']

function nutritionFor(recipe) {
  return computeRecipeNutrition(recipe, FOODS_BY_ID)
}

export function RecipesPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { profile } = useAppState()
  const [params, setParams] = useSearchParams()
  const meal = params.get('meal') || 'breakfast'
  const [quick, setQuick] = useState(false)
  const [protein, setProtein] = useState(false)
  const [vegetarian, setVegetarian] = useState(profile.restrictions?.includes('vegetarian') || false)
  const [excluded, setExcluded] = useState(() => (profile.restrictions || []).filter((item) => ALLERGENS.includes(item)))
  const [calorie, setCalorie] = useState('any')

  const cards = useMemo(() => {
    return RECIPES.filter((recipe) => recipe.meal === meal)
      .map((recipe) => ({ recipe, nutrition: nutritionFor(recipe) }))
      .filter(({ recipe, nutrition }) => {
        if (quick && recipe.minutes >= 20) return false
        if (vegetarian && !recipe.vegetarian) return false
        if (excluded.some((item) => recipe.allergens.includes(item))) return false
        const proteinValue = nutrition?.perServing.proteinG
        if (protein && !(proteinValue?.complete && proteinValue.value >= 15)) return false
        const kcal = nutrition?.perServing.energyKcal
        if (calorie !== 'any') {
          if (!kcal?.complete || kcal.value == null) return false
          if (calorie === 'under300' && kcal.value >= 300) return false
          if (calorie === '300to600' && (kcal.value < 300 || kcal.value > 600)) return false
          if (calorie === 'over600' && kcal.value <= 600) return false
        }
        return true
      })
  }, [meal, quick, protein, vegetarian, excluded, calorie])

  function chooseMeal(next) {
    const nextParams = new URLSearchParams(params)
    nextParams.set('meal', next)
    setParams(nextParams)
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-ink">{t('recipes.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('recipes.intro')}</p>
      </header>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('recipes.meals')}>
        {MEAL_TYPES.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={meal === item}
            className={`min-h-11 rounded-full px-4 font-semibold ${meal === item ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}
            onClick={() => chooseMeal(item)}
          >
            {t(`meals.${item}`)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip pressed={quick} onClick={() => setQuick((value) => !value)}>{t('recipes.quick')}</FilterChip>
        <FilterChip pressed={protein} onClick={() => setProtein((value) => !value)}>{t('recipes.protein')}</FilterChip>
        <FilterChip pressed={vegetarian} onClick={() => setVegetarian((value) => !value)}>{t('restrictions.vegetarian')}</FilterChip>
        {ALLERGENS.map((item) => (
          <FilterChip
            key={item}
            pressed={excluded.includes(item)}
            onClick={() => setExcluded((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]))}
          >
            {t('recipes.exclude', { name: t(`restrictions.${item}`) })}
          </FilterChip>
        ))}
        <label className="min-h-11 rounded-full bg-white px-3 text-sm ring-1 ring-line">
          <span className="sr-only">{t('recipes.calories')}</span>
          <select className="min-h-11 bg-transparent" value={calorie} onChange={(event) => setCalorie(event.target.value)}>
            <option value="any">{t('recipes.calorieAny')}</option>
            <option value="under300">{t('recipes.under300')}</option>
            <option value="300to600">{t('recipes.mid')}</option>
            <option value="over600">{t('recipes.over600')}</option>
          </select>
        </label>
        <button
          type="button"
          className="min-h-11 rounded-full px-3 text-sm underline"
          onClick={() => {
            setQuick(false)
            setProtein(false)
            setVegetarian(false)
            setExcluded([])
            setCalorie('any')
          }}
        >
          {t('recipes.clearFilters')}
        </button>
      </div>
      {cards.length === 0 ? <EmptyState title={t('recipes.empty')} body={t('recipes.intro')} /> : null}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ recipe, nutrition }) => {
          const kcal = nutrition?.perServing.energyKcal
          const protein = nutrition?.perServing.proteinG
          return (
            <article key={recipe.id} className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line transition duration-200 hover:-translate-y-0.5">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-mist">
                <RecipePhoto recipe={recipe} alt={tx(recipe.title, lang)} />
                <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                  {t(`meals.${recipe.meal}`)}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h2 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-ink">{tx(recipe.title, lang)}</h2>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" size={15} />
                    <bdi dir="ltr">{recipe.minutes} min</bdi>
                  </span>
                  <span>{t(`recipes.difficulty.${recipe.difficulty}`)}</span>
                </p>
                <p className="text-sm">
                  <bdi dir="ltr" className="font-semibold">
                    {kcal?.value == null ? t('common.notReported') : `${formatNumber(roundForDisplay('energyKcal', kcal.value), lang, 0)} kcal`}
                  </bdi>
                  <span className="text-muted"> · {t('recipes.perServing')}</span>
                  {!kcal?.complete ? <span className="text-muted"> · {t('recipes.incomplete')}</span> : null}
                </p>
                <p className="text-sm font-semibold text-ink">
                  <bdi dir="ltr">
                    {protein?.value == null
                      ? t('common.notReported')
                      : t('recipes.proteinAmount', { amount: formatNumber(roundForDisplay('proteinG', protein.value), lang, 1) })}
                  </bdi>
                </p>
                <Link to={`/recipes/${recipe.id}`} className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
                  {t('recipes.view')}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function FilterChip({ pressed, onClick, children }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={`min-h-11 rounded-full px-3 text-sm ${pressed ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}>
      {children}
    </button>
  )
}
