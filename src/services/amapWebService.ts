import { getSetting } from '../lib/storage'

export interface DrivingRouteStep {
  instruction: string
  polyline: string
}

export interface DrivingRoutePath {
  distance: string
  duration: string
  steps: DrivingRouteStep[]
}

export interface DrivingRouteResponse {
  status: string
  info?: string
  route?: { paths?: DrivingRoutePath[] }
}

export async function getDrivingRoute(origin: {lng:number, lat:number}, destination: {lng:number, lat:number}) {
  const key = getSetting('amapWebKey')
  if (!key) throw new Error('请在设置页填写 高德 Web 服务 Key')
  const url = new URL('https://restapi.amap.com/v3/direction/driving')
  url.searchParams.set('origin', `${origin.lng},${origin.lat}`)
  url.searchParams.set('destination', `${destination.lng},${destination.lat}`)
  url.searchParams.set('strategy', '0')
  url.searchParams.set('extensions', 'all')
  url.searchParams.set('output', 'json')
  url.searchParams.set('key', key)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('调用高德路径规划失败')
  const data: DrivingRouteResponse = await res.json()
  if (data.status !== '1') throw new Error(data.info || '路径规划返回失败')
  const path = data.route?.paths?.[0]
  if (!path) throw new Error('未找到可用路径')
  // Flatten polylines into points
  const points: [number, number][] = []
  for (const step of path.steps || []) {
    const segs = (step.polyline || '').split(';')
    for (const s of segs) {
      const [slng, slat] = s.split(',')
      const lng = Number(slng)
      const lat = Number(slat)
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) points.push([lng, lat])
    }
  }
  return { points, distance: path.distance, duration: path.duration }
}
