import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell.jsx'
import { WelcomePage } from '../features/welcome/WelcomePage.jsx'

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage.jsx').then((module) => ({ default: module.DashboardPage })))
const DiaryPage = lazy(() => import('../features/diary/DiaryPage.jsx').then((module) => ({ default: module.DiaryPage })))
const FoodDetailPage = lazy(() => import('../features/foods/FoodDetailPage.jsx').then((module) => ({ default: module.FoodDetailPage })))
const FoodsPage = lazy(() => import('../features/foods/FoodsPage.jsx').then((module) => ({ default: module.FoodsPage })))
const NotFoundPage = lazy(() => import('../features/not-found/NotFoundPage.jsx').then((module) => ({ default: module.NotFoundPage })))
const NutrientDetailPage = lazy(() => import('../features/nutrients/NutrientDetailPage.jsx').then((module) => ({ default: module.NutrientDetailPage })))
const NutrientsPage = lazy(() => import('../features/nutrients/NutrientsPage.jsx').then((module) => ({ default: module.NutrientsPage })))
const OnboardingPage = lazy(() => import('../features/onboarding/OnboardingPage.jsx').then((module) => ({ default: module.OnboardingPage })))
const RecipeDetailPage = lazy(() => import('../features/recipes/RecipeDetailPage.jsx').then((module) => ({ default: module.RecipeDetailPage })))
const RecipesPage = lazy(() => import('../features/recipes/RecipesPage.jsx').then((module) => ({ default: module.RecipesPage })))
const SettingsPage = lazy(() => import('../features/settings/SettingsPage.jsx').then((module) => ({ default: module.SettingsPage })))

function Pending() {
  const { t } = useTranslation()
  return <p>{t('common.loading')}</p>
}

function page(node) {
  return <Suspense fallback={<Pending />}>{node}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/onboarding" element={page(<OnboardingPage />)} />
        <Route path="/dashboard" element={page(<DashboardPage />)} />
        <Route path="/foods" element={page(<FoodsPage />)} />
        <Route path="/foods/:id" element={page(<FoodDetailPage />)} />
        <Route path="/recipes" element={page(<RecipesPage />)} />
        <Route path="/recipes/:id" element={page(<RecipeDetailPage />)} />
        <Route path="/nutrients" element={page(<NutrientsPage />)} />
        <Route path="/nutrients/:slug" element={page(<NutrientDetailPage />)} />
        <Route path="/diary" element={page(<DiaryPage />)} />
        <Route path="/settings" element={page(<SettingsPage />)} />
        <Route path="*" element={page(<NotFoundPage />)} />
      </Route>
    </Routes>
  )
}
