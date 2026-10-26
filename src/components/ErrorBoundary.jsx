import { Component } from 'react'
import i18n from '../i18n.js'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-ink">{i18n.t('notFound.title')}</h1>
        <button type="button" className="mt-4 min-h-11 rounded-full bg-ink px-4 text-white" onClick={() => window.location.assign('/')}>
          {i18n.t('notFound.home')}
        </button>
      </div>
    )
  }
}
