import { useRef, useCallback } from 'react'
import useScrollProgress from './useScrollProgress'

// Variação 3 — Horizontal cinematográfico.
// O scroll vertical desliza a linha do tempo de lado; o marco central cresce
// em foco. Itens em zigue-zague acima/abaixo de um eixo horizontal.
export default function TimelineHorizontal({ items }) {
  const list = items || []
  const n = list.length
  const movingRef = useRef(null)
  const barRef = useRef(null)
  const refs = useRef([])

  const apply = useCallback((p) => {
    if (n === 0) return
    const W = window.innerWidth
    const spacing = W * (W < 768 ? 0.82 : 0.46)
    const activeF = p * (n - 1)
    if (movingRef.current) {
      movingRef.current.style.transform = `translateX(${W * 0.5 - activeF * spacing}px)`
    }
    if (barRef.current) barRef.current.style.width = `${p * 100}%`

    for (let i = 0; i < n; i++) {
      const r = refs.current[i]
      if (!r || !r.root) continue
      const d = Math.abs(i - activeF)
      const active = d < 0.5
      r.root.style.opacity = String(Math.max(0, 1 - d * 0.5))
      if (r.inner) r.inner.style.transform = `scale(${Math.max(0.62, 1 - d * 0.26)})`
      if (r.year) r.year.style.color = active ? '#00B4A6' : 'rgba(28,28,28,0.4)'
      if (r.title) r.title.style.color = active ? '#1C1C1C' : 'rgba(28,28,28,0.5)'
      if (r.desc) r.desc.style.opacity = active ? '1' : '0'
      if (r.node) {
        r.node.style.backgroundColor = active ? '#00B4A6' : '#FFFFFF'
        r.node.style.transform = `translate(-50%, -50%) scale(${active ? 1.5 : 1})`
      }
      if (r.stem) r.stem.style.opacity = active ? '0.5' : '0.18'
    }
  }, [n])

  const containerRef = useScrollProgress(apply)
  if (n === 0) return null

  const setRef = (i, key) => (el) => {
    if (!refs.current[i]) refs.current[i] = {}
    refs.current[i][key] = el
  }

  return (
    <div ref={containerRef} style={{ height: `${Math.max(200, n * 22)}vh` }} className="relative w-full">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(0,180,166,0.08) 0%, transparent 60%), #F5F0EB' }}
      >
        {/* Title */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-30">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-brand-red"></div>
            <span className="text-brand-red uppercase tracking-[0.2em] text-xs font-bold">Trajetória e Impacto</span>
            <div className="w-8 h-px bg-brand-red"></div>
          </div>
        </div>

        {/* Horizontal axis */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-dark/12"></div>
        {/* Center focus marker */}
        <div className="absolute top-1/2 left-1/2 w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-red/30 z-10"></div>

        {/* Moving row */}
        <div ref={movingRef} className="absolute top-0 left-0 h-full will-change-transform">
          {list.map((item, i) => {
            const above = i % 2 === 0
            return (
              <div
                key={item.id || i}
                ref={setRef(i, 'root')}
                className="absolute top-0 h-full"
                style={{ left: `${i * (window.innerWidth < 768 ? 82 : 46)}vw`, width: '1px', opacity: 0 }}
              >
                {/* Node on axis */}
                <div
                  ref={setRef(i, 'node')}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full border-2 border-brand-red z-20"
                  style={{ backgroundColor: '#FFFFFF', transform: 'translate(-50%, -50%)' }}
                ></div>
                {/* Stem */}
                <div
                  ref={setRef(i, 'stem')}
                  className={`absolute left-1/2 -translate-x-1/2 w-px bg-brand-red ${above ? 'bottom-1/2 h-[14vh]' : 'top-1/2 h-[14vh]'}`}
                  style={{ opacity: 0.18 }}
                ></div>
                {/* Card */}
                <div
                  ref={setRef(i, 'inner')}
                  className={`absolute left-1/2 -translate-x-1/2 w-[78vw] sm:w-[36vw] max-w-md text-center ${above ? 'bottom-1/2 mb-[16vh]' : 'top-1/2 mt-[16vh]'}`}
                  style={{ transformOrigin: above ? 'center bottom' : 'center top' }}
                >
                  <div ref={setRef(i, 'year')} className="font-serif text-3xl sm:text-5xl leading-none mb-2 tracking-tight" style={{ color: 'rgba(28,28,28,0.4)' }}>{item.ano}</div>
                  <h3 ref={setRef(i, 'title')} className="font-serif text-lg sm:text-2xl mb-2 leading-snug" style={{ color: 'rgba(28,28,28,0.5)' }}>{item.titulo}</h3>
                  <p ref={setRef(i, 'desc')} className="text-sm text-brand-dark/55 leading-relaxed" style={{ opacity: 0 }}>{item.descricao}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-px bg-brand-dark/15 z-30">
          <div ref={barRef} className="h-full bg-brand-red" style={{ width: '0%' }}></div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-gray/50 text-[10px] uppercase tracking-[0.2em] z-30">role para avançar</div>
      </div>
    </div>
  )
}
