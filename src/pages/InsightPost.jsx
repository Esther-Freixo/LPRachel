import { useParams, Link } from 'react-router-dom'
import { getInsights } from '../store/data'
import useData from '../hooks/useData'

export default function InsightPost() {
  const { id } = useParams()
  const { data: insights, loading } = useData(getInsights)
  
  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <h2 className="text-sm text-brand-gray uppercase tracking-widest font-bold">Carregando...</h2>
    </div>
  )

  const post = (insights || []).find(i => i.id == id)

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-3xl mb-8">Reflexão não encontrada.</h2>
        <Link to="/agenda" className="border border-brand-dark text-brand-dark text-xs uppercase px-6 py-2 hover:bg-brand-dark hover:text-white transition-colors">Voltar</Link>
      </div>
    )
  }

  const media = post.mediaUrl || post.imagemUrl
  const renderMedia = () => {
    if (!media) return null
    if (media.includes('youtube.com') || media.includes('youtu.be')) {
      let videoId = media.split('v=')[1]
      if (!videoId) videoId = media.split('youtu.be/')[1]
      const ampersandPosition = videoId?.indexOf('&')
      if (ampersandPosition !== -1) videoId = videoId?.substring(0, ampersandPosition)
      
      return (
        <div className="mb-12 relative pb-[56.25%] h-0 overflow-hidden bg-[#E5E5E5]">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} className="absolute top-0 left-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )
    }
    if (media.endsWith('.mp4') || media.includes('.mp4?')) {
      return (
        <div className="mb-12 bg-[#E5E5E5]">
          <video src={media} controls className="w-full h-auto" />
        </div>
      )
    }
    return (
      <div className="mb-12 bg-[#E5E5E5]">
        <img src={media} alt="Mídia do post" className="w-full h-auto object-cover" />
      </div>
    )
  }

  return (
    <main className="font-sans text-brand-dark bg-brand-bg w-full min-h-screen">
      <section className="pt-32 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-red block mb-4">Reflexão · {post.data}</span>
          <h1 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">{post.titulo}</h1>
        </div>
      </section>

      <section className="px-8 md:px-16 lg:px-24 pb-32">
        <div className="max-w-3xl mx-auto">
          {renderMedia()}
          
          <div className="whitespace-pre-wrap text-brand-dark text-base md:text-lg leading-relaxed mb-16">
            {post.texto}
          </div>

          <div className="pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row gap-4">
            <a href={post.linkOriginal} target="_blank" rel="noopener noreferrer" className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-8 py-4 text-center hover:bg-red-800 transition-colors">
              Ver post original no LinkedIn ↗
            </a>
            <Link to="/agenda" className="border border-[#E5E5E5] bg-white text-brand-dark text-xs uppercase tracking-widest font-bold px-8 py-4 text-center hover:border-brand-red transition-colors">
              Voltar para a Agenda
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
