import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../app/AppState.jsx'
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher.jsx'

export function SettingsPage() {
  const { t } = useTranslation()
  const { profile, clearAll } = useAppState()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold text-ink">{t('settings.title')}</h1>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="font-bold">{t('common.language')}</h2>
        <div className="mt-3">
          <LanguageSwitcher />
        </div>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="font-bold">{t('settings.profile')}</h2>
        <p className="mt-2 text-sm text-muted">{profile.completed ? t('settings.profileReady') : t('settings.profileEmpty')}</p>
        <Link to="/onboarding" className="mt-3 inline-flex min-h-11 items-center font-semibold underline">{t('settings.editProfile')}</Link>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="font-bold">{t('settings.privacyTitle')}</h2>
        <p className="mt-2 text-sm leading-6">{t('settings.privacyBody')}</p>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="font-bold">{t('settings.sourcesTitle')}</h2>
        <p className="mt-2 text-sm leading-6">{t('settings.sourcesBody')}</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li><a className="underline" href="https://fdc.nal.usda.gov/">USDA FoodData Central</a></li>
          <li><a className="underline" href="https://world.openfoodfacts.org/">Open Food Facts</a></li>
          <li><a className="underline" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">CDC BMI categories</a></li>
          <li><a className="underline" href="https://ods.od.nih.gov/factsheets/list-all/">NIH Office of Dietary Supplements</a></li>
        </ul>
        <p className="mt-3 text-sm leading-6">{t('settings.photos')}</p>
        <p className="mt-3 text-sm leading-6">{t('settings.limits')}</p>
      </section>
      <section className="rounded-[28px] bg-white p-5 ring-1 ring-line">
        <h2 className="font-bold">{t('settings.laterTitle')}</h2>
        <p className="mt-2 text-sm leading-6">{t('settings.laterBody')}</p>
      </section>
      <section className="rounded-[28px] border border-red-200 bg-white p-5">
        <h2 className="font-bold">{t('settings.clearTitle')}</h2>
        <p className="mt-2 text-sm">{t('settings.clearBody')}</p>
        {confirm ? (
          <div className="mt-3 flex gap-2">
            <button type="button" className="min-h-11 rounded-full bg-red-800 px-4 font-semibold text-white" onClick={() => { clearAll(); setConfirm(false) }}>
              {t('settings.clearConfirm')}
            </button>
            <button type="button" className="min-h-11 rounded-full px-4 ring-1 ring-line" onClick={() => setConfirm(false)}>
              {t('common.cancel')}
            </button>
          </div>
        ) : (
          <button type="button" className="mt-3 min-h-11 rounded-full px-4 font-semibold ring-1 ring-line" onClick={() => setConfirm(true)}>
            {t('settings.clearAction')}
          </button>
        )}
      </section>
    </div>
  )
}
