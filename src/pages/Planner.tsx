import { useEffect, useMemo, useState } from 'react'
import VoiceButton from '../components/VoiceButton'
import MapView from '../components/MapView'
import { llmPlanItinerary } from '../services/llmClient'

export default function Planner() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState('10000')
  const [people, setPeople] = useState(2)
  const [prefs, setPrefs] = useState('美食 动漫 亲子')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState('')

  const prompt = useMemo(() => (
    `目的地: ${destination}\n天数: ${days}\n预算: ${budget}\n人数: ${people}\n日期: ${date}\n偏好: ${prefs}\n请生成详细的每日行程，包含交通、住宿、景点、餐厅和预估费用。`
  ), [destination, days, budget, people, date, prefs])

  async function handleGenerate() {
    setLoading(true)
    try {
      const text = await llmPlanItinerary(prompt)
      setItinerary(text)
    } catch (e: any) {
      alert(e?.message || '生成失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // noop, but ensures component renders map after mount
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="目的地，如：日本东京" value={destination} onChange={e=>setDestination(e.target.value)} />
          <VoiceButton onText={t=>setDestination(prev=>prev? prev + ' ' + t : t)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" className="border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="天数" type="number" value={days} onChange={e=>setDays(Number(e.target.value)||0)} />
          <input className="border rounded px-3 py-2" placeholder="预算(元)" type="number" value={budget} onChange={e=>setBudget(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="人数" type="number" value={people} onChange={e=>setPeople(Number(e.target.value)||1)} />
        </div>
        <textarea className="border rounded px-3 py-2 w-full h-24" placeholder="旅行偏好，如：美食、动漫、亲子" value={prefs} onChange={e=>setPrefs(e.target.value)} />
        <button disabled={loading} onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{loading? '生成中...' : '生成行程'}</button>
        <div>
          <h3 className="font-semibold mb-2">AI 行程建议</h3>
          <pre className="whitespace-pre-wrap text-sm bg-white border rounded p-3 min-h-[160px]">{itinerary || '点击“生成行程”获取建议'}</pre>
        </div>
      </div>
      <div>
        <MapView destination={destination} />
      </div>
    </div>
  )
}
