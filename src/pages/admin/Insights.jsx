import { useState, useEffect } from 'react'
import { getInsights, addInsight, updateInsight, deleteInsight } from '../../store/data'

export default function AdminInsights() {
  const [insights, setInsights] = useState([])
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)

  const carregar = async () => {
    setLoading(true)
    const res = await getInsights()
    setInsights(res)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const data = {
      data: e.target.data.value,
      titulo: e.target.titulo.value,
      texto: e.target.texto.value,
      linkOriginal: e.target.linkOriginal.value,
      mediaUrl: e.target.mediaUrl.value
    }
    if (edit?.id) {
      await updateInsight(edit.id, data)
    } else {
      await addInsight(data)
    }
    await carregar()
    setEdit(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este insight?')) {
      await deleteInsight(id)
      await carregar()
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Gerenciar LinkedIn Insights</h2>
          <p className="text-sm text-brand-gray">Publique suas reflexões rápidas do LinkedIn no site.</p>
        </div>
        {!edit && <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={() => setEdit({})}>+ Novo Insight</button>}
      </div>

      {edit ? (
        <form onSubmit={handleSave} className="bg-white p-8 border border-[#E5E5E5] space-y-6">
          <h3 className="font-serif text-2xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{edit.id ? 'Editar Insight' : 'Novo Insight'}</h3>
          
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Data / Tempo (ex: "Há 3 dias" ou "15 Jan 2024")</label>
            <input type="text" name="data" defaultValue={edit.data} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Título ou Frase de Destaque</label>
            <input type="text" name="titulo" defaultValue={edit.titulo} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Texto Completo do Post</label>
            <textarea name="texto" defaultValue={edit.texto} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors min-h-[150px] resize-y" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Link Original do LinkedIn</label>
            <input type="url" name="linkOriginal" defaultValue={edit.linkOriginal} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">URL de Mídia (Opcional - Foto ou Vídeo)</label>
            <input type="url" name="mediaUrl" defaultValue={edit.mediaUrl || edit.imagemUrl || ''} placeholder="https://... (link de imagem, .mp4 ou YouTube)" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
            <small className="text-[#8F8F8F] text-xs mt-2 block">Cole o link direto de uma imagem, de um vídeo (.mp4) ou do YouTube.</small>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
            <button type="submit" className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-8 py-3 hover:bg-red-800 transition-colors">Salvar</button>
            <button type="button" className="border border-[#E5E5E5] text-brand-dark text-xs uppercase tracking-widest font-bold px-8 py-3 hover:border-brand-dark transition-colors" onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {insights.map(i => (
            <div key={i.id} className="bg-white p-6 border border-[#E5E5E5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-red transition-colors">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-widest bg-brand-dark text-white px-2 py-1">{i.data}</span>
                  <strong className="text-sm uppercase tracking-widest font-bold text-brand-dark">{i.titulo}</strong>
                </div>
                <p className="text-sm text-brand-gray leading-relaxed max-w-3xl">{i.texto.substring(0, 100)}...</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                <button onClick={() => setEdit(i)} className="flex-1 md:flex-none border border-[#E5E5E5] text-brand-dark text-xs uppercase tracking-widest font-bold px-4 py-2 hover:border-brand-dark transition-colors">Editar</button>
                <button onClick={() => handleDelete(i.id)} className="flex-1 md:flex-none border border-red-200 text-brand-red text-xs uppercase tracking-widest font-bold px-4 py-2 hover:bg-red-50 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
          {insights.length === 0 && !loading && <p className="text-sm text-brand-gray p-8 text-center border border-[#E5E5E5] bg-white">Nenhum insight cadastrado.</p>}
          {loading && <p className="text-sm text-brand-gray">Carregando...</p>}
        </div>
      )}
    </div>
  )
}
