import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/data'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const user = e.target.user.value
    const pass = e.target.pass.value
    
    const ok = await login(user, pass)
    setLoading(false)
    if (ok) navigate('/admin')
    else setError('Credenciais incorretas ou acesso negado.')
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 font-sans text-brand-dark relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 md:p-14 border border-white/20 shadow-2xl shadow-brand-dark/5 rounded-3xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-brand-dark/20 rounded-full flex items-center justify-center mx-auto mb-6 bg-white shadow-sm">
            <span className="font-serif italic text-2xl">RF</span>
          </div>
          <p className="font-serif italic text-4xl mb-3 text-brand-dark">Rachel Freixo</p>
          <p className="text-sm uppercase tracking-widest font-bold text-brand-red">Área Administrativa</p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-brand-red/20 rounded-xl text-brand-red text-sm font-medium text-center flex items-center justify-center gap-2 animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Usuário</label>
            <input id="user" name="user" type="text" placeholder="Digite seu usuário" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="pass" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Senha</label>
            <input id="pass" name="pass" type="password" placeholder="Digite sua senha" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
          </div>
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-red-800 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Autenticando...' : 'Acessar Painel'}
            </button>
          </div>
        </form>
        
        <div className="mt-10 text-center">
          <a href="/" className="text-sm uppercase tracking-widest font-bold text-brand-gray border-b-2 border-transparent hover:border-brand-gray hover:text-brand-dark pb-1 transition-all">
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  )
}
