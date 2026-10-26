import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { RecipePhoto } from '../../components/ui/FoodImage.jsx'
import { NUTRIENT_TONES, NutrientMark } from '../../components/ui/NutrientMark.jsx'
import { MacroBar } from '../../components/nutrition/MacroBar.jsx'
import { FOODS, FOODS_BY_ID } from '../../data/foods.js'
import { NUTRIENTS } from '../../data/nutrients.js'
import { MEAL_TYPES, RECIPES } from '../../data/recipes.js'
import { tipForDate } from '../../data/tips.js'
import { bmiCategory, calculateBmi, roundBmi } from '../../lib/nutrition/bmi.js'
import { computeRecipeNutrition, sumDiarySnapshots } from '../../lib/nutrition/aggregate.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'
import { todayISO } from '../../lib/storage.js'
import { formatNumber, tx } from '../../lib/text.js'

const FOCUS = ['protein', 'fiber', 'magnesium', 'vitamin-b12', 'omega-3']

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { profile, diary } = useAppState()
  const today = todayISO()
  const entries = diary.entries.filter((entry) => entry.date === today)
  const totals = sumDiarySnapshots(entries)
  const bmi = calculateBmi(profile.weightKg, profile.heightCm)
  const category = bmiCategory(bmi, profile.age)
  const tip = tipForDate()
  const goal = profile.goals?.[0]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">{t('dashboard.greeting')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('dashboard.intro')}</p>
      </header>
      {!profile.completed ? (
        <Link to="/onboarding" className="block rounded-[28px] bg-ink px-5 py-4 font-semibold text-white">
          {t('dashboard.finishSetup')}
        </Link>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[28px] bg-white p-5 ring-1 ring-line lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">{t('dashboard.basics')}</h2>
            <Link to="/onboarding" className="min-h-11 rounded-full px-3 py-2 text-sm font-semibold ring-1 ring-line">
              {t('common.edit')}
            </Link>
          </div>
          {profile.completed ? (
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted">{t('onboarding.age')}</dt>
                <dd className="text-lg font-semibold"><bdi dir="ltr">{profile.age}</bdi></dd>
              </div>
              <div>
                <dt className="text-muted">{t('onboarding.height')}</dt>
                <dd className="text-lg font-semibold"><bdi dir="ltr">{profile.heightCm} cm</bdi></dd>
              </div>
              <div>
                <dt className="text-muted">{t('onboarding.weight')}</dt>
                <dd className="text-lg font-semibold"><bdi dir="ltr">{profile.weightKg} kg</bdi></dd>
              </div>
              <div>
                <dt className="text-muted">{t('bmi.label')}</dt>
                <dd className="text-lg font-semibold">
                  {category === 'not-adult' || bmi == null ? t('bmi.notAdultShort') : <bdi dir="ltr">{formatNumber(roundBmi(bmi), lang, 1)}</bdi>}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-muted">{t('dashboard.noProfile')}</p>
          )}
          {category && category !== 'not-adult' ? <p className="mt-3 text-sm text-muted">{t(`bmi.categories.${category}`)}. {t('bmi.limit')}</p> : null}
        </article>
        <article className="rounded-[28px] bg-mist p-5">
          <h2 className="text-xl font-bold text-ink">{t('dashboard.focus')}</h2>
          <p className="mt-2">{goal ? t(`goals.${goal}`) : t('dashboard.focusEmpty')}</p>
          <p className="mt-2 text-sm text-muted">{goal ? t(`goalHelp.${goal}`) : t('dashboard.focusHelp')}</p>
        </article>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-ink">{t('dashboard.today')}</h2>
          <Link to="/diary" className="text-sm font-semibold text-ink underline">{t('dashboard.openDiary')}</Link>
        </div>
        {entries.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={t('dashboard.emptyLog')} action={t('dashboard.search')} to="/foods" />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <MacroBar nutrients={Object.fromEntries(Object.entries(totals).map(([key, entry]) => [key, entry.value]))} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['energyKcal', 'proteinG', 'carbohydrateG', 'fatG'].map((key) => (
              <div key={key} className="rounded-2xl bg-mist p-3">
                <p className="text-sm text-muted">{t(`nutrientNames.${key}`)}</p>
                <p className="text-xl font-bold">
                  <bdi dir="ltr">
                    {totals[key].value == null ? t('common.notReported') : formatNumber(roundForDisplay(key, totals[key].value), lang, key === 'energyKcal' ? 0 : 1)}
                  </bdi>
                </p>
                {!totals[key].complete ? <p className="text-xs text-muted">{t('diary.incomplete')}</p> : null}
              </div>
            ))}
          </div>
          </div>
        )}
        {profile.energyEstimate?.accepted ? (
          <p className="mt-3 text-sm text-muted">
            {t('dashboard.estimate', { kcal: Math.round(profile.energyEstimate.estimatedKcal) })}
          </p>
        ) : null}
      </section>
      <section>
        <h2 className="text-xl font-bold text-ink">{t('dashboard.search')}</h2>
        <Link to="/foods" className="mt-3 flex min-h-14 items-center rounded-full bg-white px-5 text-muted ring-1 ring-line">
          {t('foods.placeholder')}
        </Link>
      </section>
      <section>
        <h2 className="text-xl font-bold text-ink">{t('dashboard.meals')}</h2>
        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {MEAL_TYPES.map((meal) => {
            const recipe = RECIPES.find((item) => item.meal === meal)
            const nutrition = computeRecipeNutrition(recipe, FOODS_BY_ID)
            const kcal = nutrition?.perServing.energyKcal
            return (
              <Link key={meal} to={`/recipes/${recipe.id}`} className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line transition duration-200 hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-mist">
                  <RecipePhoto recipe={recipe} alt={tx(recipe.title, lang)} />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-leaf">{t(`meals.${meal}`)}</p>
                  <h3 className="mt-1 line-clamp-2 min-h-12 font-bold leading-6 text-ink">{tx(recipe.title, lang)}</h3>
                  <p className="mt-2 text-sm">
                    <bdi dir="ltr">
                      {kcal?.value == null ? t('common.notReported') : `${formatNumber(roundForDisplay('energyKcal', kcal.value), lang, 0)} kcal`}
                    </bdi>
                    <span className="text-muted"> · {t('recipes.perServing')}</span>
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-ink">{t('dashboard.nutrients')}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FOCUS.map((slug) => {
            const nutrient = NUTRIENTS.find((item) => item.slug === slug)
            return (
              <Link key={slug} to={`/nutrients/${slug}`} className={`rounded-[24px] bg-gradient-to-br ${NUTRIENT_TONES[slug] || 'from-white to-mist'} p-4 ring-1 ring-line`}>
                <NutrientMark slug={slug} className="size-11" />
                <h3 className="mt-3 font-bold text-ink">{tx(nutrient.name, lang)}</h3>
                <p className="mt-1 text-sm text-muted">{tx(nutrient.summary, lang)}</p>
              </Link>
            )
          })}
        </div>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="text-xl font-bold text-ink">{t('dashboard.learn')}</h2>
        <p className="mt-2 leading-7">{tx(tip.text, lang)}</p>
        <a className="mt-2 inline-block text-sm font-semibold text-ink underline" href={tip.sourceUrl}>
          {tip.source}
        </a>
      </section>
      <p className="text-xs text-muted">{t('common.catalogCount', { count: FOODS.length })}</p>
    </div>
  )
}
