import { getSetting } from '../lib/storage'

export async function llmPlanItinerary(userPrompt: string): Promise<string> {
  const endpoint = getSetting('llmEndpoint')
  const apiKey = getSetting('llmApiKey')
  if (!endpoint || !apiKey) throw new Error('请先在设置页填写 LLM Endpoint 和 API Key')
  const url = endpoint.replace(/\/$/, '') + '/v1/chat/completions'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: '你是旅行规划助理，请根据用户需求输出结构化、清晰、逐日的行程和费用估算。' },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error('LLM 请求失败: ' + text)
  }
  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content || ''
  return content
}

export async function llmGeocode(address: string): Promise<{ lng: number, lat: number } | null> {
  const endpoint = getSetting('llmEndpoint')
  const apiKey = getSetting('llmApiKey')
  if (!endpoint || !apiKey) throw new Error('请先在设置页填写 LLM Endpoint 和 API Key')
  const url = endpoint.replace(/\/$/, '') + '/v1/chat/completions'
  const prompt = `把下面地点转换为经纬度（WGS84 或通用地图坐标系皆可），精确到小数点后6位，只输出 JSON：{"lng": number, "lat": number}，不要任何其它文字。地点：${address}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: '你是地理编码助手。回复必须是有效 JSON。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  })
  if (!res.ok) return null
  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content || ''
  try {
    const obj = JSON.parse(content)
    if (typeof obj?.lng === 'number' && typeof obj?.lat === 'number') {
      const lng = Number(obj.lng.toFixed(6))
      const lat = Number(obj.lat.toFixed(6))
      return { lng, lat }
    }
  } catch {}
  return null
}
