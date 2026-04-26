import { useState } from 'react'
import { getMidias } from '../store/data'
import useData from '../hooks/useData'
import useScrollReveal from '../hooks/useScrollReveal'

function R({ children, className, delay = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal ${delay} ${className || ''}`}>{children}</div>
}

const TIPOS = [
  { key: 'todos', label: 'Todos' },
  { key: 'podcast', label: 'Podcasts' },
  { key: 'video', label: 'Vídeos' },
  { key: 'entrevista', label: 'Entrevistas' },
]

// Default thumbnails per category
const DEFAULT_THUMBNAILS = {
  podcast: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop&q=80',
  video: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop&q=80',
  entrevista: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&q=80',
}

// Extract YouTube video ID
function getYoutubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return match ? match[1] : null
}

// Get thumbnail: admin-uploaded > YouTube auto > category default
function getThumbnail(item) {
  if (item.thumbnail_url) return item.thumbnail_url
  const ytId = getYoutubeId(item.url)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  return DEFAULT_THUMBNAILS[item.tipo] || DEFAULT_THUMBNAILS.video
}

// Auto-detect platform from URL
function detectPlatforma(url) {
  if (!url) return 'outro'
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  return 'outro'
}

// Platform badge config
const PLATFORM_BADGE = {
  spotify: {
    bg: 'bg-[#1DB954]',
    label: 'Spotify',
    cta: 'Ouvir no Spotify',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  youtube: {
    bg: 'bg-[#FF0000]',
    label: 'YouTube',
    cta: 'Assistir no YouTube',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  outro: {
    bg: 'bg-brand-dark',
    label: 'Link',
    cta: 'Acessar conteúdo',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
    ),
  },
}

const TIPO_LABEL = {
  podcast: 'Podcast',
  video: 'Vídeo',
  entrevista: 'Entrevista',
}

export default function Midia() {
  const [filter, setFilter] = useState('todos')
  const { data: midias, loading } = useData(getMidias)
  const items = midias || []

  const filtered = filter === 'todos' 
    ? items 
    : items.filter(m => m.tipo === filter)

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full min-h-screen">

      {/* HERO */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <R>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-red"></div>
              <span className="text-sm uppercase tracking-widest font-bold text-brand-red">Mídia</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight text-brand-dark">
              Participações<br/>
              <span className="text-brand-gray">&</span> Entrevistas
            </h1>
            <p className="text-brand-gray text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Podcasts, vídeos e webinários onde Rachel compartilha sua visão sobre tributação, ESG e governança.
            </p>
          </R>
        </div>
      </section>

      {/* FILTERS + GRID */}
      <section className="px-6 md:px-16 lg:px-24 pb-32">
        <div className="max-w-7xl mx-auto">

          {/* Filter Tabs */}
          <R>
            <div className="flex flex-wrap gap-3 mb-12 border-b border-[#E5E5E5] pb-6">
              {TIPOS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`text-xs uppercase tracking-widest font-bold px-6 py-3 transition-all duration-300 rounded-full ${
                    filter === t.key
                      ? 'bg-brand-dark text-white'
                      : 'bg-white text-brand-gray border border-[#E5E5E5] hover:border-brand-dark hover:text-brand-dark'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </R>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-brand-gray">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-brand-gray">Nenhum conteúdo encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item, idx) => {
                const platform = PLATFORM_BADGE[detectPlatforma(item.url)] || PLATFORM_BADGE.outro
                const thumbnail = getThumbnail(item)
                const tipoLabel = TIPO_LABEL[item.tipo] || 'Mídia'

                return (
                  <R key={item.id} delay={`reveal-delay-${(idx % 4) + 1}`}>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col h-full bg-transparent transition-all duration-500"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5">
                        <img 
                          src={thumbnail} 
                          alt={item.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => { e.target.src = DEFAULT_THUMBNAILS[item.tipo] || DEFAULT_THUMBNAILS.video }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <div className={`backdrop-blur-md bg-white/10 border border-white/20 text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm`}>
                            {platform.icon}
                            <span>{platform.label}</span>
                          </div>
                          <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
                            {tipoLabel}
                          </div>
                        </div>

                        {/* Play Button Overlay (always visible, scales on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-brand-red/90 group-hover:border-brand-red transition-all duration-500">
                            <svg className="w-5 h-5 md:w-6 md:h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-grow flex flex-col px-2">
                        <h3 className="font-serif text-xl md:text-2xl text-brand-dark leading-[1.3] mb-3 group-hover:text-brand-red transition-colors duration-300 line-clamp-3">
                          {item.titulo}
                        </h3>
                        {item.descricao && (
                          <p className="text-sm text-brand-gray/80 leading-relaxed line-clamp-2 mb-5">
                            {item.descricao}
                          </p>
                        )}
                        <div className="mt-auto pt-2 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-red group-hover:text-red-800 transition-colors duration-300">
                          <span>{platform.cta}</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                          </svg>
                        </div>
                      </div>
                    </a>
                  </R>
                )
              })}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
