import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { scaleNutrients } from '../lib/nutrition/portions.js'
import { NUTRIENT_KEYS } from '../lib/nutrition/units.js'
import { clearPersonalData, loadDiary, loadProfile, saveDiary, saveProfile } from '../lib/storage.js'

const AppStateContext = createContext(null)

function flatten(nutrients) {
  return Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, nutrients?.[key] ?? null]))
}

export function AppStateProvider({ children }) {
  const [profile, setProfile] = useState(() => loadProfile())
  const [diary, setDiary] = useState(() => loadDiary())
  const [toast, setToast] = useState(null)

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  useEffect(() => {
    saveDiary(diary)
  }, [diary])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const api = useMemo(() => {
    function notify(key) {
      setToast({ key, id: Date.now() })
    }

    function addFood({ food, amount, meal, date }) {
      const scaled = scaleNutrients(food.nutrientsPerReference, amount, food.referenceAmount)
      const entry = {
        id: crypto.randomUUID(),
        date,
        meal,
        kind: 'food',
        itemId: food.id,
        amount,
        unit: food.referenceUnit,
        servings: null,
        snapshot: flatten(scaled?.nutrients),
        reference: {
          amount: food.referenceAmount,
          unit: food.referenceUnit,
          nutrients: flatten(food.nutrientsPerReference),
        },
        createdAt: new Date().toISOString(),
      }
      setDiary((current) => ({ entries: [...current.entries, entry] }))
      notify('toast.added')
    }

    function addRecipe({ recipe, nutrition, meal, date, servings }) {
      const snapshot = {}
      for (const key of NUTRIENT_KEYS) {
        snapshot[key] = nutrition.perServing?.[key]?.value ?? null
      }
      const perServing = { ...snapshot }
      const scaled = scaleNutrients(perServing, servings, 1)
      const entry = {
        id: crypto.randomUUID(),
        date,
        meal,
        kind: 'recipe',
        itemId: recipe.id,
        amount: servings,
        unit: 'serving',
        servings,
        snapshot: flatten(scaled?.nutrients),
        reference: { amount: 1, unit: 'serving', nutrients: perServing },
        incomplete: nutrition.incomplete,
        createdAt: new Date().toISOString(),
      }
      setDiary((current) => ({ entries: [...current.entries, entry] }))
      notify('toast.added')
    }

    function updateEntry(id, amount) {
      setDiary((current) => ({
        entries: current.entries.map((entry) => {
          if (entry.id !== id) return entry
          const scaled = scaleNutrients(entry.reference.nutrients, amount, entry.reference.amount)
          return {
            ...entry,
            amount,
            servings: entry.kind === 'recipe' ? amount : entry.servings,
            snapshot: flatten(scaled?.nutrients),
          }
        }),
      }))
    }

    function removeEntry(id) {
      setDiary((current) => ({ entries: current.entries.filter((entry) => entry.id !== id) }))
    }

    function clearAll() {
      clearPersonalData()
      setProfile(loadProfile())
      setDiary({ entries: [] })
      notify('toast.cleared')
    }

    return { addFood, addRecipe, updateEntry, removeEntry, clearAll, notify }
  }, [])

  const value = { profile, setProfile, diary, toast, ...api }
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState must be used inside AppStateProvider')
  return value
}
