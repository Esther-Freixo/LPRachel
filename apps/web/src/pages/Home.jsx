import { Link } from 'react-router-dom'
import { getPublicacoes, getAgenda, getTimeline } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'
import TimelineEditorial from '../components/timeline/TimelineEditorial'
import { getEventStatus } from '../lib/agenda'

// Reveal Wrapper Component
function R({ children, className, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className || ''}`}>{children}</div>
}


// Helpers
const RedSquare = () => <div className="w-2 h-2 bg-brand-red flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(0,180,166,0.6)]"></div>
const SmallRedIcon = () => (
  <div className="w-10 h-10 rounded-full border border-brand-red/30 bg-brand-red/5 text-brand-red flex items-center justify-center text-sm mb-6 group-hover:scale-110 transition-transform duration-300">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
  </div>
)

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
      <section className="relative flex flex-col lg:flex-row min-h-[88vh] lg:min-h-0 overflow-hidden bg-brand-bg">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-float-delayed"></div>

        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-6 sm:px-10 py-16 lg:py-24 lg:px-16 xl:px-24 flex flex-col justify-center relative z-10">

          <R className="mb-10 sm:mb-12">
            <div className="w-12 h-12 border border-brand-dark/20 rounded-full flex items-center justify-center mb-6 bg-white/50 backdrop-blur-sm shadow-sm">
              <span className="font-serif italic text-lg">E</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-gray-600 leading-[1.05]">
              Professora<br />Esther
            </h1>
            <div className="flex flex-wrap gap-2 mb-6 max-w-lg">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest bg-brand-red text-white px-3 py-1 rounded-full">Professora</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full">Pesquisadora</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full">Palestrante</span>
            </div>
            <p className="text-brand-dark text-base md:text-lg max-w-lg leading-relaxed font-medium mb-10">
              Professora, pesquisadora e palestrante. Dedicada ao estudo e à disseminação do conhecimento em <strong>tributação</strong>, <strong>governança</strong>, competitividade, desenvolvimento regional e <strong>políticas públicas</strong>.
            </p>
          </R>

          {/* 3 List Items */}
          <div className="space-y-6">
            <R delay="reveal-delay-1" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">D</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide">Docência & Pesquisa</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Professora de pós-graduação e produção acadêmica em tributação e governança.</p>
              </div>
            </R>

            <R delay="reveal-delay-2" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] text-brand-dark flex items-center justify-center text-xs font-bold shadow-sm group-hover:border-brand-red transition-colors duration-300 flex-shrink-0">T</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide group-hover:text-brand-red transition-colors duration-300">Governança & Instituições</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Estudos sobre capacidade institucional, integridade e qualidade das decisões.</p>
              </div>
            </R>

            <R delay="reveal-delay-3" className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-teal-700 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-red/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">E</div>
              <div>
                <h3 className="font-bold text-sm md:text-base uppercase tracking-wide">Sustentabilidade & ESG</h3>
                <p className="text-xs md:text-sm text-brand-gray mt-1 leading-relaxed">Pesquisa em agenda ESG, transição energética e desenvolvimento sustentável.</p>
              </div>
            </R>
          </div>

        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative h-[55vh] sm:h-[65vh] lg:h-auto lg:min-h-[600px] ml-auto overflow-hidden">
          <div className="absolute inset-0 bg-brand-dark/10 z-10 mix-blend-multiply"></div>
          <img
            src="/hero.jpg"
            alt="Esther"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-[center_top]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10"></div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/especialidades" className="flex-1 text-center bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase text-xs tracking-widest font-bold py-4 hover:bg-white/20 transition-all duration-300">Conheça o Perfil</Link>
            <Link to="/agenda" className="flex-1 text-center bg-brand-red border border-brand-red text-white uppercase text-xs tracking-widest font-bold py-4 hover:bg-teal-700 shadow-[0_0_20px_rgba(0,180,166,0.4)] transition-all duration-300">Eventos e Palestras</Link>
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
                <span className="text-brand-red uppercase tracking-widest text-sm font-bold">Pesquisa</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Eixos de Pesquisa e<br />Contribuição Acadêmica</h2>
            </div>
            <p className="text-base md:text-lg text-brand-gray max-w-md leading-relaxed">Estudos e iniciativas voltados à construção de ecossistemas de conhecimento compartilhado capazes de fortalecer instituições, qualificar decisões e ampliar oportunidades de desenvolvimento econômico e social.</p>
          </R>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <R delay="reveal-delay-1" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Tributação e Desenvolvimento</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">01</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Reforma Tributária</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Federalismo Fiscal</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Incentivos Tributários</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Competitividade e Desenvolvimento Regional</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Tributação e Capacidade Institucional</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-2" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Governança e Instituições</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">02</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Governança Pública e Corporativa</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Integridade e Transparência</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Capacidade Institucional</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Ambientes Regulatórios</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Qualidade da Tomada de Decisão</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-3" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Competitividade e Políticas Públicas</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">03</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Ambiente de Negócios</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Desenvolvimento Econômico</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Comércio Exterior</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Inovação Pública</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Políticas de Competitividade</span></li>
              </ul>
            </R>

            <R delay="reveal-delay-4" className="group bg-brand-bg rounded-2xl p-10 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 border border-transparent hover:border-[#E5E5E5] flex flex-col h-full hover:-translate-y-2">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-3xl max-w-[250px] group-hover:text-brand-red transition-colors duration-300">Sustentabilidade e Transição Energética</h3>
                <div className="text-4xl font-serif text-brand-gray/30 group-hover:text-brand-red/20 transition-colors">04</div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Energias Renováveis</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Agenda ESG</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Desenvolvimento Sustentável</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Transição Energética</span></li>
                <li className="flex gap-4 items-start text-base md:text-lg text-brand-dark"><RedSquare /> <span>Políticas Públicas para Sustentabilidade</span></li>
              </ul>
            </R>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM CENTRAL TIMELINE STICKY */}
      <TimelineEditorial items={timeline || []} />

      {/* 4. RESULTS / ACCORDION STYLE */}
      <section className="bg-brand-bg px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">

          {/* Left Title */}
          <R className="lg:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-red"></div>
              <span className="text-brand-red uppercase tracking-widest text-sm font-bold">Trajetória</span>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl text-brand-dark leading-tight mb-12">
              Conhecimento que fortalece instituições.
            </h2>
            <div className="bg-gradient-to-br from-brand-dark to-gray-800 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="text-7xl font-serif mb-4 relative z-10">20+</div>
              <p className="text-sm text-[#8F8F8F] uppercase tracking-widest font-bold relative z-10">Anos dedicados à pesquisa, à docência e à produção acadêmica.</p>
            </div>
          </R>

          {/* Right List */}
          <div className="lg:w-2/3 w-full space-y-4">
            {[
              'Professora de pós-graduação com ampla experiência em Direito Tributário',
              'Palestrante em eventos nacionais e internacionais sobre ESG e Governança',
              'Pesquisadora ativa com publicações pelo IBET e Fucape',
              'Formadora de profissionais em Sustentabilidade e Governança Corporativa',
              'Mestre e Doutoranda em Ciências Contábeis e Administração'
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
              <img src="/about.jpg" alt="Esther" loading="lazy" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl" />
            </div>
            {/* Mission Card */}
            <div className="relative md:absolute md:-bottom-16 md:-right-16 mt-[-30px] md:mt-0 z-20 bg-brand-dark/70 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] mx-auto md:w-[360px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[1px] bg-brand-red"></div>
                <p className="text-brand-red text-xs uppercase tracking-widest font-bold">Minha Missão</p>
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed font-serif">Contribuir para a construção de ecossistemas de conhecimento compartilhado que fortaleçam a capacidade institucional, qualifiquem decisões e ampliem oportunidades de desenvolvimento econômico e social.</p>
            </div>
          </R>

          {/* Right Col */}
          <div className="lg:w-2/3 lg:pl-12 mt-20 lg:mt-0 flex items-center">
            <R delay="reveal-delay-1">
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
                "O conhecimento alcança seu maior valor quando é <span className="text-brand-red italic">compartilhado</span>, debatido e transformado em capacidade coletiva."
              </h2>
              <p className="text-[#A0A0A0] max-w-2xl text-lg leading-relaxed">
                Minha trajetória reúne pesquisa acadêmica, docência e participação em projetos voltados ao desenvolvimento econômico, à competitividade, à transição energética, ao comércio exterior e à modernização da gestão pública. Atuo especialmente na análise das relações entre tributação, governança, desenvolvimento regional e fortalecimento institucional.
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
                  alt="Esther em evento"
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
