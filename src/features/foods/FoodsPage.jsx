import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FoodPhoto, RecipePhoto } from '../../components/ui/FoodImage.jsx'
import { MacroHints } from '../../components/nutrition/MacroHints.jsx'
import { FOODS } from '../../data/foods.js'
import { RECIPES } from '../../data/recipes.js'
import { searchFoods } from '../../lib/search/normalize.js'
import { searchRecipes } from '../../lib/search/recipes.js'
import { formatNumber, tx } from '../../lib/text.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'

const EXAMPLES = ['banana', 'banane', 'موز', 'œuf', 'بيض', 'harira', 'حريرة']

export function FoodsPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [remote, setRemote] = useState(null)
  const [remoteState, setRemoteState] = useState('idle')

  const categories = useMemo(() => ['all', ...new Set(FOODS.map((food) => food.category))], [])
  const foods = useMemo(() => {
    const found = searchFoods(FOODS, query)
    return category === 'all' ? found : found.filter((food) => food.category === category)
  }, [query, category])
  const recipes = useMemo(() => (query.trim() ? searchRecipes(RECIPES, query) : []), [query])

  async function runRemote(event) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setRemoteState('loading')
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
      const data = await response.json()
      setRemote(data)
      setRemoteState(response.ok ? 'ready' : 'error')
    } catch {
      setRemoteState('error')
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-ink">{t('foods.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('foods.intro')}</p>
      </header>
      <form onSubmit={runRemote} className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="food-search">{t('foods.title')}</label>
        <input
          id="food-search"
          dir="auto"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('foods.placeholder')}
          className="min-h-12 flex-1 rounded-full border border-line bg-white px-4"
        />
        <button type="submit" className="min-h-12 rounded-full bg-ink px-5 font-semibold text-white">
          {t('foods.remote')}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="min-h-11 rounded-full bg-white px-3 text-sm ring-1 ring-line" onClick={() => setQuery(example)}>
            <bdi>{example}</bdi>
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            className={`min-h-11 shrink-0 rounded-full px-3 text-sm ${category === item ? 'bg-ink text-white' : 'bg-white ring-1 ring-line'}`}
            onClick={() => setCategory(item)}
          >
            {t(`categories.${item}`)}
          </button>
        ))}
      </div>
      {foods.length === 0 ? <EmptyState title={t('foods.empty')} body={t('foods.intro')} /> : null}
      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {foods.map((food) => (
          <article key={food.id} className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line transition duration-200 hover:-translate-y-0.5">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-mist">
              <FoodPhoto food={food} alt={tx(food.names, lang)} />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{t(`kinds.${food.kind}`)}</p>
                <h2 className="mt-1 line-clamp-2 min-h-14 text-lg font-bold leading-7 text-ink">{tx(food.names, lang)}</h2>
                <p className="mt-1 text-sm">
                  <bdi dir="ltr" className="font-semibold">
                    {food.nutrientsPerReference.energyKcal == null
                      ? t('common.notReported')
                      : `${formatNumber(roundForDisplay('energyKcal', food.nutrientsPerReference.energyKcal), lang, 0)} kcal`}
                  </bdi>
                  <span className="text-muted"> · {t('foods.per100g')}</span>
                </p>
              </div>
              <MacroHints nutrients={food.nutrientsPerReference} />
              <Link to={`/foods/${encodeURIComponent(food.id)}`} className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
                {t('common.seeDetails')}
              </Link>
            </div>
          </article>
        ))}
      </div>
      {recipes.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold text-ink">{t('foods.recipes')}</h2>
          <ul className="mt-3 space-y-2">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recipes/${recipe.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-line">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <RecipePhoto recipe={recipe} alt={tx(recipe.title, lang)} />
                  </span>
                  <span className="font-semibold">{tx(recipe.title, lang)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="rounded-[28px] bg-mist p-4 text-sm leading-6">
        {remoteState === 'idle' ? <p>{t('foods.remoteHint')}</p> : null}
        {remoteState === 'loading' ? <p>{t('common.loading')}</p> : null}
        {remoteState === 'error' ? (
          <p>
            {t('foods.remoteError')}{' '}
            <button type="button" className="font-semibold underline" onClick={runRemote}>{t('common.retry')}</button>
          </p>
        ) : null}
        {remoteState === 'ready' && remote ? (
          <div className="space-y-3">
            {remote.errors?.length ? (
              <p>{remote.errors.map((error) => t(`foods.remoteErrors.${error}`, { defaultValue: t('foods.remoteError') })).join(' ')}</p>
            ) : null}
            {(remote.usda?.length || 0) + (remote.off?.length || 0) === 0 ? <p>{t('foods.remoteEmpty')}</p> : null}
            {[...(remote.usda || []), ...(remote.off || [])].map((food) => (
              <Link key={food.id} to={`/foods/${encodeURIComponent(food.id)}`} state={{ food }} className="flex items-center gap-3 rounded-2xl bg-white p-2">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <FoodPhoto food={food} alt={tx(food.names, lang) || food.originalName || ''} />
                </span>
                <span>
                  <span className="font-semibold">{tx(food.names, lang) || food.originalName}</span>
                  <span className="mt-1 block text-sm text-muted">{food.sourceName}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
