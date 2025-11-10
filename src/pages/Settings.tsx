import { useEffect, useState } from 'react'
import { getSetting, setSetting } from '../lib/storage'

export default function Settings() {
  const [llmEndpoint, setLlmEndpoint] = useState('')
  const [llmApiKey, setLlmApiKey] = useState('')
  const [amapKey, setAmapKey] = useState('')
  const [amapWebKey, setAmapWebKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
  const [xfyunAppId, setXfyunAppId] = useState('')
  const [xfyunApiKey, setXfyunApiKey] = useState('')
  const [xfyunApiSecret, setXfyunApiSecret] = useState('')
  const xfyunEndpoint = 'https://spark-api-open.xf-yun.com/v2/chat/completions'

  useEffect(() => {
    setLlmEndpoint(getSetting('llmEndpoint')||'')
    setLlmApiKey(getSetting('llmApiKey')||'')
    setAmapKey(getSetting('amapKey')||'')
    setAmapWebKey(getSetting('amapWebKey')||'')
    setSupabaseUrl(getSetting('supabaseUrl')||'')
    setSupabaseAnonKey(getSetting('supabaseAnonKey')||'')
    setXfyunAppId(getSetting('xfyunAppId')||'')
    setXfyunApiKey(getSetting('xfyunApiKey')||'')
    setXfyunApiSecret(getSetting('xfyunApiSecret')||'')
  }, [])

  function save() {
    setSetting('llmEndpoint', llmEndpoint)
    setSetting('llmApiKey', llmApiKey)
    setSetting('amapKey', amapKey)
    setSetting('amapWebKey', amapWebKey)
    setSetting('supabaseUrl', supabaseUrl)
    setSetting('supabaseAnonKey', supabaseAnonKey)
    setSetting('xfyunAppId', xfyunAppId)
    setSetting('xfyunApiKey', xfyunApiKey)
    setSetting('xfyunApiSecret', xfyunApiSecret)
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
        <div className="h-px bg-gray-200 my-2" />
        <label className="grid gap-1">
          <span className="text-sm">科大讯飞 APPID</span>
          <input className="border rounded px-3 py-2" value={xfyunAppId} onChange={e=>setXfyunAppId(e.target.value)} placeholder="你的 APPID" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">科大讯飞 APIKey</span>
          <input className="border rounded px-3 py-2" value={xfyunApiKey} onChange={e=>setXfyunApiKey(e.target.value)} placeholder="你的 APIKey" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">科大讯飞 APISecret</span>
          <input className="border rounded px-3 py-2" value={xfyunApiSecret} onChange={e=>setXfyunApiSecret(e.target.value)} placeholder="你的 APISecret" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">科大讯飞 Chat Completions 接口（参考）</span>
          <input className="border rounded px-3 py-2" value={xfyunEndpoint} readOnly />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">高德 AMap Key</span>
          <input className="border rounded px-3 py-2" value={amapKey} onChange={e=>setAmapKey(e.target.value)} placeholder="amap key" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">高德 Web 服务 Key（路径规划 REST）</span>
          <input className="border rounded px-3 py-2" value={amapWebKey} onChange={e=>setAmapWebKey(e.target.value)} placeholder="仅用于 REST，建议后端代理" />
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
