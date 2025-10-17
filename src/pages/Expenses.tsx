import { useMemo, useState } from 'react'
import VoiceButton from '../components/VoiceButton'

interface Item { id: string; note: string; amount: number }

export default function Expenses() {
  const [items, setItems] = useState<Item[]>([])
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')

  const total = useMemo(()=> items.reduce((s, i)=> s + i.amount, 0), [items])

  function addItem() {
    if (!amount) return
    setItems(prev=>[...prev, { id: crypto.randomUUID(), note, amount: Number(amount)||0 }])
    setNote(''); setAmount('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input className="border rounded px-3 py-2 flex-1" placeholder="备注（如：午餐 拉面）" value={note} onChange={e=>setNote(e.target.value)} />
        <VoiceButton onText={t=>setNote(prev=>prev? prev + ' ' + t : t)} />
      </div>
      <div className="flex items-center gap-2">
        <input className="border rounded px-3 py-2" placeholder="金额（元）" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">添加</button>
      </div>
      <div className="text-sm text-gray-600">合计：{total.toFixed(2)} 元</div>
      <ul className="space-y-2">
        {items.map(i=> (
          <li key={i.id} className="bg-white border rounded p-3 flex justify-between">
            <span>{i.note}</span>
            <span className="font-mono">{i.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
