import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../components/ui/EmptyState.jsx'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-lg">
      <EmptyState title={t('notFound.title')} body={t('notFound.body')} action={t('notFound.home')} to="/" />
    </div>
  )
}
