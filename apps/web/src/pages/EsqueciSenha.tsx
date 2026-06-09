import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { esqueciSenha } from '../store/data'

export default function EsqueciSenha() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.target as any
    try {
      await esqueciSenha(form.email.value)
    } catch {
      // Mesmo em erro, mostramos a confirmação genérica (não vaza se o e-mail existe).
    }
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 font-sans text-brand-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 md:p-14 border border-white/20 shadow-2xl shadow-brand-dark/5 rounded-3xl relative z-10">
        <div className="text-center mb-10">
          <p className="font-serif italic text-4xl mb-3 text-brand-dark">Esther</p>
          <p className="text-sm uppercase tracking-widest font-bold text-brand-red">Recuperar acesso</p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <p className="text-brand-dark leading-relaxed">Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. Verifique sua caixa de entrada (e o spam).</p>
            <Link to="/login" className="inline-block text-sm uppercase tracking-widest font-bold text-brand-gray border-b-2 border-transparent hover:border-brand-gray hover:text-brand-dark pb-1 transition-all">← Voltar ao login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-brand-gray leading-relaxed mb-2">Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.</p>
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">E-mail</label>
              <input id="email" name="email" type="email" placeholder="Digite seu e-mail" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-teal-700 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm uppercase tracking-widest font-bold text-brand-gray hover:text-brand-dark transition-all">← Voltar ao login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
