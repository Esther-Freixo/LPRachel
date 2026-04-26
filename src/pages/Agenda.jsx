import { Link } from 'react-router-dom'
import { getAgenda, getInsights } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'

function R({ children, className, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className || ''}`}>{children}</div>
}

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

export default function Agenda() {
  const { data: agenda, loading: loadingAgenda } = useData(getAgenda)
  const { data: insights, loading: loadingInsights } = useData(getInsights)
  const agendaSegura = (agenda || []).map(e => ({ ...e, computedStatus: getEventStatus(e) }))
  const insightsSeguros = insights || []

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full min-h-screen">
      
      {/* HERO */}
      <section className="relative pt-40 pb-32 px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none animate-float"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <R>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-red"></div>
              <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Agenda & Presença</span>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl mb-8 tracking-tight text-brand-dark">Acompanhe <br/><span className="text-brand-gray">Rachel Freixo</span></h1>
            <p className="text-brand-gray text-lg md:text-xl max-w-2xl leading-relaxed font-medium">Palestras, painéis, docência e as reflexões diárias publicadas no LinkedIn.</p>
          </R>
        </div>
      </section>

      {/* AGENDA */}
      <section className="px-8 md:px-16 lg:px-24 pb-32 relative">
        <div className="max-w-7xl mx-auto">
          <R className="mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Agenda de Eventos</h2>
          </R>
          <div className="space-y-8">
            {loadingAgenda ? <p className="text-lg text-brand-gray font-medium">Carregando...</p> : (
              <>
                {agendaSegura.filter(e => e.computedStatus !== 'realizado').map((e, idx) => (
                  <R delay={`reveal-delay-${(idx % 4) + 1}`} key={e.id} className="group bg-white rounded-2xl shadow-sm border border-[#E5E5E5] hover:border-brand-red hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-300 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden hover:-translate-y-2 hover:scale-[1.01]">
                    {/* Indicador visual forte de próximo evento */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>
                    <div className="flex-shrink-0 w-32 pl-6">
                      <span className="block text-5xl font-serif text-brand-red mb-2">{e.dia || '--'}</span>
                      <span className="block text-sm uppercase tracking-widest font-bold text-brand-dark">{e.mes} {e.ano}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-3 items-center mb-4">
                        <span className="text-xs uppercase tracking-widest bg-brand-dark text-white px-3 py-1 rounded-full">{e.tipo}</span>
                        <span className="text-xs uppercase tracking-widest text-brand-red bg-red-50 border border-brand-red/20 px-3 py-1 rounded-full font-bold">Próximo Evento</span>
                      </div>
                      <h4 className="font-serif text-3xl mb-3 group-hover:text-brand-red transition-colors duration-300">{e.titulo}</h4>
                      <p className="text-base md:text-lg text-brand-gray leading-relaxed">{e.local} <span className="mx-2">•</span> {e.descricao}</p>
                    </div>
                    <Link to="/contato" className="text-sm uppercase tracking-widest font-bold text-brand-red border-b-2 border-transparent hover:border-brand-red pb-1 transition-all flex-shrink-0 mt-4 md:mt-0 flex items-center gap-2 group/link">
                      Saber mais <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                    </Link>
                  </R>
                ))}
                
                {agendaSegura.filter(e => e.computedStatus === 'realizado').map((e, idx) => (
                  <R delay={`reveal-delay-${(idx % 4) + 1}`} key={e.id} className="bg-[#EFECE8] rounded-2xl border border-[#D1D1D1] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 relative overflow-hidden hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-gray"></div>
                    <div className="flex-shrink-0 w-32 pl-6">
                      <span className="block text-5xl font-serif text-brand-gray mb-2">{e.dia || '--'}</span>
                      <span className="block text-sm uppercase tracking-widest font-bold text-brand-gray">{e.mes} {e.ano}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-3 items-center mb-4">
                        <span className="text-xs uppercase tracking-widest bg-brand-gray text-white px-3 py-1 rounded-full">{e.tipo}</span>
                        <span className="text-xs uppercase tracking-widest text-brand-gray bg-white border border-[#D1D1D1] px-3 py-1 rounded-full font-bold">Realizado</span>
                      </div>
                      <h4 className="font-serif text-3xl mb-3 text-brand-dark/60">{e.titulo}</h4>
                      <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed">{e.local} <span className="mx-2">•</span> {e.descricao}</p>
                    </div>
                    <div className="text-sm uppercase tracking-widest font-bold text-brand-gray flex-shrink-0 mt-4 md:mt-0 px-4 py-2 bg-white rounded-full">Encerrado</div>
                  </R>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* LINKEDIN INSIGHTS */}
      <section className="bg-brand-dark px-8 py-32 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-float-delayed"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <R className="mb-16 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-brand-red"></div>
            <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Reflexões Rápidas</span>
          </R>
          <R>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-20">Últimas do LinkedIn</h2>
          </R>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingInsights ? <p className="text-lg text-[#A0A0A0]">Carregando...</p> : insightsSeguros.map((i, idx) => (
              <R delay={`reveal-delay-${(idx % 4) + 1}`} key={i.id} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 flex flex-col h-full hover:bg-white/10 hover:border-brand-red/50 transition-all duration-300 hover:-translate-y-2">
                <p className="text-lg text-white font-medium leading-relaxed mb-12 flex-grow group-hover:text-brand-red transition-colors duration-300">"{i.titulo}"</p>
                <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-auto">
                  <span className="text-sm text-[#8F8F8F] font-bold">{i.data}</span>
                  <Link to={`/insight/${i.id}`} className="text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2 group/link">
                    Ler Artigo <span className="group-hover/link:translate-x-2 transition-transform text-brand-red">→</span>
                  </Link>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
