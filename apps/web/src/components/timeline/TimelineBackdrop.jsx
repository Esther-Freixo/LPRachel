// Fundo trabalhado e em camadas para a timeline — atua como "arte" da seção.
// Tudo decorativo (pointer-events-none), atrás do conteúdo. Paleta da marca
// (teal + cream) com clima editorial/acadêmico, agora mais presente.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function Plus({ className }) {
  return (
    <div className={`absolute text-brand-red/30 ${className}`} aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default function TimelineBackdrop({ label = 'Trajetória · 2005 — 2024' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Malha de gradiente (base) — mais forte e direcional */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 12% 18%, rgba(0,180,166,0.22) 0%, transparent 58%),' +
            'radial-gradient(ellipse 50% 55% at 90% 78%, rgba(0,180,166,0.18) 0%, transparent 56%),' +
            'radial-gradient(circle at 50% 50%, rgba(0,180,166,0.06) 0%, transparent 45%),' +
            'linear-gradient(140deg, #EFF4F1 0%, #F3EDE4 55%, #EFE9DF 100%)',
        }}
      />

      {/* 2. Linhas-guia verticais (grade editorial) */}
      <div className="absolute inset-y-0 left-[12%] w-px bg-brand-dark/[0.06]"></div>
      <div className="absolute inset-y-0 left-[28%] w-px bg-brand-dark/[0.05]"></div>
      <div className="absolute inset-y-0 right-[28%] w-px bg-brand-dark/[0.05]"></div>
      <div className="absolute inset-y-0 right-[12%] w-px bg-brand-dark/[0.06]"></div>

      {/* 3. Grid de pontos com máscara radial (vive nas bordas) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(28,28,28,0.16) 1.2px, transparent 1.6px)',
          backgroundSize: '34px 34px',
          opacity: 0.7,
          WebkitMaskImage: 'radial-gradient(ellipse 58% 52% at 50% 50%, transparent 8%, black 80%)',
          maskImage: 'radial-gradient(ellipse 58% 52% at 50% 50%, transparent 8%, black 80%)',
        }}
      />

      {/* 4. Orbes ambiente flutuando — maiores */}
      <div className="absolute -top-[8%] -left-[6%] w-[620px] h-[620px] rounded-full bg-brand-red/[0.18] blur-[150px] animate-float"></div>
      <div className="absolute -bottom-[10%] -right-[8%] w-[560px] h-[560px] rounded-full bg-brand-red/[0.15] blur-[140px] animate-float-delayed"></div>
      <div className="absolute top-[40%] left-[48%] w-[360px] h-[360px] rounded-full bg-brand-red/[0.07] blur-[120px] animate-float"></div>

      {/* 5. Marcas decorativas (técnico/editorial) */}
      <Plus className="top-[16%] left-[14%]" />
      <Plus className="top-[74%] left-[12%]" />
      <Plus className="top-[24%] right-[14%]" />
      <Plus className="bottom-[16%] right-[28%]" />

      {/* 6. Grão */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundImage: NOISE, backgroundSize: '170px 170px', opacity: 0.05 }}
      ></div>

      {/* 7. Acentos de canto (colchetes teal) */}
      <div className="absolute top-7 left-7 w-14 h-14 border-l-2 border-t-2 border-brand-red/40"></div>
      <div className="absolute bottom-7 right-7 w-14 h-14 border-r-2 border-b-2 border-brand-red/40"></div>

      {/* 8. Rótulo vertical */}
      <div
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-brand-dark/30 uppercase tracking-[0.35em] text-[10px] font-bold"
        style={{ writingMode: 'vertical-rl' }}
      >
        {label}
      </div>
    </div>
  )
}
