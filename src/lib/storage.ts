const NS = 'ai_travel_planner__'

export function getSetting(key: string): string | null {
  try { return localStorage.getItem(NS + key) } catch { return null }
}

export function setSetting(key: string, value: string) {
  try { localStorage.setItem(NS + key, value) } catch {}
}
