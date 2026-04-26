import { Link } from 'react-router-dom'
import { getPublicacoes, getAgenda, getTimeline } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'
import { useEffect, useRef, useState } from 'react'

// Reveal Wrapper Component
function R({ children, className, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className || ''}`}>{children}</div>
}

// Custom Interactive Timeline (Film Reel Sticky Style)
function StickyTimeline({ items }) {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrameId;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const updateProgress = () => {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        let scrollPx = -rect.top;
        let totalScrollable = rect.height - windowHeight;
        if (totalScrollable <= 0) totalScrollable = 1;
        let p = scrollPx / totalScrollable;
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        setProgress(p);
      };
      animationFrameId = requestAnimationFrame(updateProgress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const timelineItems = items || [];
  if (timelineItems.length === 0) return null;

  // Title visibility and Fullscreen expansion logic
  const isScrolling = progress > 0.02;

  return (
    // z-[100] ensures the navbar is completely hidden behind this section while it's active
    <div ref={containerRef} style={{ height: `${timelineItems.length * 100}vh` }} className="relative w-full bg-brand-bg z-[100] font-sans">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Title (Fades out when scrolling) */}
        <div 
          className="absolute top-16 md:top-24 w-full text-center z-30 transition-all duration-700"
          style={{ opacity: isScrolling ? 0 : 1, transform: `translateY(${isScrolling ? '-20px' : '0'})`, pointerEvents: isScrolling ? 'none' : 'auto' }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
             <div className="w-8 h-[1px] bg-brand-red"></div>
             <span className="text-brand-red uppercase tracking-widest text-xs font-bold">Experiência</span>
             <div className="w-8 h-[1px] bg-brand-red"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-brand-dark mb-4 tracking-tight">Trajetória e Impacto</h2>
          <p className="text-brand-gray text-sm md:text-lg px-8 max-w-2xl mx-auto">Os marcos que consolidam minha experiência executiva.</p>
        </div>

        {/* Viewport for Timeline - EXPANDED to full screen when scrolling */}
        <div 
          className="w-full max-w-7xl mx-auto relative z-20 overflow-hidden px-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" 
          style={{ 
             height: isScrolling ? '100vh' : '65vh', 
             marginTop: isScrolling ? '0' : '4rem',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
          }}
        >
           
           {/* Center Glowing Orb (Fixed in center of viewport) */}
           <div className="absolute top-1/2 left-[30px] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-red border-[3px] border-white shadow-[0_0_10px_rgba(150,42,32,0.3)] z-30"></div>
           
           {/* "Comet Tail" line that gives the navigation feel (fades in as you scroll) */}
           <div 
             className="absolute bottom-1/2 left-[30px] md:left-1/2 w-[2px] h-[40vh] bg-gradient-to-t from-brand-red via-brand-red/60 to-transparent -translate-x-1/2 z-10 transition-opacity duration-300"
             style={{ opacity: Math.min(1, progress * 15) }}
           ></div>

           {/* Moving Content Container */}
           <div 
             className="absolute top-1/2 left-0 w-full will-change-transform"
             style={{ transform: `translateY(-${progress * 100}%)` }} 
           >
              {/* Inner track that has the absolute height */}
              <div className="relative w-full" style={{ height: `${Math.max(1500, timelineItems.length * 400)}px` }}>
                 
                 {/* The Track Line Background */}
                 <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[1px] bg-brand-red/20 -translate-x-1/2"></div>
                 
                 {/* The Items */}
                 {timelineItems.map((item, i) => {
                    const pos = timelineItems.length > 1 ? (i / (timelineItems.length - 1)) * 100 : 50;
                    const distance = Math.abs(progress - (i / Math.max(1, timelineItems.length - 1)));
                    
                    const isActive = distance < 0.15; // Rough active window
                    const opacity = Math.max(0.1, 1 - (distance * 3));
                    const scale = Math.max(0.85, 1 - (distance * 0.5));
                    
                    const isEven = i % 2 === 0;

                    return (
                      <div 
                        key={item.id || i}
                        className="absolute w-full flex items-center md:justify-center"
                        style={{ top: `${pos}%`, transform: `translateY(-50%)` }}
                      >
                         {/* Marker Dot */}
                         <div 
                            className={`absolute left-[30px] md:left-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 -translate-x-1/2 ${isActive ? 'bg-brand-red border-white shadow-sm scale-150 opacity-0' : 'bg-brand-bg border-brand-red/30'}`}
                         ></div>

                         {/* Card Container - Alternating on Desktop */}
                         <div 
                           className={`w-full md:w-1/2 absolute pl-[80px] pr-6 md:px-0 will-change-transform flex ${isEven ? 'md:left-0 md:justify-end md:pr-16' : 'md:right-0 md:justify-start md:pl-16'}`} 
                           style={{ opacity, transform: `scale(${scale})` }}
                         >
                            <div className={`bg-white border ${isActive ? 'border-brand-red/30 shadow-2xl shadow-brand-dark/5' : 'border-[#E5E5E5] shadow-sm'} p-6 md:p-10 rounded-2xl transition-all duration-500 overflow-hidden relative group w-full md:max-w-lg ${isEven ? 'md:text-right' : 'md:text-left'} z-10`}>
                               <div className={`absolute top-0 ${isEven ? 'right-0 translate-x-1/3' : 'left-0 -translate-x-1/3'} w-48 h-48 bg-brand-red/5 rounded-full blur-[40px] -translate-y-1/2 group-hover:bg-brand-red/15 transition-colors duration-700 -z-10`}></div>
                               
                               <div className={`text-brand-red text-xs md:text-sm font-bold tracking-widest mb-4 uppercase flex items-center gap-3 justify-start ${isEven ? 'md:justify-end md:flex-row-reverse' : 'md:justify-start'} relative z-10`}>
                                  {isActive && <div className="w-8 h-[1px] bg-brand-red"></div>}
                                  <span>FASE {(i + 1).toString().padStart(2, '0')}</span>
                               </div>
                               <h4 className="font-serif font-bold text-brand-dark text-2xl md:text-3xl mb-3 leading-tight group-hover:text-brand-red transition-colors duration-300 relative z-10">{item.titulo}</h4>
                               <div className="text-brand-gray text-xs md:text-sm font-bold tracking-widest mb-4 uppercase relative z-10">{item.ano}</div>
                               <p className="text-brand-dark/80 text-sm md:text-base leading-relaxed relative z-10">{item.descricao}</p>
                            </div>
                         </div>
                      </div>
                    )
                 })}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

// Helpers
const RedSquare = () => <div className="w-2 h-2 bg-brand-red flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(150,42,32,0.6)]"></div>
const SmallRedIcon = () => (
  <div className="w-10 h-10 rounded-full border border-brand-red/30 bg-brand-red/5 text-brand-red flex items-center justify-center text-sm mb-6 group-hover:scale-110 transition-transform duration-300">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
  </div>
)

function getEventStatus(evt) {
  if (!evt.dia || !evt.mes) return evt.status || 'proximo';
  
  const meses = { JAN:0, FEV:1, MAR:2, ABR:3, MAI:4, JUN:5, JUL:6, AGO:7, SET:8, OUT:9, NOV:10, DEZ:11 };
  const evtMonth = meses[evt.mes.substring(0,3).toUpperCase()] ?? -1;
  if (evtMonth === -1) return evt.status || 'proximo';

  const evtDay = parseInt(evt.dia, 10) || 1;
  const nowSP = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
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
              Rachel<br/>Freixo
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
            src="/rachel_photo.png" 
            alt="Rachel Freixo" 
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
              <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Pilares de<br/>Atuação Estratégica</h2>
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

      {/* 3. ABOUT / PHILOSOPHY - Glassmorphism Edition */}
      <section className="bg-brand-dark px-8 py-32 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none animate-float"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">
          
          {/* Left Col - Overlapping Image and Card */}
          <R className="lg:w-1/3 relative flex flex-col">
            <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full">
              <img src="/rachel_photo.png" alt="Rachel Freixo" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl grayscale opacity-80" />
            </div>
            {/* Redesigned Mission Card - wider and floating */}
            <div className="relative md:absolute md:-bottom-10 md:-right-20 mt-[-50px] md:mt-0 z-20 bg-brand-dark/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl w-[90%] mx-auto md:w-[400px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-brand-red"></div>
                <p className="text-brand-red text-xs uppercase tracking-widest font-bold">Minha Missão</p>
              </div>
              <p className="text-white text-base md:text-lg leading-relaxed font-serif">Elevar o rigor técnico do Direito Tributário e promover uma governança corporativa que gere impacto real na sociedade e no setor produtivo.</p>
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

      {/* 4. PREMIUM CENTRAL TIMELINE STICKY */}
      <StickyTimeline items={timeline || []} />

      {/* 5. RESULTS / ACCORDION STYLE */}
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

      {/* 6. AGENDA GRID */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {eventosHome.length > 0 ? eventosHome.map((evt, idx) => {
              const isPast = evt.computedStatus === 'realizado';
              return (
                <R delay="" key={evt.id} className={`group p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[280px] hover:-translate-y-2 ${isPast ? 'bg-[#EFECE8] border-[#D1D1D1] grayscale hover:grayscale-0 opacity-80 hover:opacity-100 shadow-none' : 'bg-white border-[#E5E5E5] hover:border-brand-red hover:shadow-2xl shadow-sm'}`}>
                  
                  <div>
                    {/* Badge */}
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
              <div className="p-12 bg-white rounded-2xl border border-[#E5E5E5] col-span-4 text-center">
                <p className="text-lg text-brand-gray font-medium">Nenhum evento agendado no momento.</p>
              </div>
            )}

          </div>
        </div>
      </section>

    </main>
  )
}
