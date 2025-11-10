import { useEffect, useMemo, useState } from 'react'
import VoiceButton from '../components/VoiceButton'
import MapView from '../components/MapView'
import { llmPlanItinerary, llmGeocode } from '../services/llmClient'
import DestinationInput from '../components/DestinationInput'
import { reverseGeocode } from '../lib/amapLoader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Planner() {
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState('10000')
  const [people, setPeople] = useState(2)
  const [prefs, setPrefs] = useState('美食 动漫 亲子')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState('')
  const [routeLoading, setRouteLoading] = useState(false)
  const [startCoord, setStartCoord] = useState<{lng:number, lat:number} | null>(null)
  const [endCoord, setEndCoord] = useState<{lng:number, lat:number} | null>(null)

  const prompt = useMemo(() => (
    `起始地: ${start || '（未提供，默认定位）'}\n目的地: ${destination}\n天数: ${days}\n预算: ${budget}\n人数: ${people}\n日期: ${date}\n偏好: ${prefs}\n请生成详细的每日行程，优先从起始地出发，包含交通、住宿、景点、餐厅和预估费用，并给出每日预算。`
  ), [start, destination, days, budget, people, date, prefs])

  async function handleGenerate() {
    setLoading(true)
    try {
      const text = await llmPlanItinerary(prompt)
      setItinerary(text)
      // 自动进行路径规划（静默，不影响按钮 loading）
      if (start && destination) {
        planRoute(true).catch(() => {})
      }
    } catch (e: any) {
      alert(e?.message || '生成失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 默认使用浏览器定位作为起始地
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const rev = await reverseGeocode(longitude, latitude)
        if (rev?.display) setStart(rev.display)
      } catch {}
    }, () => {
      // 忽略失败（用户拒绝或环境不支持）
    })
  }, [])

  async function useCurrentAsStart() {
    if (!navigator.geolocation) { alert('当前浏览器不支持定位'); return }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const rev = await reverseGeocode(pos.coords.longitude, pos.coords.latitude)
      if (rev?.display) setStart(rev.display)
    }, () => alert('定位失败'))
  }

  async function planRoute(silent = false) {
    if (!start || !destination) { if (!silent) alert('请先填写起始地和目的地'); return }
    if (!silent) setRouteLoading(true)
    try {
      const [s, e] = await Promise.all([
        llmGeocode(start),
        llmGeocode(destination)
      ])
      if (!s || !e) throw new Error('地理编码失败，请检查地点描述或稍后再试')
      setStartCoord(s)
      setEndCoord(e)
    } catch (err: any) {
      if (!silent) alert(err?.message || '路径规划失败')
      else console.warn('Auto plan route failed', err)
    } finally {
      if (!silent) setRouteLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-5">
        <div className="grid gap-1">
          <label className="font-medium">起始地</label>
          <div className="text-xs text-gray-500">默认尝试使用浏览器定位，你也可以修改为任意地点</div>
          <div className="flex items-center gap-2">
            <DestinationInput value={start} onChange={setStart} placeholder="如：上海市浦东新区" />
            <button onClick={useCurrentAsStart} className="px-3 py-2 rounded border bg-white">使用当前位置</button>
          </div>
        </div>

        <div className="grid gap-1">
          <label className="font-medium">目的地</label>
          <div className="text-xs text-gray-500">支持高德联想，选择后地图将定位</div>
          <div className="flex items-center gap-2">
            <DestinationInput value={destination} onChange={setDestination} placeholder="如：日本东京都千代田区" />
            <VoiceButton onText={t=>setDestination(prev=>prev? prev + ' ' + t : t)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="font-medium">日期</span>
            <span className="text-xs text-gray-500">出发日期（可选）</span>
            <input type="date" className="border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="font-medium">天数</span>
            <span className="text-xs text-gray-500">旅行总天数</span>
            <input className="border rounded px-3 py-2" placeholder="如：5" type="number" value={days} onChange={e=>setDays(Number(e.target.value)||0)} />
          </label>
          <label className="grid gap-1">
            <span className="font-medium">预算（元）</span>
            <span className="text-xs text-gray-500">人均或总预算均可，LLM 会自适应</span>
            <input className="border rounded px-3 py-2" placeholder="如：10000" type="number" value={budget} onChange={e=>setBudget(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="font-medium">同行人数</span>
            <span className="text-xs text-gray-500">包含你在内的人数</span>
            <input className="border rounded px-3 py-2" placeholder="如：2" type="number" value={people} onChange={e=>setPeople(Number(e.target.value)||1)} />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="font-medium">旅行偏好</span>
          <span className="text-xs text-gray-500">如：美食、动漫、亲子、自然、博物馆、轻松慢行等</span>
          <textarea className="border rounded px-3 py-2 w-full h-24" placeholder="请输入旅行偏好，逗号或空格分隔" value={prefs} onChange={e=>setPrefs(e.target.value)} />
        </label>

        <button disabled={loading} onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{loading? '生成中...' : '生成行程'}</button>
        <div>
          <h3 className="font-semibold mb-2">AI 行程建议</h3>
          <div className="prose prose-sm max-w-none bg-white border rounded p-3 min-h-[160px]">
            {itinerary
              ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{itinerary}</ReactMarkdown>
              : <div className="text-sm text-gray-500">点击“生成行程”获取建议</div>
            }
          </div>
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <button onClick={() => planRoute(false)} disabled={routeLoading} className="px-3 py-2 rounded border bg-white disabled:opacity-50">{routeLoading? '规划中...' : '路径规划（AI 地理编码）'}</button>
          {startCoord && endCoord && (
            <span className="text-xs text-gray-500">起点：{startCoord.lng.toFixed(6)},{startCoord.lat.toFixed(6)} → 终点：{endCoord.lng.toFixed(6)},{endCoord.lat.toFixed(6)}</span>
          )}
        </div>
        <MapView destination={destination} onPick={setDestination} startCoord={startCoord} endCoord={endCoord} />
      </div>
    </div>
  )
}
