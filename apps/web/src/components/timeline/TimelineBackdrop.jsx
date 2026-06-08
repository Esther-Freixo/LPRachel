// Fundo trabalhado e em camadas para a timeline — atua como "arte" da seção.
// Tudo decorativo (pointer-events-none), atrás do conteúdo. Mantém a paleta
// da marca (teal + cream) com clima editorial/acadêmico.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function Plus({ className }) {
  return (
    <div className={`absolute text-brand-red/25 ${className}`} aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default function TimelineBackdrop({ label = 'Trajetória · 2005 — 2024' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Malha de gradiente (base) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 48% 42% at 14% 22%, rgba(0,180,166,0.13) 0%, transparent 60%),' +
            'radial-gradient(ellipse 42% 48% at 88% 72%, rgba(0,180,166,0.10) 0%, transparent 58%),' +
            'radial-gradient(ellipse 70% 50% at 50% 110%, rgba(28,28,28,0.05) 0%, transparent 60%),' +
            'linear-gradient(180deg, #F6F1EA 0%, #F1EBE2 100%)',
        }}
      />

      {/* 2. Grid de pontos com máscara radial (some no centro, vive nas bordas) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(28,28,28,0.10) 1px, transparent 1.4px)',
          backgroundSize: '30px 30px',
          opacity: 0.6,
          WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, transparent 10%, black 85%)',
          maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, transparent 10%, black 85%)',
        }}
      />

      {/* 3. Orbes ambiente flutuando */}
      <div className="absolute top-[10%] left-[4%] w-[480px] h-[480px] rounded-full bg-brand-red/[0.11] blur-[140px] animate-float"></div>
      <div className="absolute bottom-[6%] right-[6%] w-[400px] h-[400px] rounded-full bg-brand-red/[0.09] blur-[120px] animate-float-delayed"></div>
      <div className="absolute top-[44%] left-[52%] w-[300px] h-[300px] rounded-full bg-brand-red/[0.05] blur-[110px] animate-float"></div>

      {/* 4. Marcas decorativas (técnico/editorial) */}
      <Plus className="top-[18%] left-[22%]" />
      <Plus className="top-[70%] left-[14%]" />
      <Plus className="top-[28%] right-[20%]" />
      <Plus className="bottom-[20%] right-[26%]" />

      {/* 5. Grão */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundImage: NOISE, backgroundSize: '170px 170px', opacity: 0.035 }}
      ></div>

      {/* 6. Acentos de canto (colchetes teal) */}
      <div className="absolute top-7 left-7 w-12 h-12 border-l border-t border-brand-red/30"></div>
      <div className="absolute bottom-7 right-7 w-12 h-12 border-r border-b border-brand-red/30"></div>

      {/* 7. Rótulo vertical */}
      <div
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-brand-dark/25 uppercase tracking-[0.35em] text-[10px] font-bold"
        style={{ writingMode: 'vertical-rl' }}
      >
        {label}
      </div>
    </div>
  )
}
