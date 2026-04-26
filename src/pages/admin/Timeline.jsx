import { useState, useEffect } from 'react'
import { getTimeline, addTimeline, updateTimeline, deleteTimeline } from '../../store/data'

export default function AdminTimeline() {
  const [timeline, setTimeline] = useState([])
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)

  const carregar = async () => {
    setLoading(true)
    const res = await getTimeline()
    setTimeline(res)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const data = {
      ano: e.target.ano.value,
      titulo: e.target.titulo.value,
      descricao: e.target.descricao.value
    }
    if (edit?.id) {
      await updateTimeline(edit.id, data)
    } else {
      await addTimeline(data)
    }
    await carregar()
    setEdit(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este marco?')) {
      await deleteTimeline(id)
      await carregar()
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Gerenciar Trajetória</h2>
          <p className="text-sm text-brand-gray">Gerencie os marcos exibidos na página inicial.</p>
        </div>
        {!edit && <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={() => setEdit({})}>+ Novo Marco</button>}
      </div>

      {edit ? (
        <form onSubmit={handleSave} className="bg-white p-8 border border-[#E5E5E5] space-y-6">
          <h3 className="font-serif text-2xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{edit.id ? 'Editar Marco' : 'Novo Marco'}</h3>
          
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Ano ou Período (ex: 2019 – 2025)</label>
            <input type="text" name="ano" defaultValue={edit.ano} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Título / Cargo</label>
            <input type="text" name="titulo" defaultValue={edit.titulo} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Descrição</label>
            <textarea name="descricao" defaultValue={edit.descricao} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors min-h-[100px] resize-y" />
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
            <button type="submit" className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-8 py-3 hover:bg-red-800 transition-colors">Salvar</button>
            <button type="button" className="border border-[#E5E5E5] text-brand-dark text-xs uppercase tracking-widest font-bold px-8 py-3 hover:border-brand-dark transition-colors" onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {timeline.map(t => (
            <div key={t.id} className="bg-white p-6 border border-[#E5E5E5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-red transition-colors">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-widest bg-brand-dark text-white px-2 py-1">{t.ano}</span>
                  <strong className="text-sm uppercase tracking-widest font-bold text-brand-dark">{t.titulo}</strong>
                </div>
                <p className="text-sm text-brand-gray leading-relaxed max-w-3xl">{t.descricao}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                <button onClick={() => setEdit(t)} className="flex-1 md:flex-none border border-[#E5E5E5] text-brand-dark text-xs uppercase tracking-widest font-bold px-4 py-2 hover:border-brand-dark transition-colors">Editar</button>
                <button onClick={() => handleDelete(t.id)} className="flex-1 md:flex-none border border-red-200 text-brand-red text-xs uppercase tracking-widest font-bold px-4 py-2 hover:bg-red-50 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
          {timeline.length === 0 && !loading && <p className="text-sm text-brand-gray p-8 text-center border border-[#E5E5E5] bg-white">Nenhum marco cadastrado.</p>}
          {loading && <p className="text-sm text-brand-gray">Carregando...</p>}
        </div>
      )}
    </div>
  )
}
