import { useEffect, useId, useRef } from 'react'
import { loadAMap } from '../lib/amapLoader'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function DestinationInput({ value, onChange, placeholder }: Props) {
  const inputId = useId().replace(/:/g, '-')
  const acRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false
    async function init() {
      const AMap = await loadAMap()
      if (!AMap || disposed) return
      const AutoComp = (AMap as any).AutoComplete || (AMap as any).Autocomplete
      if (!AutoComp) return
      const ac = new AutoComp({ input: inputId })
      ac.on('select', (e: any) => {
        const name: string = e?.poi?.name || ''
        const district: string = e?.poi?.district || ''
        const display = (district && name) ? `${district}${name}` : (name || district)
        if (display) onChange(display)
      })
      acRef.current = ac
    }
    init()
    return () => {
      disposed = true
      try { acRef.current?.off?.('select'); acRef.current = null } catch {}
    }
  }, [inputId, onChange])

  return (
    <input id={inputId} className="border rounded px-3 py-2 flex-1" placeholder={placeholder || '目的地，如：日本东京'} value={value} onChange={e=>onChange(e.target.value)} />
  )
}
