import { ArrowRight, Search } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FoodPhoto } from '../../components/ui/FoodImage.jsx'
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher.jsx'
import { getFood } from '../../data/foods.js'
import { useAppState } from '../../app/AppState.jsx'
import { tx } from '../../lib/text.js'

export function WelcomePage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
  const { profile } = useAppState()
  if (profile.completed) return <Navigate to="/dashboard" replace />

  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-sm font-semibold text-leaf">{t('welcome.kicker')}</p>
        <h1 className="mt-2 max-w-xl text-4xl font-bold leading-tight text-ink md:text-5xl">{t('welcome.title')}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{t('welcome.body')}</p>
        <div className="mt-6">
          <LanguageSwitcher />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/onboarding" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-white">
            {t('welcome.start')}
            <ArrowRight className="rtl:rotate-180" size={18} aria-hidden="true" />
          </Link>
          <Link to="/foods" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-ink ring-1 ring-line">
            <Search size={18} aria-hidden="true" />
            {t('welcome.explore')}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3" aria-label={t('welcome.heroAlt')}>
        {['banana', 'yogurt', 'salmon-cooked', 'strawberry'].map((key, index) => {
          const food = getFood(`curated:${key}`)
          return (
            <div key={key} className={`relative overflow-hidden rounded-[28px] bg-mist shadow-[0_12px_40px_rgba(23,62,53,0.08)] ${index === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
              <FoodPhoto food={food} alt={tx(food.names, lang)} eager={index === 0} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
