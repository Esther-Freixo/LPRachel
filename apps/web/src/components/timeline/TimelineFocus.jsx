import { useRef, useCallback } from 'react'
import useScrollProgress from './useScrollProgress'

// Variação 1 — Coluna única "em foco".
// Um spine à esquerda; o marco ativo fica grande e nítido no centro da tela,
// vizinhos pequenos/desfocados acima e abaixo. Scroll traz cada um ao centro.
export default function TimelineFocus({ items }) {
  const list = items || []
  const n = list.length
  const movingRef = useRef(null)
  const dotRef = useRef(null)
  const counterRef = useRef(null)
  const refs = useRef([])

  const apply = useCallback((p) => {
    if (n === 0) return
    const H = window.innerHeight
    const spacing = H * 0.34
    const activeF = p * (n - 1)
    const centerOffset = H * 0.5 - spacing * 0.5

    if (movingRef.current) {
      movingRef.current.style.transform = `translateY(${centerOffset - activeF * spacing}px)`
    }
    const activeIdx = Math.round(activeF)
    if (counterRef.current) {
      counterRef.current.textContent = String(Math.min(n, activeIdx + 1)).padStart(2, '0')
    }
    if (dotRef.current) {
      const frac = Math.abs(activeF - activeIdx)
      dotRef.current.style.transform = `translate(-50%, -50%) scale(${1 + (0.45 - frac) * 0.4})`
    }

    for (let i = 0; i < n; i++) {
      const r = refs.current[i]
      if (!r || !r.root) continue
      const d = i - activeF
      const ad = Math.abs(d)
      const scale = Math.max(0.74, 1 - ad * 0.16)
      const opacity = Math.max(0, 1 - ad * 0.5)
      const blur = Math.min(5, ad * 1.8)
      const active = ad < 0.5
      r.root.style.opacity = opacity
      r.root.style.transform = `scale(${scale})`
      r.root.style.filter = blur > 0.2 ? `blur(${blur}px)` : 'none'
      if (r.desc) r.desc.style.opacity = active ? String(1 - ad * 2) : '0'
      if (r.year) r.year.style.color = active ? '#00B4A6' : 'rgba(28,28,28,0.45)'
      if (r.title) r.title.style.color = active ? '#1C1C1C' : 'rgba(28,28,28,0.55)'
      if (r.node) {
        r.node.style.backgroundColor = active ? '#00B4A6' : 'rgba(0,180,166,0.25)'
        r.node.style.transform = `scale(${active ? 1.4 : 1})`
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
    <div ref={containerRef} style={{ height: `${Math.max(220, n * 26)}vh` }} className="relative w-full">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(0,180,166,0.07) 0%, transparent 60%), #F5F0EB' }}
      >
        {/* Section label */}
        <div className="absolute top-10 left-8 sm:left-20 z-30 flex items-center gap-3">
          <div className="w-8 h-px bg-brand-red"></div>
          <span className="text-brand-red uppercase tracking-[0.2em] text-xs font-bold">Trajetória</span>
        </div>

        {/* Progress counter */}
        <div className="absolute top-10 right-8 sm:right-20 z-30 font-serif text-brand-dark/70 text-sm tracking-widest">
          <span ref={counterRef} className="text-brand-red text-lg">01</span>
          <span className="text-brand-gray"> / {String(n).padStart(2, '0')}</span>
        </div>

        {/* Spine */}
        <div className="absolute left-8 sm:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-dark/12 to-transparent"></div>
        {/* Active node fixed at center */}
        <div ref={dotRef} className="absolute left-8 sm:left-20 top-1/2 z-20 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red shadow-[0_0_14px_rgba(0,180,166,0.6)]"></div>
        {/* Focus guides */}
        <div className="absolute left-8 sm:left-20 top-1/2 -translate-y-1/2 w-6 sm:w-10 h-px bg-brand-red/40 z-10"></div>

        {/* Moving stack */}
        <div ref={movingRef} className="absolute left-0 top-0 w-full will-change-transform">
          {list.map((item, i) => (
            <div
              key={item.id || i}
              ref={setRef(i, 'root')}
              className="absolute left-0 w-full will-change-transform"
              style={{ top: `${i * 34}vh`, height: '34vh', transformOrigin: 'left center', opacity: 0 }}
            >
              <div className="h-full flex items-center pl-16 sm:pl-32 pr-6 sm:pr-20 max-w-4xl">
                <div className="relative">
                  <div ref={setRef(i, 'node')} className="absolute -left-[34px] sm:-left-[49px] top-3 w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(0,180,166,0.25)' }}></div>
                  <div ref={setRef(i, 'year')} className="font-serif text-4xl sm:text-6xl leading-none mb-3 tracking-tight" style={{ color: 'rgba(28,28,28,0.45)' }}>{item.ano}</div>
                  <h3 ref={setRef(i, 'title')} className="font-serif text-xl sm:text-3xl mb-3 leading-snug" style={{ color: 'rgba(28,28,28,0.55)' }}>{item.titulo}</h3>
                  <p ref={setRef(i, 'desc')} className="text-sm sm:text-base text-brand-dark/60 leading-relaxed max-w-xl" style={{ opacity: 0 }}>{item.descricao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gray/50 text-[10px] uppercase tracking-[0.2em] z-30">role para avançar</div>
      </div>
    </div>
  )
}
