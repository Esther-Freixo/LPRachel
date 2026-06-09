import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { redefinirSenha } from '../store/data'

export default function RedefinirSenha() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.target as any
    const senha = form.senha.value
    const confirma = form.confirma.value
    if (senha.length < 8) { setError('A senha precisa ter ao menos 8 caracteres.'); return }
    if (senha !== confirma) { setError('As senhas não conferem.'); return }
    setLoading(true)
    try {
      await redefinirSenha(token, senha)
      navigate('/login', { state: { reset: true } })
    } catch {
      setError('Link inválido ou expirado. Solicite um novo.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 font-sans text-brand-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E5E5E5]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 md:p-14 border border-white/20 shadow-2xl shadow-brand-dark/5 rounded-3xl relative z-10">
        <div className="text-center mb-10">
          <p className="font-serif italic text-4xl mb-3 text-brand-dark">Esther</p>
          <p className="text-sm uppercase tracking-widest font-bold text-brand-red">Nova senha</p>
        </div>

        {!token ? (
          <div className="text-center space-y-6">
            <p className="text-brand-dark leading-relaxed">Link inválido. Solicite uma nova redefinição de senha.</p>
            <Link to="/esqueci-senha" className="inline-block text-sm uppercase tracking-widest font-bold text-brand-red hover:text-brand-dark transition-all">Recuperar acesso →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-brand-red/20 rounded-xl text-brand-red text-sm font-medium text-center">{error}</div>
            )}
            <div>
              <label htmlFor="senha" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Nova senha</label>
              <input id="senha" name="senha" type="password" placeholder="Mínimo 8 caracteres" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
            </div>
            <div>
              <label htmlFor="confirma" className="block text-xs uppercase tracking-widest font-bold mb-3 text-brand-dark">Confirmar senha</label>
              <input id="confirma" name="confirma" type="password" placeholder="Repita a senha" required className="w-full bg-[#F7F6F3]/50 border border-[#E5E5E5] rounded-xl p-4 text-base focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-teal-700 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
