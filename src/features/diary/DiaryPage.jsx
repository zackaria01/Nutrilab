import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FoodPhoto, RecipePhoto } from '../../components/ui/FoodImage.jsx'
import { getFood } from '../../data/foods.js'
import { getRecipe } from '../../data/recipes.js'
import { sumDiarySnapshots } from '../../lib/nutrition/aggregate.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'
import { todayISO } from '../../lib/storage.js'
import { formatNumber, tx } from '../../lib/text.js'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack']

export function DiaryPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { diary, updateEntry, removeEntry, profile } = useAppState()
  const [date, setDate] = useState(todayISO())
  const entries = diary.entries.filter((entry) => entry.date === date)
  const totals = useMemo(() => sumDiarySnapshots(entries), [entries])

  function nameOf(entry) {
    if (entry.kind === 'recipe') return tx(getRecipe(entry.itemId)?.title, lang) || entry.itemId
    return tx(getFood(entry.itemId)?.names, lang) || entry.itemId
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">{t('diary.title')}</h1>
          <p className="mt-2 text-muted">{t('diary.intro')}</p>
        </div>
        <label className="text-sm font-semibold">
          {t('diary.date')}
          <input type="date" className="mt-1 block min-h-12 rounded-2xl border border-line bg-white px-3" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </header>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['energyKcal', 'proteinG', 'carbohydrateG', 'fatG'].map((key) => (
          <div key={key} className="rounded-[24px] bg-white p-4 ring-1 ring-line">
            <p className="text-sm text-muted">{t(`nutrientNames.${key}`)}</p>
            <p className="text-2xl font-bold">
              <bdi dir="ltr">
                {entries.length === 0 || totals[key].value == null
                  ? '—'
                  : formatNumber(roundForDisplay(key, totals[key].value), lang, key === 'energyKcal' ? 0 : 1)}
              </bdi>
            </p>
            {entries.length > 0 && !totals[key].complete ? <p className="text-xs text-muted">{t('diary.incomplete')}</p> : null}
          </div>
        ))}
      </section>
      {profile.energyEstimate?.accepted ? (
        <p className="rounded-3xl bg-mist p-4 text-sm leading-6">
          {t('diary.versusEstimate', { kcal: Math.round(profile.energyEstimate.estimatedKcal) })}
        </p>
      ) : null}
      {entries.length === 0 ? <EmptyState title={t('diary.empty')} action={t('diary.findFood')} to="/foods" /> : null}
      {MEALS.map((meal) => {
        const items = entries.filter((entry) => entry.meal === meal)
        if (items.length === 0) return null
        return (
          <section key={meal}>
            <h2 className="text-lg font-bold text-ink">{t(`meals.${meal}`)}</h2>
            <ul className="mt-2 space-y-2">
              {items.map((entry) => (
                <li key={entry.id} className="rounded-[24px] bg-white p-4 ring-1 ring-line">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-mist">
                        {entry.kind === 'recipe' ? (
                          <RecipePhoto recipe={entry.itemId} alt={nameOf(entry)} />
                        ) : (
                          <FoodPhoto food={getFood(entry.itemId)} alt={nameOf(entry)} />
                        )}
                      </span>
                      <div>
                      <p className="font-semibold">{nameOf(entry)}</p>
                      <p className="text-sm text-muted">
                        <bdi dir="ltr">
                          {entry.snapshot.energyKcal == null
                            ? t('common.notReported')
                            : `${formatNumber(roundForDisplay('energyKcal', entry.snapshot.energyKcal), lang, 0)} kcal`}
                        </bdi>
                      </p>
                      </div>
                    </div>
                    <button type="button" className="min-h-11 text-sm font-semibold text-red-800 underline" onClick={() => removeEntry(entry.id)}>
                      {t('common.delete')}
                    </button>
                  </div>
                  <label className="mt-2 block text-sm">
                    {entry.kind === 'recipe' ? t('recipes.servings') : t('foods.customGrams')}
                    <input
                      inputMode="decimal"
                      className="mt-1 min-h-11 w-32 rounded-xl border border-line px-3"
                      defaultValue={entry.amount}
                      key={`${entry.id}-${entry.amount}`}
                      onBlur={(event) => {
                        const next = Number(event.target.value)
                        if (next > 0 && next !== entry.amount) updateEntry(entry.id, next)
                      }}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
