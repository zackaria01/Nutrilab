const PROFILE_KEY = 'nutrilab.profile'
const DIARY_KEY = 'nutrilab.diary'

export const EMPTY_PROFILE = {
  completed: false,
  age: null,
  heightCm: null,
  weightKg: null,
  gender: null,
  activity: null,
  goals: [],
  restrictions: [],
  energyEstimate: null,
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function loadProfile() {
  return { ...EMPTY_PROFILE, ...readJson(PROFILE_KEY, {}) }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadDiary() {
  const diary = readJson(DIARY_KEY, { entries: [] })
  return { entries: Array.isArray(diary.entries) ? diary.entries : [] }
}

export function saveDiary(diary) {
  localStorage.setItem(DIARY_KEY, JSON.stringify(diary))
}

export function clearPersonalData() {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(DIARY_KEY)
}

export function todayISO(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
