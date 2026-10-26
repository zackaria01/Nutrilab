import { BookOpen, Calendar, Home, Leaf, Search, Settings, Utensils } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { LanguageSwitcher } from '../ui/LanguageSwitcher.jsx'
import { useAppState } from '../../app/AppState.jsx'

const TABS = [
  { to: '/dashboard', label: 'nav.home', icon: Home },
  { to: '/foods', label: 'nav.foods', icon: Search },
  { to: '/recipes', label: 'nav.recipes', icon: Utensils },
  { to: '/nutrients', label: 'nav.nutrients', icon: Leaf },
  { to: '/diary', label: 'nav.diary', icon: Calendar },
]

function Item({ to, label, icon: Icon, t }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ${
          isActive ? 'bg-mist text-ink' : 'text-inktext hover:bg-white/70'
        }`
      }
    >
      <Icon aria-hidden="true" size={18} />
      <span>{t(label)}</span>
    </NavLink>
  )
}

export function AppShell() {
  const { t, i18n } = useTranslation()
  const { toast } = useAppState()
  const lang = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = t('meta.title')
  }, [lang, t])

  return (
    <div className="min-h-dvh bg-ivory text-inktext">
      <div className="md:grid md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-e border-line bg-white px-4 py-6 md:flex">
          <NavLink to="/" className="px-3 text-xl font-bold text-ink">
            NutriLab
          </NavLink>
          <nav className="flex flex-col gap-1" aria-label={t('nav.primary')}>
            {TABS.map((tab) => (
              <Item key={tab.to} {...tab} t={t} />
            ))}
            <Item to="/settings" label="nav.settings" icon={Settings} t={t} />
          </nav>
          <p className="mt-auto flex items-start gap-2 px-3 text-xs leading-5 text-muted">
            <BookOpen size={16} aria-hidden="true" />
            {t('common.notMedical')}
          </p>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-ivory/95 px-4 py-3 backdrop-blur">
            <NavLink to="/" className="text-lg font-bold text-ink md:hidden">
              NutriLab
            </NavLink>
            <p className="hidden text-sm text-muted md:block">{t('common.tagline')}</p>
            <div className="ms-auto flex items-center gap-2">
              <LanguageSwitcher compact />
              <NavLink
                to="/settings"
                aria-label={t('nav.settings')}
                className="inline-flex size-11 items-center justify-center rounded-full bg-white ring-1 ring-line md:hidden"
              >
                <Settings size={18} />
              </NavLink>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1360px] px-4 pb-28 pt-4 md:pb-12 md:pt-6">
            <Outlet />
          </main>
        </div>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white px-1 py-1 md:hidden"
        aria-label={t('nav.primary')}
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold ${
                isActive ? 'text-ink' : 'text-muted'
              }`
            }
          >
            <tab.icon aria-hidden="true" size={18} />
            <span className="max-w-full truncate px-1">{t(tab.label)}</span>
          </NavLink>
        ))}
      </nav>
      {toast ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-30 rounded-2xl bg-ink px-4 py-3 text-center text-sm text-white md:inset-x-auto md:end-6 md:bottom-6"
        >
          {t(toast.key)}
        </div>
      ) : null}
    </div>
  )
}
