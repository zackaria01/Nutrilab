import { BrowserRouter } from 'react-router-dom'
import { AppStateProvider } from './app/AppState.jsx'
import { AppRoutes } from './app/router.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './i18n.js'

export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppStateProvider>
    </ErrorBoundary>
  )
}
