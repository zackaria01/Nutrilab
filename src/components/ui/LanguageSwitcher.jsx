import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LOCALES } from '../../i18n.js'

const LABELS = { en: 'English', fr: 'Français', ar: 'العربية' }

export function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation()
  const active = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)

  return (
    <label className="relative inline-flex min-h-11 items-center">
      <span className="sr-only">{t('common.language')}</span>
      <select
        aria-label={t('common.language')}
        value={LOCALES.includes(active) ? active : 'en'}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value)
        }}
        className={`min-h-11 appearance-none rounded-full bg-white py-2 pe-9 ps-3 text-sm font-semibold text-ink ring-1 ring-line ${compact ? 'max-w-40' : ''}`}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LABELS[code]}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute end-3 text-ink" />
    </label>
  )
}
