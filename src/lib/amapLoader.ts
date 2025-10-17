import { getSetting } from './storage'

let loading: Promise<any> | null = null

export function loadAMap(): Promise<any | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if ((window as any).AMap) return Promise.resolve((window as any).AMap)
  if (loading) return loading
  const key = getSetting('amapKey')
  if (!key) return Promise.resolve(null)
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&plugin=AMap.Geocoder`
    script.async = true
    script.onload = () => resolve((window as any).AMap)
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loading
}

export async function geocode(address: string): Promise<{lng:number, lat:number} | null> {
  const AMap = await loadAMap()
  if (!AMap) return null
  return new Promise((resolve) => {
    const geocoder = new AMap.Geocoder()
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes?.[0]) {
        const loc = result.geocodes[0].location
        resolve({ lng: loc.lng, lat: loc.lat })
      } else {
        resolve(null)
      }
    })
  })
}
