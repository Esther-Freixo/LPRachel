import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../store/data'

export default function AdminLayout() {
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const links = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/timeline', label: 'Trajetória' },
    { to: '/admin/publicacoes', label: 'Publicações' },
    { to: '/admin/agenda', label: 'Agenda' },
    { to: '/admin/insights', label: 'LinkedIn Insights' },
    { to: '/admin/citacoes', label: 'Citações Animadas' },
  ]

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans text-brand-dark">
      <aside className="w-64 flex-shrink-0 bg-brand-dark flex flex-col p-8 border-r border-brand-dark">
        <p className="font-serif italic text-2xl text-white mb-2">Rachel Freixo</p>
        <p className="text-[10px] uppercase tracking-widest text-[#8F8F8F] mb-12">Painel Administrativo</p>
        <nav className="flex flex-col gap-2 flex-grow">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `
              text-xs uppercase tracking-widest font-bold px-4 py-3 transition-colors
              ${isActive ? 'bg-white/10 text-white' : 'text-[#8F8F8F] hover:text-white hover:bg-white/5'}
            `}>
              {l.label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold px-4 py-3 text-[#8F8F8F] hover:text-white hover:bg-white/5 transition-colors mt-8 border-t border-white/10 pt-6">
            Ver site ↗
          </a>
        </nav>
        <button onClick={handleLogout} className="text-xs uppercase tracking-widest font-bold text-[#8F8F8F] hover:text-brand-red text-left px-4 py-3 transition-colors mt-auto border-t border-white/10 pt-4">
          Sair do Painel
        </button>
      </aside>
      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
