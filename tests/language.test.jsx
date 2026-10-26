import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppStateProvider } from '../src/app/AppState.jsx'
import { AppRoutes } from '../src/app/router.jsx'
import i18n from '../src/i18n.js'
import { todayISO } from '../src/lib/storage.js'

function renderApp() {
  return render(
    <I18nextProvider i18n={i18n}>
      <AppStateProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </AppStateProvider>
    </I18nextProvider>,
  )
}

describe('language switch', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('nutrilab.profile', JSON.stringify({
      completed: true,
      age: 30,
      heightCm: 170,
      weightKg: 70,
      gender: null,
      activity: 'some',
      goals: ['learn'],
      restrictions: [],
      energyEstimate: null,
    }))
    localStorage.setItem('nutrilab.diary', JSON.stringify({
      entries: [{
        id: 'entry-1',
        date: todayISO(),
        meal: 'breakfast',
        kind: 'food',
        itemId: 'curated:banana',
        amount: 100,
        unit: 'g',
        servings: null,
        snapshot: { energyKcal: 89, proteinG: 1.09, carbohydrateG: 22.84, fatG: 0.33 },
        reference: { amount: 100, unit: 'g', nutrients: { energyKcal: 89, proteinG: 1.09, carbohydrateG: 22.84, fatG: 0.33 } },
        createdAt: '2026-10-26T00:00:00.000Z',
      }],
    }))
    await i18n.changeLanguage('en')
  })

  it('switches en → fr → ar → en without dropping profile or diary', async () => {
    renderApp()
    expect(await screen.findByRole('heading', { name: /make nutrition simple/i })).toBeInTheDocument()
    expect(screen.getByText(/70 kg/)).toBeInTheDocument()

    fireEvent.change(screen.getAllByRole('combobox', { name: 'Language' })[0], { target: { value: 'fr' } })
    await waitFor(() => expect(document.documentElement.lang).toBe('fr'))
    expect(document.documentElement.dir).toBe('ltr')
    expect(screen.getByRole('heading', { name: /rendons la nutrition simple/i })).toBeInTheDocument()
    expect(screen.getByText(/70 kg/)).toBeInTheDocument()

    fireEvent.change(screen.getAllByRole('combobox', { name: 'Langue' })[0], { target: { value: 'ar' } })
    await waitFor(() => expect(document.documentElement.lang).toBe('ar'))
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('heading', { name: 'لنجعل التغذية بسيطة.' })).toBeInTheDocument()
    expect(screen.getByText(/70 kg/)).toBeInTheDocument()

    fireEvent.change(screen.getAllByRole('combobox', { name: 'اللغة' })[0], { target: { value: 'en' } })
    await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
    expect(screen.getByRole('heading', { name: /make nutrition simple/i })).toBeInTheDocument()
    const saved = JSON.parse(localStorage.getItem('nutrilab.diary'))
    expect(saved.entries).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('nutrilab.profile')).weightKg).toBe(70)
  })
})
