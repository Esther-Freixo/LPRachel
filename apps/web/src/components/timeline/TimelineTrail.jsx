import { useRef, useState, useEffect } from 'react'

// Variação — "Trilha": a linha central vira uma curva orgânica que se DESENHA
// em teal conforme o scroll. Marcos são nós sobre a curva (alternando lados);
// um ponto de luz viaja pela trilha. O interesse vem da própria linha.

const TOP = 200
const SPACING = 250
const BOT = 260

function smoothPath(p) {
  if (p.length < 2) return ''
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export default function TimelineTrail({ items }) {
  const list = items || []
  const n = list.length

  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const drawRef = useRef(null)
  const dotRef = useRef(null)
  const glowRef = useRef(null)
  const itemRefs = useRef([])

  const [geo, setGeo] = useState({ w: 0, h: 0, cx: 0, mobile: false, pts: [], d: '' })

  // Build geometry (path + node points) on mount and resize
  useEffect(() => {
    if (n === 0) return
    const build = () => {
      const w = wrapRef.current?.clientWidth || window.innerWidth
      const mobile = w < 768
      const h = TOP + (n - 1) * SPACING + BOT
      const cx = mobile ? 40 : w / 2
      const amp = mobile ? 0 : Math.min(230, w * 0.17)
      const pts = []
      for (let i = 0; i < n; i++) {
        const y = TOP + i * SPACING
        const x = mobile ? cx : cx + (i % 2 === 0 ? -amp : amp)
        pts.push({ x, y, left: i % 2 === 0 })
      }
      const anchors = [{ x: cx, y: 0 }, ...pts, { x: cx, y: h }]
      setGeo({ w, h, cx, mobile, pts, d: smoothPath(anchors) })
    }
    build()
    window.addEventListener('resize', build)
    return () => window.removeEventListener('resize', build)
  }, [n])

  // Scroll: draw progress, traveling dot, active highlight
  useEffect(() => {
    if (!geo.d || !pathRef.current) return
    const len = pathRef.current.getTotalLength()
    if (drawRef.current) drawRef.current.style.strokeDasharray = `${len}`

    const target = { v: 0 }
    const cur = { v: 0 }
    let raf

    const onScroll = () => {
      const rect = wrapRef.current.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      target.v = Math.max(0, Math.min(1, -rect.top / range))
    }

    const tick = () => {
      cur.v += (target.v - cur.v) * 0.12
      const p = cur.v
      if (drawRef.current) drawRef.current.style.strokeDashoffset = `${len * (1 - p)}`
      if (dotRef.current && glowRef.current) {
        const pt = pathRef.current.getPointAtLength(len * p)
        dotRef.current.setAttribute('cx', pt.x)
        dotRef.current.setAttribute('cy', pt.y)
        glowRef.current.setAttribute('cx', pt.x)
        glowRef.current.setAttribute('cy', pt.y)
      }
      // active = node nearest viewport center
      const wrapTop = wrapRef.current.getBoundingClientRect().top
      const centerY = window.innerHeight / 2
      let best = -1, bestD = Infinity
      for (let i = 0; i < geo.pts.length; i++) {
        const screenY = wrapTop + geo.pts[i].y
        const d = Math.abs(screenY - centerY)
        if (d < bestD) { bestD = d; best = i }
      }
      for (let i = 0; i < geo.pts.length; i++) {
        const r = itemRefs.current[i]
        if (!r) continue
        const active = i === best
        const screenY = wrapTop + geo.pts[i].y
        const dist = Math.abs(screenY - centerY) / window.innerHeight
        const op = Math.max(0.32, 1 - dist * 1.1)
        if (r.box) { r.box.style.opacity = String(op); r.box.style.transform = `scale(${active ? 1 : Math.max(0.92, 1 - dist * 0.18)})` }
        if (r.year) r.year.style.color = active ? '#00B4A6' : 'rgba(28,28,28,0.5)'
        if (r.title) r.title.style.color = active ? '#1C1C1C' : 'rgba(28,28,28,0.55)'
        if (r.node) {
          r.node.setAttribute('r', active ? 9 : 5)
          r.node.style.fill = active ? '#00B4A6' : '#F4EFE8'
          r.node.style.stroke = active ? '#00B4A6' : 'rgba(0,180,166,0.45)'
        }
        if (r.ring) r.ring.style.opacity = active ? '1' : '0'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [geo])

  if (n === 0) return null

  const setRef = (i, key) => (el) => {
    if (!itemRefs.current[i]) itemRefs.current[i] = {}
    itemRefs.current[i][key] = el
  }

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ height: geo.h || '100vh', background: 'linear-gradient(160deg, #F5F1EA 0%, #F1EBE2 100%)' }}>
      {/* soft ambient glow */}
      <div className="absolute top-[12%] -left-[5%] w-[480px] h-[480px] rounded-full bg-brand-red/[0.07] blur-[150px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[10%] -right-[5%] w-[420px] h-[420px] rounded-full bg-brand-red/[0.06] blur-[140px] pointer-events-none animate-float-delayed"></div>

      {/* Sticky header */}
      <div className="sticky top-0 z-30 pt-8 pb-4 text-center pointer-events-none">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-brand-red"></div>
          <span className="text-brand-red uppercase tracking-[0.22em] text-[11px] font-bold">Trajetória e Impacto</span>
          <div className="w-8 h-px bg-brand-red"></div>
        </div>
      </div>

      {/* The trail */}
      {geo.d && (
        <svg className="absolute inset-0 w-full pointer-events-none" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" style={{ top: 0 }}>
          <defs>
            <linearGradient id="trail-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B4A6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00B4A6" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {/* base path */}
          <path ref={pathRef} d={geo.d} stroke="rgba(28,28,28,0.10)" strokeWidth="2" />
          {/* drawn (progress) path */}
          <path ref={drawRef} d={geo.d} stroke="url(#trail-grad)" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: 0, strokeDashoffset: 0 }} />
          {/* milestone nodes */}
          {geo.pts.map((pt, i) => (
            <g key={i}>
              <circle ref={setRef(i, 'ring')} cx={pt.x} cy={pt.y} r="16" fill="none" stroke="rgba(0,180,166,0.25)" strokeWidth="1" style={{ opacity: 0 }} />
              <circle ref={setRef(i, 'node')} cx={pt.x} cy={pt.y} r="5" style={{ fill: '#F4EFE8', stroke: 'rgba(0,180,166,0.45)', strokeWidth: 2 }} />
            </g>
          ))}
          {/* traveling glow + dot */}
          <circle ref={glowRef} cx={geo.cx} cy={TOP} r="14" fill="#00B4A6" opacity="0.18" />
          <circle ref={dotRef} cx={geo.cx} cy={TOP} r="5" fill="#00B4A6" />
        </svg>
      )}

      {/* milestone content */}
      {geo.pts.map((pt, i) => {
        const left = pt.left && !geo.mobile // node on left → content to the right
        const mobile = geo.mobile
        const contentLeft = mobile ? pt.x + 28 : left ? pt.x + 34 : null
        const contentRight = !mobile && !left ? geo.w - pt.x + 34 : null
        return (
          <div
            key={i}
            ref={setRef(i, 'box')}
            className="absolute will-change-transform"
            style={{
              top: pt.y,
              left: contentLeft != null ? contentLeft : undefined,
              right: contentRight != null ? contentRight : undefined,
              transform: 'translateY(-50%)',
              width: mobile ? `calc(100% - ${pt.x + 28}px - 16px)` : 340,
              textAlign: mobile ? 'left' : left ? 'left' : 'right',
              opacity: 0,
            }}
          >
            <div ref={setRef(i, 'year')} className="font-serif text-3xl md:text-5xl leading-none tracking-tight mb-2" style={{ color: 'rgba(28,28,28,0.5)' }}>{list[i].ano}</div>
            <h3 ref={setRef(i, 'title')} className="font-serif text-lg md:text-2xl mb-1.5 leading-snug" style={{ color: 'rgba(28,28,28,0.55)' }}>{list[i].titulo}</h3>
            <p className="text-sm md:text-[15px] text-brand-dark/55 leading-relaxed">{list[i].descricao}</p>
          </div>
        )
      })}
    </div>
  )
}
