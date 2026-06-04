import { useEffect, useRef, useState } from 'react'
import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'

const fas = initApp({ appId: 'mcp-live-demo' })

type Phase = 'idle' | 'waiting' | 'ready' | 'result' | 'tooSoon'

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [ms, setMs] = useState(0)
  const [best, setBest] = useState<number | null>(() => {
    const v = localStorage.getItem('rt-best'); return v ? Number(v) : null
  })
  const [attempts, setAttempts] = useState<number[]>([])
  const startRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function start() {
    setPhase('waiting')
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('ready')
    }, 1000 + Math.random() * 3000)
  }

  function handleClick() {
    if (phase === 'idle' || phase === 'result' || phase === 'tooSoon') { start(); return }
    if (phase === 'waiting') { if (timerRef.current) clearTimeout(timerRef.current); setPhase('tooSoon'); return }
    if (phase === 'ready') {
      const t = Math.round(performance.now() - startRef.current)
      setMs(t)
      setAttempts((a) => [t, ...a].slice(0, 5))
      if (best === null || t < best) { setBest(t); localStorage.setItem('rt-best', String(t)) }
      setPhase('result')
    }
  }

  const bg = phase === 'ready' ? 'var(--mint)' : phase === 'waiting' ? 'var(--error)' : 'var(--panel)'
  const fg = phase === 'ready' || phase === 'waiting' ? '#fff' : 'var(--ink)'
  const headline =
    phase === 'idle' ? 'Tap to start' :
    phase === 'waiting' ? 'Wait for green…' :
    phase === 'ready' ? 'TAP!' :
    phase === 'tooSoon' ? 'Too soon — tap to retry' :
    `${ms} ms`
  const sub =
    phase === 'result' ? (best === ms ? '🏆 New best!' : `Best: ${best} ms`) :
    phase === 'idle' && best !== null ? `Best: ${best} ms` : ''
  const avg = attempts.length ? Math.round(attempts.reduce((s, x) => s + x, 0) / attempts.length) : null

  return (
    <Shell app={fas} appName="Reaction Time">
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <button
          onClick={handleClick}
          className="display-font flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-[var(--line)] shadow-sm transition-colors"
          style={{ background: bg, color: fg, minHeight: '46vh', cursor: 'pointer' }}
        >
          <span className="text-4xl font-bold">{headline}</span>
          {sub && <span className="mt-3 text-base opacity-90">{sub}</span>}
        </button>
        {attempts.length > 0 && (
          <div className="mt-6 w-full max-w-md text-center text-[var(--muted)]">
            <div className="text-sm">Last 5: {attempts.map((a) => `${a}ms`).join('  ·  ')}</div>
            {avg !== null && <div className="mt-1 text-sm">Average: {avg} ms</div>}
          </div>
        )}
        <p className="mt-6 max-w-md text-center text-xs text-[var(--muted)]">
          Tap to start, wait for green, then tap as fast as you can. Built entirely via the FreeAppStore MCP.
        </p>
      </div>
      <BuildInfo />
    </Shell>
  )
}
