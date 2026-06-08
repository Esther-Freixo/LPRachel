import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// StickyTimeline — VERSÃO PRESERVADA (v1 "classic")
// Cópia fiel da timeline original da Home, mantida como fallback/backup.
// Para reverter a Home a esta versão: importe StickyTimelineClassic em Home.jsx.
// DOM-driven (no React re-renders per frame).
// ─────────────────────────────────────────────────────────────────────────────
export default function StickyTimelineClassic({ items }) {
  const containerRef = useRef(null)
  const movingRef = useRef(null)
  const cometRef = useRef(null)
  const titleRef = useRef(null)
  const viewportRef = useRef(null)
  const itemRefs = useRef([])

  const timelineItems = items || [];

  useEffect(() => {
    const n = timelineItems.length;
    if (!containerRef.current || n === 0) return;

    const WINDOW = 0.35;
    const isMobile = window.innerWidth < 768;
    const MOB_WINDOW = 0.18;
    const target = { v: 0 };
    const current = { v: 0 };
    let rafId;

    const applyProgress = (p) => {
      if (movingRef.current)
        movingRef.current.style.transform = `translateY(-${p * 100}%)`;

      if (cometRef.current)
        cometRef.current.style.opacity = Math.min(1, p * 15);

      if (titleRef.current) {
        const sc = p > 0.02;
        titleRef.current.style.opacity = sc ? '0' : '1';
        titleRef.current.style.transform = sc ? 'translateY(-20px)' : 'translateY(0)';
        titleRef.current.style.pointerEvents = sc ? 'none' : 'auto';
      }
      if (viewportRef.current)
        viewportRef.current.style.height = p > 0.02 ? 'calc(100vh - 5rem)' : '60vh';

      const win = isMobile ? MOB_WINDOW : WINDOW;

      for (let i = 0; i < n; i++) {
        const r = itemRefs.current[i];
        if (!r) continue;
        const sd = p - i / Math.max(1, n - 1);
        const ad = Math.abs(sd);
        const isActive = ad < (isMobile ? 0.06 : 0.14);
        const opacity = ad < win ? Math.pow(1 - ad / win, isMobile ? 2.5 : 1.2) : 0;
        const scale = isActive ? 1 : Math.max(0.92, 1 - ad * 0.35);

        if (r.wrap) { r.wrap.style.opacity = opacity; r.wrap.style.transform = `scale(${scale})`; }
        if (r.conn) {
          r.conn.style.opacity = opacity;
          r.conn.style.transform = `scaleX(${scale})`;
          const c = isActive ? 'rgba(0,180,166,0.6)' : 'rgba(0,180,166,0.2)';
          r.conn.style.backgroundImage = `repeating-linear-gradient(to ${r.connDir}, ${c} 0px, ${c} 4px, transparent 4px, transparent 8px)`;
        }
        // Card border/shadow only on desktop
        if (r.card && !isMobile) { r.card.style.borderColor = isActive ? '#E5E5E5' : 'transparent'; r.card.style.boxShadow = isActive ? '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.04)' : 'none'; }
        // Mobile: add left accent bar on active
        if (r.card && isMobile) { r.card.style.borderLeft = isActive ? '3px solid #00B4A6' : '3px solid transparent'; r.card.style.paddingLeft = '12px'; }
        if (r.tag) { r.tag.style.backgroundColor = isActive ? 'rgba(0,180,166,0.1)' : 'rgba(28,28,28,0.04)'; r.tag.style.color = isActive ? '#00B4A6' : 'rgba(143,143,143,0.4)'; }
        if (r.title) r.title.style.color = isActive ? '#1C1C1C' : 'rgba(28,28,28,0.5)';
        if (r.year)  r.year.style.color  = isActive ? '#00B4A6' : 'rgba(143,143,143,0.35)';
        if (r.desc)  r.desc.style.color  = isActive ? 'rgba(28,28,28,0.6)' : 'rgba(143,143,143,0.4)';
      }
    };

    const animate = () => {
      const diff = target.v - current.v;
      if (Math.abs(diff) > 0.0001) { current.v += diff * 0.08; applyProgress(current.v); }
      rafId = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      target.v = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(animate);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, [timelineItems.length]);

  if (timelineItems.length === 0) return null;

  const setRef = (i, key, extra) => el => {
    if (!itemRefs.current[i]) itemRefs.current[i] = {};
    itemRefs.current[i][key] = el;
    if (extra && el) Object.assign(itemRefs.current[i], extra);
  };

  return (
    <div ref={containerRef} style={{ height: `${timelineItems.length * 36}vh` }} className="relative w-full z-10 font-sans">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-bg"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 10% 35%, rgba(0,180,166,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 65%, rgba(0,180,166,0.06) 0%, transparent 55%), radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,180,166,0.03) 0%, transparent 70%), #F5F0EB' }}
      >
        {/* Red ambient glow orbs */}
        <div className="absolute top-[10%] left-[2%] w-[520px] h-[520px] bg-brand-red/[0.09] rounded-full blur-[140px] animate-float pointer-events-none"></div>
        <div className="absolute bottom-[8%] right-[4%] w-[420px] h-[420px] bg-brand-red/[0.07] rounded-full blur-[120px] animate-float-delayed pointer-events-none"></div>
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-brand-red/[0.05] rounded-full blur-[100px] animate-float pointer-events-none"></div>

        {/* Subtle noise grain for depth */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '160px 160px' }}></div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <div className="absolute top-10 left-6 w-12 h-[1px] bg-gradient-to-r from-brand-red/20 to-transparent"></div>
          <div className="absolute top-10 left-6 w-[1px] h-12 bg-gradient-to-b from-brand-red/20 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <div className="absolute bottom-10 right-6 w-12 h-[1px] bg-gradient-to-l from-brand-red/20 to-transparent"></div>
          <div className="absolute bottom-10 right-6 w-[1px] h-12 bg-gradient-to-t from-brand-red/20 to-transparent"></div>
        </div>

        {/* Title */}
        <div ref={titleRef} className="absolute top-20 md:top-28 w-full text-center z-30"
          style={{ transition: 'opacity 0.7s, transform 0.7s' }}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-8 h-[1px] bg-brand-red"></div>
            <span className="text-brand-red uppercase tracking-widest text-xs font-bold">Experiência</span>
            <div className="w-8 h-[1px] bg-brand-red"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-dark mb-2 tracking-tight">Trajetória e Impacto</h2>
          <p className="text-brand-gray text-sm px-8 max-w-2xl mx-auto">Os marcos que consolidam minha experiência executiva.</p>
        </div>

        {/* Viewport */}
        <div ref={viewportRef}
          className="w-full max-w-6xl mx-auto relative z-20 overflow-hidden px-4"
          style={{ height: '60vh', marginTop: '5rem', transition: 'height 1s cubic-bezier(0.16,1,0.3,1)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
        >
          {/* Center Glowing Orb — desktop only */}
          <div className="absolute top-1/2 hidden md:block md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="w-3.5 h-3.5 rounded-full bg-brand-red shadow-[0_0_10px_rgba(0,180,166,0.4),0_0_25px_rgba(0,180,166,0.15)]"></div>
          </div>

          {/* Comet Tail — desktop only */}
          <div ref={cometRef}
            className="absolute bottom-1/2 hidden md:block md:left-1/2 w-[1.5px] h-[25vh] bg-gradient-to-t from-brand-red via-brand-red/30 to-transparent -translate-x-1/2 z-10"
            style={{ opacity: 0 }}
          ></div>

          {/* Moving Content */}
          <div ref={movingRef} className="absolute top-1/2 left-0 w-full will-change-transform" style={{ transform: 'translateY(0%)' }}>
            <div className="relative w-full" style={{ height: `${Math.max(800, timelineItems.length * 136)}px` }}>
              {/* Track Line — desktop only */}
              <div className="absolute hidden md:block md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-red/15 -translate-x-1/2"></div>

              {timelineItems.map((item, i) => {
                const pos = timelineItems.length > 1 ? (i / (timelineItems.length - 1)) * 100 : 50;
                const isEven = i % 2 === 0;
                const connDir = isEven ? 'left' : 'right';
                return (
                  <div key={item.id || i} className="absolute w-full flex items-center md:justify-center"
                    style={{ top: `${pos}%`, transform: 'translateY(-50%)' }}>

                    {/* Connector — desktop only */}
                    <div ref={setRef(i, 'conn', { connDir })}
                      className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] z-10 ${isEven ? 'right-1/2 mr-[7px] w-[40px]' : 'left-1/2 ml-[7px] w-[40px]'}`}
                      style={{ backgroundImage: `repeating-linear-gradient(to ${connDir}, rgba(0,180,166,0.2) 0px, rgba(0,180,166,0.2) 4px, transparent 4px, transparent 8px)`, transformOrigin: isEven ? 'right' : 'left', opacity: 0 }}
                    ></div>

                    {/* Card Wrapper */}
                    <div ref={setRef(i, 'wrap')}
                      className={`w-full md:w-[calc(50%-55px)] absolute px-6 md:px-0 will-change-transform flex ${isEven ? 'md:right-[calc(50%+55px)] md:justify-end' : 'md:left-[calc(50%+55px)] md:justify-start'}`}
                      style={{ opacity: 0 }}
                    >
                      <div ref={setRef(i, 'card')}
                        className="overflow-hidden relative w-full md:max-w-sm z-10 bg-transparent md:bg-white md:rounded-xl md:border"
                        style={{ borderColor: 'transparent' }}
                      >
                        <div className={`py-3 md:px-6 md:py-6 text-left ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                          <div ref={setRef(i, 'tag')}
                            className="inline-block text-[10px] font-bold tracking-[0.15em] mb-2 uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(28,28,28,0.04)', color: 'rgba(143,143,143,0.4)' }}
                          >{item.titulo?.split(' ')[0]?.toUpperCase() || `FASE ${(i + 1).toString().padStart(2, '0')}`}</div>
                          <h4 ref={setRef(i, 'title')}
                            className="font-serif font-bold text-base md:text-lg mb-0.5 leading-snug"
                            style={{ color: 'rgba(28,28,28,0.5)' }}
                          >{item.titulo}</h4>
                          <div ref={setRef(i, 'year')}
                            className="text-[11px] font-bold tracking-widest mb-1.5 uppercase"
                            style={{ color: 'rgba(143,143,143,0.35)' }}
                          >{item.ano}</div>
                          <p ref={setRef(i, 'desc')}
                            className="text-xs md:text-sm leading-relaxed line-clamp-2"
                            style={{ color: 'rgba(143,143,143,0.4)' }}
                          >{item.descricao}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
