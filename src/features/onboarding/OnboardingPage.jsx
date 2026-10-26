import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { bmiCategory, calculateBmi, feetInchesToCm, poundsToKg, roundBmi } from '../../lib/nutrition/bmi.js'
import { mifflinStJeor } from '../../lib/nutrition/energy.js'
import { formatNumber } from '../../lib/text.js'

const GOALS = ['balanced', 'maintain', 'strength', 'weight', 'learn']
const RESTRICTIONS = ['vegetarian', 'gluten', 'milk', 'egg', 'fish', 'peanut', 'tree-nut', 'sesame']
const ACTIVITIES = ['sitting', 'some', 'regular', 'very']
const GENDERS = ['woman', 'man', 'nonbinary', 'unspecified']

export function OnboardingPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const navigate = useNavigate()
  const { profile, setProfile } = useAppState()
  const [step, setStep] = useState(profile.completed ? 1 : 0)
  const [form, setForm] = useState(() => ({
    age: profile.age ?? '',
    heightCm: profile.heightCm ?? '',
    weightKg: profile.weightKg ?? '',
    heightUnit: 'cm',
    weightUnit: 'kg',
    feet: '',
    inches: '',
    pounds: '',
    gender: profile.gender,
    activity: profile.activity,
    goals: profile.goals || [],
    restrictions: profile.restrictions || [],
    sexParameter: profile.energyEstimate?.sexParameter || '',
    estimate: null,
    error: '',
  }))

  const bmi = useMemo(() => {
    const height = Number(form.heightCm)
    const weight = Number(form.weightKg)
    return calculateBmi(weight, height)
  }, [form.heightCm, form.weightKg])

  function toggle(list, value) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
  }

  function validateBody() {
    const age = Number(form.age)
    let height = Number(form.heightCm)
    let weight = Number(form.weightKg)
    if (form.heightUnit === 'ft') height = feetInchesToCm(form.feet, form.inches)
    if (form.weightUnit === 'lb') weight = poundsToKg(form.pounds)
    if (!Number.isInteger(age) || age < 2 || age > 120) return { error: 'onboarding.ageError' }
    if (height == null || height < 50 || height > 250) return { error: 'onboarding.heightError' }
    if (weight == null || weight < 10 || weight > 350) return { error: 'onboarding.weightError' }
    return { age, heightCm: Math.round(height * 10) / 10, weightKg: Math.round(weight * 10) / 10 }
  }

  function nextFromBody() {
    const result = validateBody()
    if (result.error) {
      setForm((current) => ({ ...current, error: result.error }))
      return
    }
    setForm((current) => ({ ...current, ...result, error: '' }))
    setStep(2)
  }

  function finish(energyEstimate, destination = '/dashboard') {
    setProfile({
      completed: true,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      gender: form.gender,
      activity: form.activity,
      goals: form.goals,
      restrictions: form.restrictions,
      energyEstimate,
    })
    navigate(destination)
  }

  function calculateEstimate() {
    const result = mifflinStJeor({
      weightKg: Number(form.weightKg),
      heightCm: Number(form.heightCm),
      ageYears: Number(form.age),
      sexParameter: form.sexParameter,
      activity: form.activity,
    })
    setForm((current) => ({ ...current, estimate: result, error: result ? '' : 'onboarding.estimateMissing' }))
  }

  return (
    <section className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold text-leaf">{t('onboarding.step', { current: step + 1, total: 4 })}</p>
      {step === 0 ? (
        <div className="mt-4 rounded-[28px] bg-white p-6 ring-1 ring-line">
          <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-mist to-[#fff4ea]">
            <svg viewBox="0 0 360 120" className="h-24 w-full" aria-hidden="true">
              <circle cx="70" cy="62" r="28" fill="#F4B183" />
              <circle cx="150" cy="54" r="22" fill="#4F9C75" />
              <path d="M210 78h110c-6 16-28 26-55 26s-49-10-55-26z" fill="#ffffff" />
              <circle cx="292" cy="40" r="12" fill="#173E35" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-ink">{t('welcome.title')}</h1>
          <p className="mt-3 text-muted">{t('welcome.body')}</p>
          <div className="mt-6 flex gap-3">
            <button type="button" className="min-h-12 rounded-full bg-ink px-5 font-semibold text-white" onClick={() => setStep(1)}>
              {t('welcome.start')}
            </button>
            <button type="button" className="min-h-12 rounded-full px-5 font-semibold text-ink ring-1 ring-line" onClick={() => navigate('/foods')}>
              {t('welcome.explore')}
            </button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <form
          className="mt-4 space-y-4 rounded-[28px] bg-white p-6 ring-1 ring-line"
          onSubmit={(event) => {
            event.preventDefault()
            nextFromBody()
          }}
        >
          <h1 className="text-2xl font-bold text-ink">{t('onboarding.bodyTitle')}</h1>
          <label className="block text-sm font-semibold">
            {t('onboarding.age')}
            <input
              inputMode="numeric"
              className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3"
              value={form.age}
              onChange={(event) => setForm({ ...form, age: event.target.value })}
            />
          </label>
          <div className="flex gap-2">
            {['cm', 'ft'].map((unit) => (
              <button
                key={unit}
                type="button"
                className={`min-h-11 rounded-full px-4 ${form.heightUnit === unit ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                onClick={() => setForm({ ...form, heightUnit: unit })}
              >
                {t(`onboarding.heightUnit.${unit}`)}
              </button>
            ))}
          </div>
          {form.heightUnit === 'cm' ? (
            <label className="block text-sm font-semibold">
              {t('onboarding.height')}
              <input
                inputMode="decimal"
                className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3"
                value={form.heightCm}
                onChange={(event) => setForm({ ...form, heightCm: event.target.value })}
              />
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                {t('onboarding.feet')}
                <input className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3" value={form.feet} onChange={(event) => setForm({ ...form, feet: event.target.value })} />
              </label>
              <label className="text-sm font-semibold">
                {t('onboarding.inches')}
                <input className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3" value={form.inches} onChange={(event) => setForm({ ...form, inches: event.target.value })} />
              </label>
            </div>
          )}
          <div className="flex gap-2">
            {['kg', 'lb'].map((unit) => (
              <button
                key={unit}
                type="button"
                className={`min-h-11 rounded-full px-4 ${form.weightUnit === unit ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                onClick={() => setForm({ ...form, weightUnit: unit })}
              >
                {t(`onboarding.weightUnit.${unit}`)}
              </button>
            ))}
          </div>
          {form.weightUnit === 'kg' ? (
            <label className="block text-sm font-semibold">
              {t('onboarding.weight')}
              <input
                inputMode="decimal"
                className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3"
                value={form.weightKg}
                onChange={(event) => setForm({ ...form, weightKg: event.target.value })}
              />
            </label>
          ) : (
            <label className="block text-sm font-semibold">
              {t('onboarding.pounds')}
              <input className="mt-1 min-h-12 w-full rounded-2xl border border-line px-3" value={form.pounds} onChange={(event) => setForm({ ...form, pounds: event.target.value })} />
            </label>
          )}
          <fieldset>
            <legend className="text-sm font-semibold">{t('onboarding.gender')}</legend>
            <p className="text-sm text-muted">{t('onboarding.genderNote')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENDERS.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  aria-pressed={form.gender === gender}
                  className={`min-h-11 rounded-full px-3 text-sm ${form.gender === gender ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                  onClick={() => setForm({ ...form, gender: form.gender === gender ? null : gender })}
                >
                  {t(`onboarding.genders.${gender}`)}
                </button>
              ))}
            </div>
          </fieldset>
          {form.error ? <p className="text-sm font-semibold text-red-800">{t(form.error)}</p> : null}
          <button type="submit" className="min-h-12 rounded-full bg-ink px-5 font-semibold text-white">
            {t('common.continue')}
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <div className="mt-4 space-y-5 rounded-[28px] bg-white p-6 ring-1 ring-line">
          <h1 className="text-2xl font-bold text-ink">{t('onboarding.prefsTitle')}</h1>
          <fieldset>
            <legend className="font-semibold">{t('onboarding.activity')}</legend>
            <div className="mt-2 space-y-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  aria-pressed={form.activity === activity}
                  className={`block min-h-11 w-full rounded-2xl px-3 text-start ${form.activity === activity ? 'bg-mist ring-2 ring-ink' : 'ring-1 ring-line'}`}
                  onClick={() => setForm({ ...form, activity: form.activity === activity ? null : activity })}
                >
                  <span className="font-semibold">{t(`onboarding.activities.${activity}.title`)}</span>
                  <span className="mt-0.5 block text-sm text-muted">{t(`onboarding.activities.${activity}.body`)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-semibold">{t('onboarding.goals')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  aria-pressed={form.goals.includes(goal)}
                  className={`min-h-11 rounded-full px-3 text-sm ${form.goals.includes(goal) ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                  onClick={() => setForm({ ...form, goals: toggle(form.goals, goal) })}
                >
                  {t(`goals.${goal}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-semibold">{t('onboarding.restrictions')}</legend>
            <p className="text-sm text-muted">{t('onboarding.restrictionsNote')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {RESTRICTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={form.restrictions.includes(item)}
                  className={`min-h-11 rounded-full px-3 text-sm ${form.restrictions.includes(item) ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                  onClick={() => setForm({ ...form, restrictions: toggle(form.restrictions, item) })}
                >
                  {t(`restrictions.${item}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-3">
            <button type="button" className="min-h-12 rounded-full px-4 ring-1 ring-line" onClick={() => setStep(3)}>
              {t('common.skip')}
            </button>
            <button type="button" className="min-h-12 rounded-full bg-ink px-5 font-semibold text-white" onClick={() => setStep(3)}>
              {t('common.continue')}
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-[28px] bg-white p-6 ring-1 ring-line">
            <h1 className="text-2xl font-bold text-ink">{t('onboarding.resultsTitle')}</h1>
            {Number(form.age) >= 20 && bmi ? (
              <>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-apricot via-leaf to-[#c96b4a] rtl:bg-gradient-to-l"
                    style={{ width: `${((Math.min(40, Math.max(15, bmi)) - 15) / 25) * 100}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-muted">{t('bmi.formula')}</p>
                <p className="mt-2 text-4xl font-bold text-ink">
                  <bdi dir="ltr">{formatNumber(roundBmi(bmi), lang, 1)}</bdi>
                </p>
                <p className="mt-2 font-semibold">{t(`bmi.categories.${bmiCategory(bmi, Number(form.age))}`)}</p>
              </>
            ) : (
              <p className="mt-4">{t('bmi.notAdult')}</p>
            )}
            <p className="mt-3 text-sm leading-6 text-muted">{t('bmi.limit')}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{t('bmi.noTarget')}</p>
          </div>
          {Number(form.age) >= 20 ? (
            <div className="rounded-[28px] bg-white p-6 ring-1 ring-line">
              <h2 className="text-xl font-bold text-ink">{t('onboarding.estimateTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{t('onboarding.estimateBody')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['female', 'male'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.sexParameter === value}
                    className={`min-h-11 rounded-full px-3 ${form.sexParameter === value ? 'bg-ink text-white' : 'ring-1 ring-line'}`}
                    onClick={() => setForm({ ...form, sexParameter: value, estimate: null })}
                  >
                    {t(`onboarding.sexParameter.${value}`)}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="min-h-11 rounded-full bg-leaf px-4 font-semibold text-white" onClick={calculateEstimate}>
                  {t('onboarding.calculate')}
                </button>
                <button type="button" className="min-h-11 rounded-full px-4 ring-1 ring-line" onClick={() => finish(null)}>
                  {t('onboarding.skipEstimate')}
                </button>
              </div>
              {form.error ? <p className="mt-2 text-sm text-red-800">{t(form.error)}</p> : null}
              {form.estimate ? (
                <div className="mt-4 rounded-2xl bg-mist p-4">
                  <p className="text-sm">{t('onboarding.estimateResult')}</p>
                  <p className="text-3xl font-bold text-ink">
                    <bdi dir="ltr">{formatNumber(Math.round(form.estimate.estimatedKcal), lang, 0)} kcal</bdi>
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {t('onboarding.estimateAssumptions', {
                      factor: form.estimate.activityFactor,
                      sex: t(`onboarding.sexParameter.${form.estimate.sexParameter}`),
                    })}
                  </p>
                  <button
                    type="button"
                    className="mt-3 min-h-11 rounded-full bg-ink px-4 font-semibold text-white"
                    onClick={() => finish({ ...form.estimate, accepted: true })}
                  >
                    {t('onboarding.acceptEstimate')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {[
              ['/nutrients/protein', 'onboarding.linkProtein'],
              ['/recipes?meal=breakfast', 'onboarding.linkBreakfast'],
              ['/nutrients/fiber', 'onboarding.linkFiber'],
              ['/recipes', 'onboarding.linkMeals'],
            ].map(([to, key]) => (
              <button key={key} type="button" className="min-h-11 rounded-full bg-white px-3 text-sm ring-1 ring-line" onClick={() => finish(profile.energyEstimate, to)}>
                {t(key)}
              </button>
            ))}
          </div>
          <button type="button" className="min-h-12 rounded-full bg-ink px-5 font-semibold text-white" onClick={() => finish(form.estimate?.accepted ? form.estimate : profile.energyEstimate)}>
            {t('onboarding.openDashboard')}
          </button>
        </div>
      ) : null}
    </section>
  )
}
