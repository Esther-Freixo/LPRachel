import { useState, useEffect } from 'react'
import { getMidias, addMidia, updateMidia, deleteMidia } from '../../store/data'

const EMPTY = { titulo: '', tipo: 'podcast', url: '', descricao: '', thumbnail_url: '' }

function detectPlatforma(url) {
  if (!url) return ''
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  return 'outro'
}

// Extract YouTube video ID for thumbnail preview
function getYoutubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return match ? match[1] : null
}

export default function AdminMidias() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [autoFilling, setAutoFilling] = useState(false)

  async function refresh() {
    setLoading(true)
    const res = await getMidias()
    setItems(res)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  function openNew() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(p) { 
    setForm({ titulo: p.titulo, tipo: p.tipo, url: p.url, descricao: p.descricao || '', thumbnail_url: p.thumbnail_url || '' }); 
    setEditId(p.id); 
    setModal(true) 
  }
  async function del(id) { if (window.confirm('Excluir esta mídia?')) { await deleteMidia(id); await refresh() } }

  // YouTube auto-fill: uses noembed.com to fetch title/description
  async function handleUrlChange(url) {
    setForm(prev => ({ ...prev, url }))
    
    const ytId = getYoutubeId(url)
    if (ytId && !editId) {
      setAutoFilling(true)
      try {
        const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
        const data = await res.json()
        if (data.title) {
          setForm(prev => ({
            ...prev,
            titulo: prev.titulo || data.title,
            descricao: prev.descricao || (data.author_name ? `Por ${data.author_name}` : ''),
          }))
        }
      } catch (err) {
        // Silently fail — admin can fill manually
      }
      setAutoFilling(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const plataforma = detectPlatforma(form.url)
    const data = { ...form, plataforma, ordem: editId ? undefined : items.length + 1 }
    // Don't send empty thumbnail_url
    if (!data.thumbnail_url) delete data.thumbnail_url
    if (data.ordem === undefined) delete data.ordem
    if (editId) await updateMidia(editId, data); else await addMidia(data)
    setModal(false); await refresh()
  }

  const tipoLabel = { podcast: '🎙️ Podcast', video: '🎥 Vídeo', entrevista: '💬 Entrevista' }
  const platLabel = { spotify: 'Spotify', youtube: 'YouTube', outro: 'Outro' }

  // Preview thumbnail
  function getPreviewThumb(url, customThumb) {
    if (customThumb) return customThumb
    const ytId = getYoutubeId(url)
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    return null
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Mídia</h2>
          <p className="text-sm text-brand-gray">Gerencie os podcasts, vídeos e entrevistas. Cole um link do YouTube para preencher automaticamente.</p>
        </div>
        <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={openNew}>+ Nova Mídia</button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && !loading ? (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center">
            <p className="text-sm text-brand-gray">Nenhuma mídia cadastrada. Clique em "+ Nova Mídia" para começar.</p>
          </div>
        ) : items.map((p, idx) => {
          const thumbPreview = getPreviewThumb(p.url, p.thumbnail_url)
          return (
            <div key={p.id} className="bg-white border border-[#E5E5E5] p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:shadow-md transition-shadow">
              {/* Thumbnail preview */}
              {thumbPreview && (
                <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-brand-dark/5">
                  <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-lg">{tipoLabel[p.tipo]?.slice(0,2) || '📎'}</span>
                <div className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                  detectPlatforma(p.url) === 'spotify' ? 'bg-[#1DB954]/10 text-[#1DB954]' : 
                  detectPlatforma(p.url) === 'youtube' ? 'bg-[#FF0000]/10 text-[#FF0000]' : 
                  'bg-brand-dark/10 text-brand-dark'
                }`}>{platLabel[detectPlatforma(p.url)]}</div>
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-brand-dark text-sm leading-relaxed truncate">{p.titulo}</p>
                {p.descricao && <p className="text-xs text-brand-gray truncate mt-1">{p.descricao}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-3 py-2 hover:border-brand-dark transition-colors">Abrir</a>
                <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-3 py-2 hover:border-brand-dark transition-colors">Editar</button>
                <button onClick={() => del(p.id)} className="text-[10px] uppercase tracking-widest font-bold border border-red-200 text-brand-red px-3 py-2 hover:bg-red-50 transition-colors">Excluir</button>
              </div>
            </div>
          )
        })}
        {loading && <div className="bg-white border border-[#E5E5E5] p-8 text-center text-sm text-brand-gray">Carregando...</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/80 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl p-8">
            <h2 className="font-serif text-3xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{editId ? 'Editar Mídia' : 'Nova Mídia'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Link (URL)</label>
                <input type="url" value={form.url} onChange={e => handleUrlChange(e.target.value)} required placeholder="Cole o link do YouTube ou Spotify" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                <div className="flex items-center gap-2 mt-2">
                  {form.url && (
                    <p className="text-xs text-brand-gray">
                      Plataforma: <span className="font-bold text-brand-dark">{platLabel[detectPlatforma(form.url)] || 'Outro'}</span>
                    </p>
                  )}
                  {autoFilling && <span className="text-xs text-brand-red animate-pulse">Preenchendo automaticamente...</span>}
                </div>
              </div>

              {/* Thumbnail preview */}
              {(() => {
                const previewUrl = getPreviewThumb(form.url, form.thumbnail_url)
                return previewUrl ? (
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Preview da Thumbnail</label>
                    <div className="w-full aspect-video rounded overflow-hidden bg-brand-dark/5 border border-[#E5E5E5]">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ) : null
              })()}

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Título {autoFilling && <span className="text-brand-red font-normal">(preenchido automaticamente)</span>}</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required placeholder="Ex: ESG & TAX: Tributação Responsável" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors">
                  <option value="podcast">🎙️ Podcast</option>
                  <option value="video">🎥 Vídeo / Webinário</option>
                  <option value="entrevista">💬 Entrevista</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Descrição <span className="text-brand-gray font-normal">(opcional — preenchido pelo YouTube)</span></label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descrição do conteúdo..." className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors resize-y" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Thumbnail personalizada <span className="text-brand-gray font-normal">(opcional — URL da imagem)</span></label>
                <input type="url" value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://... (deixe vazio para usar thumbnail automática)" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                <p className="text-[11px] text-brand-gray mt-1.5">Se vazio: usa thumbnail do YouTube automaticamente, ou imagem padrão da categoria.</p>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
                <button type="submit" className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-8 py-3 hover:bg-red-800 transition-colors">Salvar</button>
                <button type="button" className="border border-[#E5E5E5] text-brand-dark text-xs uppercase tracking-widest font-bold px-8 py-3 hover:border-brand-dark transition-colors" onClick={() => setModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
