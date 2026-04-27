import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

// ── Google Translate – cookie + masked reload ──
function LangToggle() {
  const [isEn, setIsEn] = useState(() => document.cookie.includes('googtrans=/pt/en'))

  useEffect(() => {
    if (document.getElementById('gtranslate-script')) return
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'en,pt',
        autoDisplay: false
      }, 'google_translate_element')
    }
    const script = document.createElement('script')
    script.id = 'gtranslate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    // On load: if we just switched languages, fade in from overlay
    if (sessionStorage.getItem('lang_switch')) {
      sessionStorage.removeItem('lang_switch')
      const overlay = document.getElementById('lang-overlay')
      if (overlay) {
        overlay.style.opacity = '1'
        overlay.style.display = 'block'
        requestAnimationFrame(() => {
          overlay.style.transition = 'opacity 0.4s ease-out'
          overlay.style.opacity = '0'
          setTimeout(() => { overlay.style.display = 'none' }, 400)
        })
      }
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    const goingToEn = !isEn
    const host = window.location.hostname
    if (goingToEn) {
      document.cookie = 'googtrans=/pt/en; path=/'
      document.cookie = `googtrans=/pt/en; path=/; domain=${host}`
      document.cookie = `googtrans=/pt/en; path=/; domain=.${host}`
    } else {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
      document.cookie = `googtrans=; path=/; domain=${host}; expires=Thu, 01 Jan 1970 00:00:00 UTC`
      document.cookie = `googtrans=; path=/; domain=.${host}; expires=Thu, 01 Jan 1970 00:00:00 UTC`
    }
    setIsEn(goingToEn)
    sessionStorage.setItem('lang_switch', '1')

    // Fade out, then reload
    const overlay = document.getElementById('lang-overlay')
    if (overlay) {
      overlay.style.display = 'block'
      overlay.style.transition = 'opacity 0.3s ease-in'
      overlay.style.opacity = '0'
      requestAnimationFrame(() => {
        overlay.style.opacity = '1'
        setTimeout(() => {
          window.location.assign(window.location.pathname + window.location.search)
        }, 300)
      })
    } else {
      window.location.assign(window.location.pathname + window.location.search)
    }
  }, [isEn])

  return (
    <>
      {/* Full-screen overlay for smooth language switch */}
      <div id="lang-overlay" style={{ display: 'none', opacity: 0, position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#F5F2ED', pointerEvents: 'none' }}></div>
      <button
        onClick={toggleLanguage}
        className="relative flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-brand-gray hover:text-brand-dark transition-colors select-none notranslate cursor-pointer px-1 py-1"
        title={isEn ? 'Mudar para Português' : 'Switch to English'}
        aria-label="Toggle language"
      >
        <span className={!isEn ? 'text-brand-dark' : 'text-brand-gray/40'}>PT</span>
        <span className="relative inline-block w-9 h-[20px] rounded-full bg-brand-dark/10">
          <span className={`absolute top-[4px] w-3 h-3 rounded-full bg-brand-red shadow-sm transition-all duration-300 ${isEn ? 'left-[19px]' : 'left-[4px]'}`}></span>
        </span>
        <span className={isEn ? 'text-brand-dark' : 'text-brand-gray/40'}>EN</span>
      </button>
    </>
  )
}


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Início' },
    { to: '/especialidades', label: 'Especialidades' },
    { to: '/midia', label: 'Mídia' },
    { to: '/agenda', label: 'Agenda' }
  ]

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="!absolute !-top-[9999px] !-left-[9999px]"></div>

      <header style={{ zIndex: 100 }} className="fixed top-0 left-0 w-full bg-brand-bg/90 backdrop-blur-sm border-b border-[#E5E5E5]">
        <nav className="max-w-7xl mx-auto px-6 lg:px-24 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif italic text-xl tracking-wider notranslate" onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Rachel Freixo</Link>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-bold">
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} onClick={() => { if (l.to === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={({isActive}) => isActive ? "text-brand-red border-b border-brand-red pb-1" : "hover:text-brand-red transition-colors"}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/contato" className="bg-brand-dark text-white px-6 py-2 hover:bg-black transition-colors">Contato</NavLink>
            </li>
            <li className="ml-2 border-l border-[#E5E5E5] pl-4">
              <LangToggle />
            </li>
          </ul>

          <div className="flex md:hidden items-center gap-3">
            <LangToggle />
            <button 
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
              <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-[2px] bg-brand-dark transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: '#F5F2ED' }}
          className="md:hidden flex flex-col items-center justify-center gap-10"
        >
          {links.map(l => (
            <NavLink 
              key={l.to} 
              to={l.to} 
              end={l.to === '/'} 
              onClick={() => { setMenuOpen(false); if (l.to === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className={({isActive}) => `font-serif text-4xl tracking-wide ${isActive ? 'text-brand-red' : 'text-brand-dark'}`}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="w-12 h-[1px] bg-brand-dark/20"></div>
          <NavLink 
            to="/contato" 
            onClick={() => setMenuOpen(false)}
            className="bg-brand-dark text-white text-xs uppercase tracking-widest font-bold px-10 py-4"
          >
            Contato
          </NavLink>
        </div>
      )}
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="md:w-1/3">
          <p className="font-serif italic text-2xl mb-4 notranslate">Rachel Freixo</p>
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
    <div className="pt-20">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
