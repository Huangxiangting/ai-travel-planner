import { useEffect, useRef, useState } from 'react'

interface Props { onText: (text: string) => void }

export default function VoiceButton({ onText }: Props) {
  const [recording, setRecording] = useState(false)
  const recRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.lang = 'zh-CN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onText(text)
    }
    rec.onend = () => setRecording(false)
    recRef.current = rec
  }, [onText])

  function toggle() {
    const rec = recRef.current
    if (!rec) { alert('当前浏览器不支持本地语音识别，请在设置页使用文字输入或第三方语音 API。'); return }
    if (recording) { rec.stop(); setRecording(false); }
    else { rec.start(); setRecording(true); }
  }

  return (
    <button onClick={toggle} className={`px-3 py-2 rounded border ${recording? 'bg-red-50 border-red-200' : 'bg-white'}`}>{recording? '停止' : '语音'}</button>
  )
}
