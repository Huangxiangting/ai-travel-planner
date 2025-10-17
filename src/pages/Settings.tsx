import { useEffect, useState } from 'react'
import { getSetting, setSetting } from '../lib/storage'

export default function Settings() {
  const [llmEndpoint, setLlmEndpoint] = useState('')
  const [llmApiKey, setLlmApiKey] = useState('')
  const [amapKey, setAmapKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')

  useEffect(() => {
    setLlmEndpoint(getSetting('llmEndpoint')||'')
    setLlmApiKey(getSetting('llmApiKey')||'')
    setAmapKey(getSetting('amapKey')||'')
    setSupabaseUrl(getSetting('supabaseUrl')||'')
    setSupabaseAnonKey(getSetting('supabaseAnonKey')||'')
  }, [])

  function save() {
    setSetting('llmEndpoint', llmEndpoint)
    setSetting('llmApiKey', llmApiKey)
    setSetting('amapKey', amapKey)
    setSetting('supabaseUrl', supabaseUrl)
    setSetting('supabaseAnonKey', supabaseAnonKey)
    alert('已保存到本地，仅当前设备可用')
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">请勿在代码仓库中提交任何 Key。此处保存会存入浏览器本地存储。</div>
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">LLM Endpoint（OpenAI 兼容 /v1/chat/completions）</span>
          <input className="border rounded px-3 py-2" value={llmEndpoint} onChange={e=>setLlmEndpoint(e.target.value)} placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">LLM API Key</span>
          <input className="border rounded px-3 py-2" value={llmApiKey} onChange={e=>setLlmApiKey(e.target.value)} placeholder="sk-..." />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">高德 AMap Key</span>
          <input className="border rounded px-3 py-2" value={amapKey} onChange={e=>setAmapKey(e.target.value)} placeholder="amap key" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Supabase URL</span>
          <input className="border rounded px-3 py-2" value={supabaseUrl} onChange={e=>setSupabaseUrl(e.target.value)} placeholder="https://xxxx.supabase.co" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Supabase anon key</span>
          <input className="border rounded px-3 py-2" value={supabaseAnonKey} onChange={e=>setSupabaseAnonKey(e.target.value)} placeholder="ey..." />
        </label>
      </div>
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">保存设置</button>
    </div>
  )
}
