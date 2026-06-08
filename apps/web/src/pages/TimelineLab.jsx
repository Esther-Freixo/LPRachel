import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTimeline } from '../store/data'
import useData from '../hooks/useData'
import TimelineTrail from '../components/timeline/TimelineTrail'
import TimelineFocus from '../components/timeline/TimelineFocus'
import TimelineEditorial from '../components/timeline/TimelineEditorial'
import TimelineSpineCard from '../components/timeline/TimelineSpineCard'
import TimelineHorizontal from '../components/timeline/TimelineHorizontal'
import StickyTimelineClassic from '../components/StickyTimelineClassic'

const VARIANTS = [
  { key: 'trilha', label: 'Trilha', Comp: TimelineTrail },
  { key: 'linha', label: 'Linha', Comp: TimelineEditorial },
  { key: 'cartao', label: 'Cartão', Comp: TimelineSpineCard },
  { key: 'foco', label: 'Foco', Comp: TimelineFocus },
  { key: 'horizontal', label: 'Horizontal', Comp: TimelineHorizontal },
  { key: 'atual', label: 'Atual (v1)', Comp: StickyTimelineClassic },
]

export default function TimelineLab() {
  const { data: timeline } = useData(getTimeline)
  const [active, setActive] = useState('trilha')

  useEffect(() => { window.scrollTo(0, 0) }, [active])

  const items = timeline || []
  const current = VARIANTS.find((v) => v.key === active) || VARIANTS[0]
  const Comp = current.Comp

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Switcher bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-brand-bg/85 backdrop-blur-md border-b border-brand-dark/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <span className="font-serif italic text-base text-brand-dark hidden sm:block">Timeline · comparação</span>
          <div className="flex items-center gap-1 p-1 rounded-full bg-brand-dark/[0.04]">
            {VARIANTS.map((v) => (
              <button
                key={v.key}
                onClick={() => setActive(v.key)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  active === v.key ? 'bg-brand-dark text-white' : 'text-brand-gray hover:text-brand-dark'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <Link to="/" className="text-xs uppercase tracking-wider font-bold text-brand-gray hover:text-brand-red transition-colors hidden sm:block">
            ← Site
          </Link>
        </div>
      </div>

      {/* Selected variant */}
      <div className="pt-14">
        {items.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-brand-gray">Carregando dados…</div>
        ) : (
          <Comp items={items} />
        )}
      </div>

      {/* Tail so the last sticky section can finish scrolling */}
      <div className="h-screen flex flex-col items-center justify-center bg-brand-dark text-white gap-4">
        <p className="font-serif text-3xl">Fim da trajetória</p>
        <p className="text-brand-gray text-sm uppercase tracking-widest">Troque a variação no topo ↑</p>
      </div>
    </div>
  )
}
