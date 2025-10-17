import { useEffect, useRef } from 'react'
import { loadAMap, geocode } from '../lib/amapLoader'

export default function MapView({ destination }: { destination: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: any
    let destroyed = false
    async function init() {
      if (!ref.current) return
      const AMap = await loadAMap()
      if (!AMap) return
      map = new AMap.Map(ref.current, { zoom: 11 })
      if (destination) {
        const loc = await geocode(destination)
        if (loc && !destroyed) {
          map.setZoomAndCenter(12, [loc.lng, loc.lat])
          new AMap.Marker({ position: [loc.lng, loc.lat], map })
        }
      }
    }
    init()
    return () => { destroyed = true; if (map) map?.destroy?.() }
  }, [destination])

  return <div ref={ref} className="w-full h-[480px] bg-gray-100 rounded border" />
}
