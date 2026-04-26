import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../store/data'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/login') }

  const links = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/timeline', label: 'Trajetória' },
    { to: '/admin/publicacoes', label: 'Publicações' },
    { to: '/admin/agenda', label: 'Agenda' },
    { to: '/admin/midias', label: 'Mídia' },
    { to: '/admin/insights', label: 'LinkedIn Insights' },
    { to: '/admin/citacoes', label: 'Citações Animadas' },
  ]

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans text-brand-dark">
      
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-brand-dark flex items-center justify-between px-4 h-14">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-white w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Menu Admin"
        >
          <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
          <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
        </button>
        <p className="font-serif italic text-white text-lg">Painel Admin</p>
        <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest font-bold text-[#8F8F8F] hover:text-brand-red transition-colors">
          Sair
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex-shrink-0 bg-brand-dark flex flex-col p-8 pt-20 md:pt-8 border-r border-brand-dark
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <p className="font-serif italic text-2xl text-white mb-2">Rachel Freixo</p>
        <p className="text-[10px] uppercase tracking-widest text-[#8F8F8F] mb-12">Painel Administrativo</p>
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
          {links.map(l => (
            <NavLink 
              key={l.to} 
              to={l.to} 
              end={l.end} 
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                text-xs uppercase tracking-widest font-bold px-4 py-3 transition-colors
                ${isActive ? 'bg-white/10 text-white' : 'text-[#8F8F8F] hover:text-white hover:bg-white/5'}
              `}
            >
              {l.label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold px-4 py-3 text-[#8F8F8F] hover:text-white hover:bg-white/5 transition-colors mt-8 border-t border-white/10 pt-6">
            Ver site ↗
          </a>
        </nav>
        <button onClick={handleLogout} className="hidden md:block text-xs uppercase tracking-widest font-bold text-[#8F8F8F] hover:text-brand-red text-left px-4 py-3 transition-colors mt-auto border-t border-white/10 pt-4">
          Sair do Painel
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 pt-20 md:pt-8 md:p-16 overflow-x-hidden overflow-y-auto min-w-0">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
