import { useEffect, useRef } from 'react'
import { loadAMap, geocode, reverseGeocode } from '../lib/amapLoader'
import { getDrivingRoute } from '../services/amapWebService'

type Coord = { lng: number, lat: number }

export default function MapView({ destination, onPick, startCoord, endCoord }: { destination: string, onPick?: (display: string) => void, startCoord?: Coord | null, endCoord?: Coord | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const routePolylineRef = useRef<any>(null)

  useEffect(() => {
    let destroyed = false
    async function init() {
      if (!ref.current) return
      const AMap = await loadAMap()
      if (!AMap) return
      const map = new AMap.Map(ref.current, { zoom: 11 })
      mapRef.current = map

      map.on('click', async (e: any) => {
        if (destroyed) return
        const lng = e.lnglat?.lng
        const lat = e.lnglat?.lat
        if (typeof lng === 'number' && typeof lat === 'number') {
          if (!markerRef.current) markerRef.current = new AMap.Marker({ position: [lng, lat], map })
          else markerRef.current.setPosition([lng, lat])
          const res = await reverseGeocode(lng, lat)
          if (res?.display && onPick) onPick(res.display)
        }
      })
    }
    init()
    return () => { destroyed = true; if (mapRef.current) mapRef.current?.destroy?.(); mapRef.current = null; markerRef.current = null; if (routePolylineRef.current) { try { routePolylineRef.current.setMap(null) } catch {}; routePolylineRef.current = null } }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!destination) return
      const map = mapRef.current
      const AMap = await loadAMap()
      if (!AMap || !map) return
      const loc = await geocode(destination)
      if (loc) {
        map.setZoomAndCenter(12, [loc.lng, loc.lat])
        if (!markerRef.current) markerRef.current = new AMap.Marker({ position: [loc.lng, loc.lat], map })
        else markerRef.current.setPosition([loc.lng, loc.lat])
      }
    })()
  }, [destination])

  useEffect(() => {
    ;(async () => {
      if (!startCoord || !endCoord) return
      const map = mapRef.current
      const AMap = await loadAMap()
      if (!AMap || !map) return
      // fetch route from REST
      const { points } = await getDrivingRoute(startCoord, endCoord)
      // clear previous polyline
      if (routePolylineRef.current) {
        try { routePolylineRef.current.setMap(null) } catch {}
        routePolylineRef.current = null
      }
      const polyline = new AMap.Polyline({
        path: points,
        strokeColor: '#409EFF',
        strokeWeight: 5,
        strokeOpacity: 0.9
      })
      polyline.setMap(map)
      routePolylineRef.current = polyline
      map.setFitView([polyline])
    })()
  }, [startCoord?.lng, startCoord?.lat, endCoord?.lng, endCoord?.lat])

  return <div ref={ref} className="w-full h-[480px] bg-gray-100 rounded border" />
}
