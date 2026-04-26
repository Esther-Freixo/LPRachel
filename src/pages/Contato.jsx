import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

function R({ children, className }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal${className ? ' '+className : ''}`}>{children}</div>
}

export default function Contato() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const n = e.target.nome.value
    const email = e.target.email.value
    const a = e.target.assunto.value
    const t = e.target.msg.value
    window.location.href = `mailto:rachelfreixo@gmail.com?subject=${encodeURIComponent(a)}&body=${encodeURIComponent(`Nome: ${n}\nEmail: ${email}\n\nMensagem:\n${t}`)}`
    setSent(true)
    e.target.reset()
  }

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full min-h-screen">
      
      {/* HERO */}
      <section className="relative pt-40 pb-32 px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-brand-red"></div>
            <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Contato</span>
          </div>
          <h1 className="font-serif text-5xl md:text-8xl mb-8 tracking-tight text-brand-dark">Fale com <br/><span className="text-brand-gray">Rachel</span></h1>
          <p className="text-brand-gray text-lg md:text-xl max-w-2xl leading-relaxed font-medium">Para palestras, consultorias, imprensa ou parcerias acadêmicas.</p>
        </div>
      </section>

      {/* CONTACT INFO & FORM */}
      <section className="px-8 md:px-16 lg:px-24 pb-40 relative">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          
          {/* Left Info */}
          <div className="lg:w-1/3 space-y-12">
            <R className="group">
              <strong className="flex items-center gap-3 text-sm uppercase tracking-widest font-bold mb-4 text-brand-dark group-hover:text-brand-red transition-colors">
                <div className="w-2 h-2 bg-brand-red rounded-full group-hover:scale-150 transition-transform"></div>
                Localização
              </strong>
              <p className="text-base text-brand-gray leading-relaxed pl-5 border-l border-brand-red/20">Espírito Santo, Brasil<br />Disponível para viagens nacionais e internacionais.</p>
            </R>

            <R className="group">
              <strong className="flex items-center gap-3 text-sm uppercase tracking-widest font-bold mb-4 text-brand-dark group-hover:text-brand-red transition-colors">
                <div className="w-2 h-2 bg-brand-red rounded-full group-hover:scale-150 transition-transform"></div>
                Redes Profissionais
              </strong>
              <div className="flex flex-col gap-3 text-base pl-5 border-l border-brand-red/20">
                <a href="https://www.linkedin.com/in/rachelfreixo/" target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red font-medium transition-colors w-fit flex items-center gap-2">LinkedIn <span className="text-xs">↗</span></a>
                <a href="https://www.instagram.com/rachelfreixo/" target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red font-medium transition-colors w-fit flex items-center gap-2">Instagram <span className="text-xs">↗</span></a>
                <a href="https://linktr.ee/rachelfreixo" target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red font-medium transition-colors w-fit flex items-center gap-2">Linktree <span className="text-xs">↗</span></a>
              </div>
            </R>

            <R className="group">
              <strong className="flex items-center gap-3 text-sm uppercase tracking-widest font-bold mb-4 text-brand-dark group-hover:text-brand-red transition-colors">
                <div className="w-2 h-2 bg-brand-red rounded-full group-hover:scale-150 transition-transform"></div>
                Palestras & Eventos
              </strong>
              <p className="text-base text-brand-gray leading-relaxed pl-5 border-l border-brand-red/20">Disponível para palestras, painéis e eventos nacionais e internacionais em Direito Tributário, ESG e Gestão Pública.</p>
            </R>
          </div>

          {/* Right Form */}
          <R className="lg:w-2/3">
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl shadow-brand-dark/5 border border-[#E5E5E5]">
              <div className="mb-10">
                <h3 className="font-serif text-3xl text-brand-dark mb-2">Envie uma mensagem</h3>
                <p className="text-brand-gray">Preencha o formulário abaixo e entraremos em contato o mais breve possível.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="nome" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Nome completo</label>
                    <input id="nome" name="nome" type="text" placeholder="Seu nome completo" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">E-mail corporativo</label>
                    <input id="email" name="email" type="email" placeholder="seu@email.com" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Assunto de interesse</label>
                  <select id="assunto" name="assunto" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all appearance-none cursor-pointer">
                    <option value="" disabled selected>Selecione a área de interesse</option>
                    <option value="palestra">Palestra / Evento</option>
                    <option value="consultoria">Consultoria Especializada</option>
                    <option value="imprensa">Imprensa / Mídia</option>
                    <option value="academia">Academia / Pesquisa</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="msg" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Mensagem detalhada</label>
                  <textarea id="msg" name="msg" rows={6} placeholder="Por favor, detalhe sua solicitação, incluindo datas e local se for um evento..." required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all resize-y" />
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full sm:w-auto bg-brand-red text-white px-12 py-4 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-red-800 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-300">
                    Enviar Mensagem
                  </button>
                </div>
                
                {sent && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-center text-sm flex items-center justify-center gap-3 animate-pulse">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Mensagem processada! Rachel retornará o contato em breve.
                  </div>
                )}
              </form>
            </div>
          </R>
        </div>
      </section>
    </main>
  )
}
