import { Link } from 'react-router-dom'
import { getPublicacoes, getAgenda, getTimeline } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'
import { useEffect, useRef } from 'react'

// Reveal Wrapper Component
function R({ children, className, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className || ''}`}>{children}</div>
}

// Custom Interactive Timeline — DOM-driven (no React re-renders per frame)
function StickyTimeline({ items }) {
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
          const c = isActive ? 'rgba(150,42,32,0.6)' : 'rgba(150,42,32,0.2)';
          r.conn.style.backgroundImage = `repeating-linear-gradient(to ${r.connDir}, ${c} 0px, ${c} 4px, transparent 4px, transparent 8px)`;
        }
        // Card border/shadow only on desktop
        if (r.card && !isMobile) { r.card.style.borderColor = isActive ? '#E5E5E5' : 'transparent'; r.card.style.boxShadow = isActive ? '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.04)' : 'none'; }
        // Mobile: add left accent bar on active
        if (r.card && isMobile) { r.card.style.borderLeft = isActive ? '3px solid #962A20' : '3px solid transparent'; r.card.style.paddingLeft = '12px'; }
        if (r.tag) { r.tag.style.backgroundColor = isActive ? 'rgba(150,42,32,0.1)' : 'rgba(28,28,28,0.04)'; r.tag.style.color = isActive ? '#962A20' : 'rgba(143,143,143,0.4)'; }
        if (r.title) r.title.style.color = isActive ? '#1C1C1C' : 'rgba(28,28,28,0.5)';
        if (r.year)  r.year.style.color  = isActive ? '#962A20' : 'rgba(143,143,143,0.35)';
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
        style={{ background: 'radial-gradient(ellipse 70% 55% at 10% 35%, rgba(150,42,32,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 65%, rgba(150,42,32,0.06) 0%, transparent 55%), radial-gradient(ellipse 80% 70% at 50% 50%, rgba(150,42,32,0.03) 0%, transparent 70%), #F5F0EB' }}
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
            <div className="w-3.5 h-3.5 rounded-full bg-brand-red shadow-[0_0_10px_rgba(150,42,32,0.4),0_0_25px_rgba(150,42,32,0.15)]"></div>
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
                      style={{ backgroundImage: `repeating-linear-gradient(to ${connDir}, rgba(150,42,32,0.2) 0px, rgba(150,42,32,0.2) 4px, transparent 4px, transparent 8px)`, transformOrigin: isEven ? 'right' : 'left', opacity: 0 }}
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

// Helpers
const RedSquare = () => <div className="w-2 h-2 bg-brand-red flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(150,42,32,0.6)]"></div>
const SmallRedIcon = () => (
  <div className="w-10 h-10 rounded-full border border-brand-red/30 bg-brand-red/5 text-brand-red flex items-center justify-center text-sm mb-6 group-hover:scale-110 transition-transform duration-300">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
  </div>
)

function getEventStatus(evt) {
  if (!evt.dia || !evt.mes) return evt.status || 'proximo';

  const meses = { JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5, JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11 };
  const evtMonth = meses[evt.mes.substring(0, 3).toUpperCase()] ?? -1;
  if (evtMonth === -1) return evt.status || 'proximo';

  const evtDay = parseInt(evt.dia, 10) || 1;
  const nowSP = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const currentYear = nowSP.getFullYear();
  const evtYear = evt.ano ? parseInt(evt.ano, 10) : currentYear;

  const evtDate = new Date(evtYear, evtMonth, evtDay, 23, 59, 59);
  return evtDate < nowSP ? 'realizado' : 'proximo';
}

export default function Home() {
  const { data: timeline } = useData(getTimeline)
  const { data: agenda } = useData(getAgenda)

  const agendaList = (agenda || []).map(e => ({ ...e, computedStatus: getEventStatus(e) }))

  // Mix up to 4 events (prioritizing upcoming, but showing past if needed)
  const proximos = agendaList.filter(e => e.computedStatus !== 'realizado')
  const realizados = agendaList.filter(e => e.computedStatus === 'realizado')
  const eventosHome = [...proximos, ...realizados].slice(0, 4)

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full overflow-clip">

      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col md:flex-row min-h-[75vh] overflow-hidden bg-brand-bg">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-float-delayed"></div>

        {/* Left Content */}
        <div className="w-full md:w-1/2 px-8 py-16 md:px-16 lg:px-24 flex flex-col justify-center relative z-10 pt-24 md:pt-32">

          <R className="mb-12">
            <div className="w-12 h-12 border border-brand-dark/20 rounded-full flex items-center justify-center mb-6 bg-white/50 backdrop-blur-sm shadow-sm">
              <span className="font-serif italic text-lg">RF</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-gray-600">
              Rachel<br />Freixo
            </h1>
            <div className="flex flex-wrap gap-2 mb-6 max-w-lg">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest bg-brand-dark text-white px-3 py-1 rounded-full">Mãe</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest bg-brand-red text-white px-3 py-1 rounded-full">Conselheira CARF</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full">Vogal JUCEES</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full">Ex-Subsecretária ES</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full">Profa Palestrante</span>
            </div>
            <p className="text-brand-dark text-base md:text-lg max-w-lg leading-relaxed font-medium mb-10">
              Liderança executiva, rigor acadêmico e inteligência estratégica. Mestre e Doutoranda em Ciências Contábeis e Administração, atuando com forte foco em <strong>ESG</strong> e <strong>TAX</strong>.
            </p>
          </R>

          {/* 3 List Items */}
          <div className="space-y-6">
            <R delay="reveal-delay-1" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">C</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide">Conselho Administrativo (CARF)</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Experiência na análise de litígios tributários complexos.</p>
              </div>
            </R>

            <R delay="reveal-delay-2" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] text-brand-dark flex items-center justify-center text-xs font-bold shadow-sm group-hover:border-brand-red transition-colors duration-300 flex-shrink-0">T</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide group-hover:text-brand-red transition-colors duration-300">Inteligência Tributária</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Consultoria focada no planejamento fiscal estruturado.</p>
              </div>
            </R>

            <R delay="reveal-delay-3" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-red-800 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-red/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">E</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide">Sustentabilidade & ESG</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Desenvolvimento de governança corporativa moderna.</p>
              </div>
            </R>
          </div>

        </div>

        {/* Right Image */}
        <div className="w-full md:w-5/12 relative h-[50vh] md:h-auto ml-auto overflow-hidden">
          <div className="absolute inset-0 bg-brand-dark/10 z-10 mix-blend-multiply"></div>
          <img
            src="/hero.jpg"
            alt="Rachel Freixo"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-[center_top]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10"></div>

          <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col sm:flex-row gap-4">
            <Link to="/especialidades" className="flex-1 text-center bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase text-xs tracking-widest font-bold py-4 hover:bg-white/20 transition-all duration-300">Conheça o Perfil</Link>
            <Link to="/agenda" className="flex-1 text-center bg-brand-red border border-brand-red text-white uppercase text-xs tracking-widest font-bold py-4 hover:bg-red-800 shadow-[0_0_20px_rgba(150,42,32,0.4)] transition-all duration-300">Eventos e Palestras</Link>
          </div>
        </div>

      </section>

      {/* 2. SERVICES GRID (Pilares) */}
      <section className="bg-white px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">

          <R className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-red"></div>
                <span className="text-brand-red uppercase tracking-widest text-sm font-bold">Expertise</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Pilares de<br />Atuação Estratégica</h2>
            </div>
            <p className="text-base md:text-lg text-brand-gray max-w-md leading-relaxed">Soluções multidisciplinares em direito público, contencioso tributário e gestão corporativa, desenhadas exclusivamente para empresas, conselhos e instituições que buscam segurança, inovação e excelência técnica.</p>
          </R>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <R delay="reveal-delay-1" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Contencioso Administrativo</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">01</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Atuação direta no CARF</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Defesas e recursos fiscais</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Sustentação oral de alto impacto</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-2" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Planejamento Tributário</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">02</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Otimização da carga fiscal</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Reorganização societária inteligente</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Compliance fiscal e preventivo</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-3" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Políticas ESG & Governança</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">03</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Implementação de comitês ESG</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Auditoria de práticas sustentáveis</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Conselhos de Administração</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-4" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Competitividade Pública</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">04</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Melhoria do ambiente de negócios</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Diálogo interinstitucional avançado</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Estruturação de projetos públicos</span></li>
              </ul>
            </R>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM CENTRAL TIMELINE STICKY */}
      <StickyTimeline items={timeline || []} />

      {/* 4. RESULTS / ACCORDION STYLE */}
      <section className="bg-brand-bg px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">

          {/* Left Title */}
          <R className="lg:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-red"></div>
              <span className="text-brand-red uppercase tracking-widest text-sm font-bold">Atuação</span>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl text-brand-dark leading-tight mb-12">
              Resultados com segurança.
            </h2>
            <div className="bg-gradient-to-br from-brand-dark to-gray-800 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="text-7xl font-serif mb-4 relative z-10">20+</div>
              <p className="text-sm text-[#8F8F8F] uppercase tracking-widest font-bold relative z-10">Anos de experiência focada em excelência, docência e julgamentos colegiados.</p>
            </div>
          </R>

          {/* Right List */}
          <div className="lg:w-2/3 w-full space-y-4">
            {[
              'Atuação contínua como Conselheira Titular julgando litígios complexos no CARF',
              'Reconhecido trabalho como Subsecretária de Competitividade e Projetos no ES',
              'Conselheira de Administração com sólida formação pela FDC/IBGC',
              'Liderança atuante na formulação de painéis de ESG e Sustentabilidade Integrada',
              'Forte atuação acadêmica, docência de pós-graduação e publicações pelo IBET e Fucape'
            ].map((text, i) => (
              <R delay="" key={i} className="group bg-brand-bg rounded-xl px-8 py-6 flex justify-between items-center cursor-pointer hover:bg-brand-dark hover:text-white transition-all duration-300 shadow-sm border border-transparent hover:border-brand-dark hover:-translate-y-1">
                <span className="text-lg font-medium pr-6">{text}</span>
                <span className="w-10 h-10 rounded-full bg-white group-hover:bg-brand-red flex items-center justify-center text-brand-dark group-hover:text-white transition-colors duration-300 flex-shrink-0 group-hover:rotate-45">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </R>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ABOUT / PHILOSOPHY - Glassmorphism Edition */}
      <section className="bg-brand-dark px-8 py-32 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none animate-float"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">

          {/* Left Col - Overlapping Image and Card */}
          <R className="lg:w-1/3 relative flex flex-col">
            <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full">
              <img src="/about.jpg" alt="Rachel Freixo" loading="lazy" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl" />
            </div>
            {/* Mission Card */}
            <div className="relative md:absolute md:-bottom-16 md:-right-16 mt-[-30px] md:mt-0 z-20 bg-brand-dark/70 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] mx-auto md:w-[360px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[1px] bg-brand-red"></div>
                <p className="text-brand-red text-xs uppercase tracking-widest font-bold">Minha Missão</p>
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed font-serif">Elevar o rigor técnico do Direito Tributário e promover uma governança corporativa que gere impacto real na sociedade e no setor produtivo.</p>
            </div>
          </R>

          {/* Right Col */}
          <div className="lg:w-2/3 lg:pl-12 mt-20 lg:mt-0 flex items-center">
            <R delay="reveal-delay-1">
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
                "Atuo na intersecção entre o <span className="text-brand-red italic">rigor técnico</span> e a melhoria do ambiente de negócios."
              </h2>
              <p className="text-[#A0A0A0] max-w-2xl text-lg leading-relaxed">
                Acredito firmemente que o conhecimento acadêmico deve servir à prática. Minha experiência como gestora pública me ensinou que a segurança jurídica é o pilar de qualquer crescimento sustentável. Defendo uma atuação profissional que vai muito além da simples interpretação fria da lei, buscando entender profundamente a operação do cliente, as dores do mercado e as exigências globais de sustentabilidade corporativa.
              </p>
            </R>
          </div>

        </div>
      </section>

      {/* 6. AGENDA SECTION - Editorial Split Layout */}
      <section className="bg-white px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">

          <R className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-red"></div>
                <span className="text-brand-red uppercase tracking-widest text-sm font-bold">Agenda</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Eventos e Painéis</h2>
            </div>
            <Link to="/agenda" className="text-sm uppercase tracking-widest font-bold border-b-2 border-brand-red text-brand-red pb-1 hover:text-brand-dark hover:border-brand-dark transition-colors">
              Ver agenda completa
            </Link>
          </R>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left: Editorial Photo */}
            <R className="lg:w-5/12 relative group">
              <div className="relative w-full h-[500px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/agenda.jpg"
                  alt="Rachel Freixo em evento"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-white/60"></div>
                    <span className="text-white/90 text-xs uppercase tracking-widest font-bold">Próximos Eventos</span>
                  </div>
                  <p className="text-white font-serif text-2xl md:text-3xl leading-tight">Conectando conhecimento acadêmico à prática executiva.</p>
                </div>
              </div>
            </R>

            {/* Right: Event Cards */}
            <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventosHome.length > 0 ? eventosHome.map((evt, idx) => {
                const isPast = evt.computedStatus === 'realizado';
                return (
                  <R delay={`reveal-delay-${(idx % 4) + 1}`} key={evt.id} className={`group p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[260px] hover:-translate-y-2 ${isPast ? 'bg-[#EFECE8] border-[#D1D1D1] opacity-80 hover:opacity-100 shadow-none' : 'bg-brand-bg border-[#E5E5E5] hover:border-brand-red hover:shadow-2xl shadow-sm'}`}>

                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${isPast ? 'bg-brand-gray text-white' : 'bg-brand-dark text-white'}`}>
                          {evt.tipo || 'Evento'}
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${isPast ? 'border-brand-gray text-brand-gray' : 'border-brand-red bg-red-50 text-brand-red'}`}>
                          {isPast ? 'Realizado' : 'Próximo'}
                        </span>
                      </div>

                      <h4 className={`font-bold text-3xl font-serif mb-3 ${isPast ? 'text-brand-gray' : 'text-brand-dark group-hover:text-brand-red'} transition-colors`}>
                        {evt.dia} <span className="text-lg uppercase tracking-widest font-sans">{evt.mes}</span>
                      </h4>
                      <p className={`text-base leading-snug line-clamp-3 ${isPast ? 'text-brand-gray' : 'text-brand-dark'}`}>
                        {evt.titulo}
                      </p>
                    </div>

                    <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mt-4 pt-4 border-t border-brand-gray/20">
                      {evt.local}
                    </p>
                  </R>
                );
              }) : (
                <div className="p-12 bg-brand-bg rounded-2xl border border-[#E5E5E5] col-span-2 text-center">
                  <p className="text-lg text-brand-gray font-medium">Nenhum evento agendado no momento.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
