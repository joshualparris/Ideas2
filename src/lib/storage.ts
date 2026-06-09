import type { RoutinePlan } from '../types/idea'

const FAVORITES_KEY = 'sylvie-ideas-favorites'
const RECENT_KEY = 'sylvie-ideas-recent'
const ROUTINE_KEY = 'sylvie-ideas-routine'

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return fallback
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors
  }
}

export function loadFavorites(): string[] {
  return loadJson(FAVORITES_KEY, [])
}

export function saveFavorites(ids: string[]): void {
  saveJson(FAVORITES_KEY, ids)
}

export function loadRecentIds(): string[] {
  return loadJson(RECENT_KEY, [])
}

export function saveRecentIds(ids: string[]): void {
  saveJson(RECENT_KEY, ids)
}

export function loadRoutine(): RoutinePlan {
  return loadJson(ROUTINE_KEY, {
    morning: [],
    afterPreschool: [],
    beforeDinner: [],
    bedtime: [],
  })
}

export function saveRoutine(routine: RoutinePlan): void {
  saveJson(ROUTINE_KEY, routine)
}
