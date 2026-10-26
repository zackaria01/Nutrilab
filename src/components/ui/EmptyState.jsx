import { Link } from 'react-router-dom'

export function EmptyState({ title, body, action, to }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(23,62,53,0.06)] ring-1 ring-line">
      <div className="bg-gradient-to-br from-mist to-ivory px-6 pt-6">
        <svg viewBox="0 0 360 140" className="mx-auto h-28 w-full max-w-sm" aria-hidden="true">
          <rect width="360" height="140" fill="none" />
          <ellipse cx="180" cy="118" rx="92" ry="12" fill="#173E35" opacity="0.08" />
          <path d="M92 96h176c-8 22-42 34-88 34s-80-12-88-34z" fill="#ffffff" />
          <path d="M118 96c8-28 28-46 62-46s54 18 62 46" fill="#F4B183" />
          <circle cx="248" cy="48" r="16" fill="#4F9C75" />
          <path d="M248 28c10 8 12 18 4 30" fill="none" stroke="#173E35" strokeWidth="3" strokeLinecap="round" />
          <circle cx="112" cy="58" r="8" fill="#E07A5F" />
        </svg>
      </div>
      <div className="space-y-3 px-6 pb-6">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        {body ? <p className="text-sm leading-6 text-muted">{body}</p> : null}
        {action && to ? (
          <Link to={to} className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
            {action}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
