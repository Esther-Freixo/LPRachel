import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Início' },
    { to: '/especialidades', label: 'Especialidades' },
    { to: '/agenda', label: 'Agenda' }
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-bg/90 backdrop-blur-sm border-b border-[#E5E5E5]">
      <nav className="max-w-7xl mx-auto px-6 lg:px-24 h-20 flex items-center justify-between">
        <Link to="/" className="font-serif italic text-xl tracking-wider" onClick={() => setMenuOpen(false)}>Rachel Freixo</Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-bold">
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({isActive}) => isActive ? "text-brand-red border-b border-brand-red pb-1" : "hover:text-brand-red transition-colors"}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/contato" className="bg-brand-dark text-white px-6 py-2 hover:bg-black transition-colors">Contato</NavLink>
          </li>
        </ul>

        {/* Hamburger Button (Mobile) */}
        <button 
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-brand-bg z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(l => (
          <NavLink 
            key={l.to} 
            to={l.to} 
            end={l.to === '/'} 
            onClick={() => setMenuOpen(false)}
            className={({isActive}) => `font-serif text-3xl tracking-wide transition-colors ${isActive ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}`}
          >
            {l.label}
          </NavLink>
        ))}
        <NavLink 
          to="/contato" 
          onClick={() => setMenuOpen(false)}
          className="bg-brand-dark text-white text-xs uppercase tracking-widest font-bold px-10 py-4 hover:bg-brand-red transition-colors mt-4"
        >
          Contato
        </NavLink>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="md:w-1/3">
          <p className="font-serif italic text-2xl mb-4">Rachel Freixo</p>
          <p className="text-xs text-[#8F8F8F] uppercase tracking-widest mb-4">Conselheira CARF · Tributarista</p>
          <p className="text-sm text-[#8F8F8F] leading-relaxed">Direito Tributário, Governança e Políticas Públicas com rigor técnico e compromisso institucional.</p>
        </div>
        <div className="flex gap-12 md:gap-16">
          <div>
            <strong className="block mb-4 text-xs uppercase tracking-widest">Navegação</strong>
            <ul className="space-y-2 text-sm text-[#8F8F8F]">
              {[['/', 'Início'], ['/especialidades', 'Especialidades'], ['/agenda', 'Agenda'], ['/contato', 'Contato']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="block mb-4 text-xs uppercase tracking-widest">Institucional</strong>
            <ul className="space-y-2 text-sm text-[#8F8F8F]">
              <li><Link to="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Área Restrita</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between text-xs text-gray-500 gap-2">
        <p>© {new Date().getFullYear()} Rachel Freixo. Todos os direitos reservados.</p>
        <p>Vitória, Espírito Santo</p>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="pt-20"> {/* Add padding top to account for fixed navbar */}
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
