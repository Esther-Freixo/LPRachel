import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublicacoes, getCitacoes } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'

const LABELS = { livro: 'Livro', artigo: 'Artigo Acadêmico', opiniao: 'Coluna', imprensa: 'Imprensa' }

const QUOTE_CARDS = [
  {
    text: "O rigor científico é a bússola que orienta a excelência na estratégia tributária.",
    bg: "bg-white/60",
    textCol: "text-brand-dark",
    border: "border-brand-red",
    quoteMark: "text-brand-dark/10"
  },
  {
    text: "A governança não é apenas um selo, é o alicerce para negócios duradouros.",
    bg: "bg-brand-dark/90",
    textCol: "text-white",
    border: "border-[#E5E5E5]",
    quoteMark: "text-white/10"
  },
  {
    text: "Desenvolver soluções exige integrar eficiência fiscal e responsabilidade sustentável.",
    bg: "bg-brand-red/90",
    textCol: "text-white",
    border: "border-brand-dark",
    quoteMark: "text-brand-dark/20"
  },
  {
    text: "O debate acadêmico oxigena e impulsiona as transformações do setor produtivo.",
    bg: "bg-[#EFECE8]/90",
    textCol: "text-brand-dark",
    border: "border-brand-dark",
    quoteMark: "text-brand-dark/10"
  }
]

function R({ children, className, style, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className ? ' ' + className : ''}`} style={style}>{children}</div>
}

export default function EspecialidadesPesquisas() {
  const [filterPub, setFilterPub] = useState('todos')
  const [quoteIdx, setQuoteIdx] = useState(0)
  
  const { data: pubs, loading } = useData(getPublicacoes)
  const pubsSeguras = pubs || []
  const filteredPubs = filterPub === 'todos' ? pubsSeguras : pubsSeguras.filter(p => (p.tipo || '').toLowerCase().trim() === filterPub.toLowerCase().trim())

  const { data: dbCitacoes } = useData(getCitacoes)
  const activeQuotes = dbCitacoes && dbCitacoes.length > 0 ? dbCitacoes : QUOTE_CARDS;

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % activeQuotes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeQuotes.length])

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full min-h-screen">
      
      {/* HERO */}
      <section className="relative pt-40 pb-32 px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <R className="w-full md:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-red"></div>
              <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Conhecimento Aplicado</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight text-brand-dark">Especialidades <br/><span className="text-brand-gray">&</span> Pesquisa</h1>
            <p className="text-brand-gray text-lg md:text-xl max-w-2xl leading-relaxed font-medium">A intersecção entre o rigor acadêmico, a inteligência estratégica tributária e as demandas de governança do setor produtivo.</p>
          </R>

          {/* Right Side Composition - Editorial & Elegant */}
          <div className="hidden md:flex w-full md:w-1/2 relative h-[450px] items-center justify-end">
             
             {/* Delicate Geometric Background (The "Pearl/Slate" minimalism) */}
             <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] border-[0.5px] border-brand-dark/5 rounded-full z-0"></div>
             <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[200px] h-[200px] border-[0.5px] border-brand-red/10 rounded-full z-0"></div>
             
             {/* The Elegant Quote Cards - Stacked and Crossfading */}
             <div className="relative z-10 w-full max-w-sm mr-8 h-[380px]">
               {activeQuotes.map((card, i) => {
                 const isActive = quoteIdx === i;
                 return (
                   <div 
                     key={card.id || i}
                     className={`absolute inset-0 backdrop-blur-lg p-10 lg:p-12 border-l-[3px] ${card.border || 'border-brand-red'} ${card.bg || 'bg-white/60'} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isActive ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none'}`}
                   >
                     <div className={`font-serif text-6xl ${card.quote_mark || card.quoteMark || 'text-brand-dark/10'} leading-none h-6 mb-6`}>"</div>
                     <p className={`font-serif text-2xl lg:text-3xl ${card.text_col || card.textCol || 'text-brand-dark'} leading-tight italic flex-grow flex items-center`}>
                       <span>{card.texto || card.text}</span>
                     </p>
                     <div className="flex items-center gap-4 mt-6">
                       <div className={`w-8 h-[1px] ${(card.text_col || card.textCol) === 'text-white' ? 'bg-white/30' : 'bg-brand-dark/20'}`}></div>
                       <span className={`text-xs font-bold tracking-widest uppercase ${(card.text_col || card.textCol) === 'text-white' ? 'text-white/80' : 'text-brand-dark/60'}`}>Rachel Freixo</span>
                     </div>
                   </div>
                 )
               })}
             </div>

             {/* Marginalia (Editorial side text) */}
             <div className="absolute right-0 top-20 flex items-center gap-4 rotate-90 origin-right translate-x-4 opacity-40">
               <span className="text-[10px] tracking-[0.3em] uppercase text-brand-dark">Tax · ESG · Governança</span>
               <div className="w-16 h-[1px] bg-brand-red"></div>
             </div>

          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className="px-8 md:px-16 lg:px-24 pb-32 relative">
        <div className="max-w-7xl mx-auto">
          <R className="mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Especialidades</h2>
          </R>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[['Direito Tributário & Tax', 'Atuação no CARF, contencioso administrativo fiscal, planejamento tributário e interpretação estratégica de normas e regulações.'],
            ['Governança & ESG', 'Gestão corporativa focada na integração de conselhos de administração, critérios ESG e metas de sustentabilidade do negócio.'],
            ['Setor Público', 'Experiência executiva como Subsecretária de Competitividade, com ênfase em parcerias interinstitucionais e desburocratização.'],
            ['Academia & Docência', 'Professora e pesquisadora de alto nível, unindo pesquisa aplicada, orientação acadêmica e forte atuação no IBET e Fucape.']].map(([title, text], idx) => (
              <R delay={`reveal-delay-${(idx % 4) + 1}`} key={title} className="group relative bg-white p-12 rounded-2xl shadow-sm border border-transparent hover:border-[#E5E5E5] hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-500 overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-red/15 transition-colors duration-700 -z-10"></div>
                <div className="text-4xl font-serif text-brand-gray/20 mb-6 group-hover:text-brand-red/30 transition-colors">0{idx + 1}</div>
                <h3 className="font-serif text-3xl mb-4 group-hover:text-brand-red transition-colors duration-300">{title}</h3>
                <p className="text-base md:text-lg text-brand-gray leading-relaxed">{text}</p>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAÇÃO ACADÊMICA */}
      <section className="bg-brand-dark px-8 py-32 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <R className="mb-16 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-brand-red"></div>
            <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Academia</span>
          </R>
          <R>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-20">Percurso Acadêmico</h2>
          </R>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <R delay="reveal-delay-1" className="lg:w-1/3 bg-gradient-to-br from-[#2a2a2a] to-brand-dark border border-white/10 text-white p-12 rounded-2xl relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-red/40 transition-colors duration-500"></div>
              <span className="text-xs uppercase tracking-widest text-brand-red font-bold block mb-6 relative z-10">Destaque</span>
              <h3 className="font-serif text-4xl mb-4 relative z-10 leading-tight">Doutorado em andamento</h3>
              <span className="block text-base md:text-lg font-medium mb-8 text-[#A0A0A0] relative z-10">Ciências Contábeis e Administração</span>
              <p className="text-base text-white/80 leading-relaxed relative z-10">Pesquisa voltada à intersecção entre tributação, obrigações ESG, sustentabilidade corporativa e governança na prestigiada FUCAPE Business School.</p>
            </R>

            <div className="lg:w-2/3 space-y-6">
              {[['Mestrado', 'Ciências Contábeis e Administração', 'FUCAPE Business School'],
              ['Especialização', 'Direito Tributário', 'IBET — São Paulo'],
              ['Especialização', 'Gestão ESG', 'Insper'],
              ['Graduação', 'Bacharel em Direito', 'Universidade de excelência'],
              ['Graduação', 'Bacharel em Administração', 'Universidade de excelência']].map(([level, title, inst], idx) => (
                <R delay={`reveal-delay-${(idx % 4) + 1}`} key={title} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl flex flex-col md:flex-row md:items-center gap-6 hover:bg-white/10 transition-colors duration-300">
                  <span className="text-xs uppercase tracking-widest text-[#8F8F8F] font-bold md:w-40 flex-shrink-0">{level}</span>
                  <div>
                    <h4 className="font-bold text-lg md:text-xl text-white mb-2">{title}</h4>
                    <p className="text-sm text-[#A0A0A0]">{inst}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOCÊNCIA E PESQUISA */}
      <section className="px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <R className="mb-16 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-brand-red"></div>
            <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Compartilhamento de Conhecimento</span>
          </R>
          <R>
            <h2 className="font-serif text-4xl md:text-6xl text-brand-dark mb-20">Docência & Linhas de Pesquisa</h2>
          </R>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[['Tributação & ESG', 'A intersecção entre obrigações tributárias, benefícios ambientais, compliance fiscal e a agenda global de sustentabilidade.'],
            ['Governança Pública', 'Modernização do Estado, desburocratização inteligente e políticas de melhoria contínua do ambiente de negócios e atração de investimentos.'],
            ['Diversidade Estrutural', 'Estudo aprofundado sobre a representatividade, pluralidade e paridade de gênero nos espaços de poder e decisão.'],
            ['Contencioso Administrativo Fiscal', 'Análise meticulosa de teses tributárias, jurisprudência do CARF, segurança jurídica e qualidade das decisões.'],].map(([title, text], idx) => (
              <R delay={`reveal-delay-${(idx % 4) + 1}`} key={title} className="group relative bg-white p-12 rounded-2xl shadow-sm border border-transparent hover:border-[#E5E5E5] hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-500 overflow-hidden z-10">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-brand-dark/10 transition-colors duration-700 -z-10"></div>
                <div className="text-4xl font-serif text-brand-gray/20 mb-6 group-hover:text-brand-red/30 transition-colors">0{idx + 1}</div>
                <h3 className="font-serif text-3xl mb-4 group-hover:text-brand-red transition-colors duration-300">{title}</h3>
                <p className="text-base md:text-lg text-brand-gray leading-relaxed">{text}</p>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICAÇÕES */}
      <section className="bg-[#EFECE8] px-8 py-32 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <R className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-red"></div>
                <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Acervo Literário</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Produção Intelectual</h2>
            </div>
            
            <div className="flex flex-wrap gap-6 border-b border-[#E5E5E5] pb-2">
              {['todos', 'livro', 'artigo', 'opiniao'].map(f => (
                <button key={f} className={`text-sm uppercase tracking-widest font-bold pb-4 border-b-2 transition-colors ${filterPub === f ? 'border-brand-red text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'}`} onClick={() => setFilterPub(f)}>
                  {f === 'todos' ? 'Todas' : LABELS[f]}
                </button>
              ))}
            </div>
          </R>
          
          <div className="space-y-8 mt-12">
            {filteredPubs.length > 0 ? filteredPubs.map((p, idx) => (
              <R delay={`reveal-delay-${(idx % 4) + 1}`} key={p.id} className="group relative bg-white p-10 rounded-2xl shadow-sm border border-transparent hover:border-[#E5E5E5] hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-8 items-start overflow-hidden z-10">
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-red/10 transition-colors duration-700 -z-10"></div>
                <div className="text-xs uppercase tracking-widest font-bold bg-brand-dark text-white px-4 py-2 rounded-full flex-shrink-0 group-hover:bg-brand-red transition-colors relative z-10">{LABELS[p.tipo] || p.tipo}</div>
                <div className="flex-grow">
                  <h4 className="font-serif text-3xl mb-3 text-brand-dark group-hover:text-brand-red transition-colors">{p.titulo}</h4>
                  <p className="text-sm text-brand-gray uppercase tracking-widest font-bold mb-6">{p.meta}</p>
                  <p className="text-base md:text-lg text-brand-gray leading-relaxed max-w-4xl">{(p.resumo || '')}</p>
                </div>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-4 md:mt-0">
                    <div className="text-sm uppercase tracking-widest font-bold text-white bg-brand-dark px-8 py-3 rounded-full hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-300">Acessar ↗</div>
                  </a>
                ) : (
                  <div className="text-sm uppercase tracking-widest font-bold text-[#A0A0A0] bg-[#EFECE8] px-8 py-3 rounded-full cursor-not-allowed flex-shrink-0 mt-4 md:mt-0">Indisponível</div>
                )}
              </R>
            )) : <p className="text-center text-lg text-brand-gray py-20 font-medium">Nenhuma publicação encontrada para o filtro selecionado.</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
