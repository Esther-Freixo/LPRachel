// Fundo da timeline — depois de calibrar: profundidade suave, sem poluir.
// O elemento de destaque é o "ano gigante" (renderizado no componente pai).
// Aqui ficam só: malha de gradiente sutil, dois orbes, grão e rótulo vertical.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function TimelineBackdrop({ label = 'Trajetória · 2005 — 2024' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Malha de gradiente — depth sutil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 14% 20%, rgba(0,180,166,0.12) 0%, transparent 60%),' +
            'radial-gradient(ellipse 50% 55% at 88% 80%, rgba(0,180,166,0.09) 0%, transparent 58%),' +
            'linear-gradient(150deg, #F4F0E9 0%, #F1EBE2 100%)',
        }}
      />

      {/* Orbes ambiente flutuando */}
      <div className="absolute -top-[6%] -left-[4%] w-[520px] h-[520px] rounded-full bg-brand-red/[0.09] blur-[150px] animate-float"></div>
      <div className="absolute -bottom-[8%] -right-[6%] w-[440px] h-[440px] rounded-full bg-brand-red/[0.07] blur-[140px] animate-float-delayed"></div>

      {/* Grão */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundImage: NOISE, backgroundSize: '180px 180px', opacity: 0.03 }}
      ></div>

      {/* Rótulo vertical (único acento editorial) */}
      <div
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-brand-dark/20 uppercase tracking-[0.35em] text-[10px] font-bold"
        style={{ writingMode: 'vertical-rl' }}
      >
        {label}
      </div>
    </div>
  )
}
