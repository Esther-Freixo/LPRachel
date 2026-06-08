import { useRef, useCallback } from 'react'
import useScrollProgress from './useScrollProgress'

// Variação 2 — Editorial alternado.
// Spine central, cards alternando esquerda/direita, ano grande em serif como
// âncora. Evolução refinada da timeline atual. Mobile: coluna única à esquerda.
export default function TimelineEditorial({ items }) {
  const list = items || []
  const n = list.length
  const movingRef = useRef(null)
  const refs = useRef([])

  const apply = useCallback((p) => {
    if (n === 0) return
    const H = window.innerHeight
    const spacing = H * 0.32
    const activeF = p * (n - 1)
    const centerOffset = H * 0.5 - spacing * 0.5
    if (movingRef.current) {
      movingRef.current.style.transform = `translateY(${centerOffset - activeF * spacing}px)`
    }
    for (let i = 0; i < n; i++) {
      const r = refs.current[i]
      if (!r || !r.root) continue
      const d = Math.abs(i - activeF)
      const active = d < 0.5
      r.root.style.opacity = String(Math.max(0.12, 1 - d * 0.5))
      r.root.style.transform = `scale(${Math.max(0.86, 1 - d * 0.09)})`
      if (r.year) r.year.style.color = active ? '#00B4A6' : 'rgba(28,28,28,0.4)'
      if (r.title) r.title.style.color = active ? '#1C1C1C' : 'rgba(28,28,28,0.5)'
      if (r.card) {
        r.card.style.backgroundColor = active ? '#FFFFFF' : 'transparent'
        r.card.style.borderColor = active ? '#ECE7E0' : 'transparent'
        r.card.style.boxShadow = active ? '0 24px 50px -24px rgba(0,0,0,0.22)' : 'none'
      }
      if (r.node) {
        r.node.style.backgroundColor = active ? '#00B4A6' : '#FFFFFF'
        r.node.style.borderColor = active ? '#00B4A6' : 'rgba(0,180,166,0.4)'
        r.node.style.transform = `translate(-50%, -50%) scale(${active ? 1.35 : 1})`
      }
    }
  }, [n])

  const containerRef = useScrollProgress(apply)
  if (n === 0) return null

  const setRef = (i, key) => (el) => {
    if (!refs.current[i]) refs.current[i] = {}
    refs.current[i][key] = el
  }

  return (
    <div ref={containerRef} style={{ height: `${Math.max(220, n * 24)}vh` }} className="relative w-full">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,180,166,0.06) 0%, transparent 60%), #F5F0EB' }}
      >
        {/* Title */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-30 w-full px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-px bg-brand-red"></div>
            <span className="text-brand-red uppercase tracking-[0.2em] text-xs font-bold">Trajetória e Impacto</span>
            <div className="w-8 h-px bg-brand-red"></div>
          </div>
        </div>

        {/* Spine */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-dark/12 to-transparent md:-translate-x-1/2"></div>
        {/* Focus ring at center */}
        <div className="absolute left-8 md:left-1/2 top-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-red/30 z-10"></div>

        {/* Moving stack */}
        <div ref={movingRef} className="absolute left-0 top-0 w-full will-change-transform">
          {list.map((item, i) => {
            const even = i % 2 === 0
            return (
              <div
                key={item.id || i}
                ref={setRef(i, 'root')}
                className="absolute left-0 w-full flex items-center will-change-transform"
                style={{ top: `${i * 32}vh`, height: '32vh', opacity: 0 }}
              >
                {/* Node on spine */}
                <div
                  ref={setRef(i, 'node')}
                  className="absolute left-8 md:left-1/2 top-1/2 w-3 h-3 rounded-full border-2 z-20"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,180,166,0.4)', transform: 'translate(-50%, -50%)' }}
                ></div>

                {/* Card */}
                <div
                  className={`absolute w-[calc(100%-5rem)] md:w-[42%] ${even ? 'left-16 md:left-auto md:right-1/2 md:mr-10 md:text-right' : 'left-16 md:left-1/2 md:ml-10 md:text-left'}`}
                >
                  <div
                    ref={setRef(i, 'card')}
                    className="rounded-2xl border px-6 py-5 md:px-8 md:py-6 transition-colors"
                    style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                  >
                    <div ref={setRef(i, 'year')} className="font-serif text-3xl md:text-5xl leading-none mb-2 tracking-tight" style={{ color: 'rgba(28,28,28,0.4)' }}>{item.ano}</div>
                    <h3 ref={setRef(i, 'title')} className="font-serif text-lg md:text-2xl mb-2 leading-snug" style={{ color: 'rgba(28,28,28,0.5)' }}>{item.titulo}</h3>
                    <p className="text-sm md:text-[15px] text-brand-dark/55 leading-relaxed">{item.descricao}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gray/50 text-[10px] uppercase tracking-[0.2em] z-30">role para avançar</div>
      </div>
    </div>
  )
}
