import { useRef, useCallback } from 'react'
import useScrollProgress from './useScrollProgress'
import TimelineBackdrop from './TimelineBackdrop'

// Variação — Linha central com CARTÕES coesos.
// Mesma espinha central, mas cada marco é um cartão consistente; o ativo se
// eleva (fundo sólido, sombra, acento teal). Resolve o "cartão + fantasmas".
export default function TimelineSpineCard({ items }) {
  const list = items || []
  const n = list.length
  const movingRef = useRef(null)
  const fillRef = useRef(null)
  const counterRef = useRef(null)
  const bigYearRef = useRef(null)
  const refs = useRef([])

  const apply = useCallback((p) => {
    if (n === 0) return
    const H = window.innerHeight
    const spacing = H * 0.25
    const activeF = p * (n - 1)
    const centerOffset = H * 0.5 - spacing * 0.5
    if (movingRef.current) movingRef.current.style.transform = `translateY(${centerOffset - activeF * spacing}px)`
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`
    const ai = Math.min(n - 1, Math.max(0, Math.round(activeF)))
    if (counterRef.current) counterRef.current.textContent = String(ai + 1).padStart(2, '0')
    if (bigYearRef.current && list[ai]) {
      const y = (String(list[ai].ano).match(/\d{4}/) || [''])[0]
      if (bigYearRef.current.textContent !== y) bigYearRef.current.textContent = y
    }

    for (let i = 0; i < n; i++) {
      const r = refs.current[i]
      if (!r || !r.root) continue
      const d = Math.abs(i - activeF)
      const active = d < 0.5
      r.root.style.opacity = String(Math.max(0.58, 1 - d * 0.24))
      r.root.style.transform = `scale(${active ? 1 : Math.max(0.95, 1 - d * 0.04)})`
      if (r.card) {
        r.card.style.backgroundColor = active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'
        r.card.style.borderColor = active ? 'rgba(0,180,166,0.35)' : 'rgba(28,28,28,0.07)'
        r.card.style.boxShadow = active ? '0 26px 55px -28px rgba(0,0,0,0.28)' : '0 8px 24px -18px rgba(0,0,0,0.18)'
      }
      if (r.accent) r.accent.style.opacity = active ? '1' : '0'
      if (r.year) r.year.style.color = active ? '#00B4A6' : 'rgba(28,28,28,0.45)'
      if (r.title) r.title.style.color = active ? '#1C1C1C' : 'rgba(28,28,28,0.55)'
      if (r.conn) r.conn.style.backgroundColor = active ? 'rgba(0,180,166,0.7)' : 'rgba(28,28,28,0.12)'
      if (r.node) {
        r.node.style.backgroundColor = active ? '#00B4A6' : '#F5F0EB'
        r.node.style.borderColor = active ? '#00B4A6' : 'rgba(28,28,28,0.25)'
        r.node.style.boxShadow = active ? '0 0 0 5px rgba(0,180,166,0.14)' : 'none'
        r.node.style.transform = `translate(-50%, -50%) scale(${active ? 1.25 : 1})`
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
    <div ref={containerRef} style={{ height: `${Math.max(200, n * 22)}vh` }} className="relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#F4EFE8]">
        <TimelineBackdrop />

        {/* Ano "fantasma" — contorno sutil, muda conforme o scroll */}
        <div
          ref={bigYearRef}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] font-serif leading-none pointer-events-none select-none"
          style={{ fontSize: 'clamp(7rem, 20vw, 16rem)', color: 'transparent', WebkitTextStroke: '1px rgba(28,28,28,0.05)' }}
        ></div>

        {/* Header */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 text-center z-30">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-brand-red"></div>
            <span className="text-brand-red uppercase tracking-[0.22em] text-[11px] font-bold">Trajetória e Impacto</span>
            <div className="w-8 h-px bg-brand-red"></div>
          </div>
        </div>
        <div className="absolute top-9 right-6 sm:right-12 z-30 font-serif text-sm tracking-widest">
          <span ref={counterRef} className="text-brand-red text-lg">01</span>
          <span className="text-brand-gray"> / {String(n).padStart(2, '0')}</span>
        </div>

        {/* Spine */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-brand-dark/10 md:-translate-x-1/2"></div>
        <div ref={fillRef} className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-red/70 to-brand-red/20 md:-translate-x-1/2 origin-top" style={{ transform: 'scaleY(0)' }}></div>
        <div className="absolute left-8 md:left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-red/25 z-10"></div>

        {/* Moving stack */}
        <div ref={movingRef} className="absolute left-0 top-0 w-full will-change-transform z-10">
          {list.map((item, i) => {
            const even = i % 2 === 0
            return (
              <div
                key={item.id || i}
                ref={setRef(i, 'root')}
                className="absolute left-0 w-full flex items-center will-change-transform"
                style={{ top: `${i * 25}vh`, height: '25vh', opacity: 0 }}
              >
                <div ref={setRef(i, 'node')} className="absolute left-8 md:left-1/2 top-1/2 w-3.5 h-3.5 rounded-full border-2 z-20" style={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(28,28,28,0.25)', transform: 'translate(-50%, -50%)' }}></div>
                <div ref={setRef(i, 'conn')} className={`absolute top-1/2 h-px z-10 -translate-y-1/2 w-6 left-8 md:w-8 ${even ? 'md:left-auto md:right-1/2' : 'md:left-1/2'}`} style={{ backgroundColor: 'rgba(28,28,28,0.12)' }}></div>

                {/* Card */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-[4rem] right-4 md:w-[40%] ${even ? 'md:left-auto md:right-[calc(50%+2rem)]' : 'md:right-auto md:left-[calc(50%+2rem)]'}`}>
                  <div
                    ref={setRef(i, 'card')}
                    className="relative overflow-hidden rounded-2xl border px-6 py-5 md:px-7 md:py-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'rgba(28,28,28,0.07)', boxShadow: '0 8px 24px -18px rgba(0,0,0,0.18)' }}
                  >
                    <div ref={setRef(i, 'accent')} className={`absolute top-0 bottom-0 w-1 bg-brand-red ${even ? 'right-0' : 'left-0'}`} style={{ opacity: 0 }}></div>
                    <div ref={setRef(i, 'year')} className="font-serif text-2xl md:text-4xl leading-none mb-2 tracking-tight" style={{ color: 'rgba(28,28,28,0.45)' }}>{item.ano}</div>
                    <h3 ref={setRef(i, 'title')} className="font-serif text-lg md:text-xl mb-1.5 leading-snug" style={{ color: 'rgba(28,28,28,0.55)' }}>{item.titulo}</h3>
                    <p className="text-sm text-brand-dark/55 leading-relaxed">{item.descricao}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gray/45 text-[10px] uppercase tracking-[0.2em] z-30">role para avançar</div>
      </div>
    </div>
  )
}
