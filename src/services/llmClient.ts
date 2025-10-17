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
