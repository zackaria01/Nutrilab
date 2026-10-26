import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { FoodPhoto, PhotoCredit, creditForFood } from '../../components/ui/FoodImage.jsx'
import { MacroBar } from '../../components/nutrition/MacroBar.jsx'
import { NutrientTable } from '../../components/nutrition/NutrientTable.jsx'
import { getFood } from '../../data/foods.js'
import { scaleNutrients } from '../../lib/nutrition/portions.js'
import { todayISO } from '../../lib/storage.js'
import { formatNumber, tx } from '../../lib/text.js'
import { roundForDisplay } from '../../lib/nutrition/units.js'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack']

export function FoodDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const decoded = decodeURIComponent(id || '')
  const local = getFood(decoded)
  const food = local || location.state?.food || null
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { addFood } = useAppState()
  const [amount, setAmount] = useState(100)
  const [custom, setCustom] = useState('100')
  const [remoteFood, setRemoteFood] = useState(null)
  const [status, setStatus] = useState(food ? 'ready' : 'loading')

  const current = food || remoteFood

  useEffect(() => {
    if (food) return undefined
    if (!decoded.includes(':')) {
      setStatus('missing')
      return undefined
    }
    const [source, sourceId] = decoded.split(':')
    if (!source || !sourceId) {
      setStatus('missing')
      return undefined
    }
    let cancelled = false
    fetch(`/api/food?source=${encodeURIComponent(source)}&id=${encodeURIComponent(sourceId)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) {
          setRemoteFood(data.food)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('missing')
      })
    return () => {
      cancelled = true
    }
  }, [decoded, food])

  if (!current && status === 'loading') return <p>{t('common.loading')}</p>
  if (!current) {
    return <EmptyState title={t('foods.missing')} action={t('common.back')} to="/foods" />
  }

  const scaled = scaleNutrients(current.nutrientsPerReference, Number(amount) || 0, current.referenceAmount)
  const nutrients = scaled?.nutrients
  const choices = [
    { amount: 50, label: t('portions.g50') },
    { amount: 100, label: t('portions.g100') },
    { amount: 150, label: t('portions.g150') },
    ...(current.servings || []).map((serving) => ({ amount: serving.amount, label: tx(serving.label, lang) })),
  ]

  return (
    <article className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
          <FoodPhoto food={current} alt={tx(current.names, lang) || current.originalName || ''} eager />
        </div>
        <div className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase text-leaf">{t(`categories.${current.category || 'other'}`)}</p>
          <h1 className="text-3xl font-bold text-ink">{tx(current.names, lang) || current.originalName}</h1>
          {current.names?.[lang] ? null : <p className="text-sm text-muted">{t('foods.untranslated')}</p>}
          <p>{tx(current.description, lang)}</p>
          <p className="text-sm text-muted">{current.preparation ? t('foods.preparation', { value: current.preparation }) : null}</p>
          <p className="text-4xl font-bold text-ink">
            <bdi dir="ltr">
              {nutrients?.energyKcal == null ? t('common.notReported') : `${formatNumber(roundForDisplay('energyKcal', nutrients.energyKcal), lang, 0)} kcal`}
            </bdi>
          </p>
          <p className="text-sm text-muted">{t('foods.forAmount', { amount, unit: current.referenceUnit })}</p>
          <PhotoCredit credit={creditForFood(current)} />
        </div>
      </div>
      <div className="space-y-4">
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold text-ink">{t('foods.portion')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {choices.map((choice) => (
              <button
                key={`${choice.amount}-${choice.label}`}
                type="button"
                aria-pressed={Number(amount) === choice.amount}
                className={`min-h-11 rounded-full px-3 text-sm ${Number(amount) === choice.amount ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                onClick={() => {
                  setAmount(choice.amount)
                  setCustom(String(choice.amount))
                }}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm font-semibold">
            {t('foods.customGrams')}
            <input
              inputMode="decimal"
              className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value)
                const next = Number(event.target.value)
                if (next > 0) setAmount(next)
              }}
            />
          </label>
          <div className="mt-4">
            <MacroBar nutrients={nutrients} />
          </div>
        </section>
        <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
          <h2 className="font-bold text-ink">{t('foods.addMeal')}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {MEALS.map((meal) => (
              <button
                key={meal}
                type="button"
                className="min-h-12 rounded-2xl bg-mist font-semibold text-ink"
                onClick={() => addFood({ food: current, amount: Number(amount), meal, date: todayISO() })}
              >
                {t(`meals.${meal}`)}
              </button>
            ))}
          </div>
        </section>
        <NutrientTable nutrients={nutrients} />
        <p className="text-sm leading-6 text-muted">{t('foods.disclaimer')}</p>
        <p className="text-sm">
          <a className="font-semibold underline" href={current.sourceUrl}>{current.sourceName}</a>
        </p>
      </div>
    </article>
  )
}
