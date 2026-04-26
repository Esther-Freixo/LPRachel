import { useState, useEffect } from 'react'
import { getCitacoes, addCitacao, updateCitacao, deleteCitacao } from '../../store/data'

const EMPTY = { texto: '' }

export default function AdminCitacoes() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const res = await getCitacoes()
    setItems(res)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  function openNew() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(p) { setForm({ texto: p.texto }); setEditId(p.id); setModal(true) }
  async function del(id) { if (window.confirm('Excluir esta citação?')) { await deleteCitacao(id); await refresh() } }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editId) await updateCitacao(editId, { texto: form.texto }); else await addCitacao({ texto: form.texto })
    setModal(false); await refresh()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Citações</h2>
          <p className="text-sm text-brand-gray">Gerencie as frases que aparecem em destaque na tela Especialidades. O estilo visual é aplicado automaticamente.</p>
        </div>
        <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={openNew}>+ Nova citação</button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && !loading ? (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center">
            <p className="text-sm text-brand-gray">Nenhuma citação cadastrada. Clique em "+ Nova citação" para começar.</p>
          </div>
        ) : items.map((p, idx) => (
          <div key={p.id} className="bg-white border border-[#E5E5E5] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </div>
            <div className="flex-grow">
              <p className="font-serif text-lg text-brand-dark italic leading-relaxed">"{p.texto}"</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-4 py-2 hover:border-brand-dark transition-colors">Editar</button>
              <button onClick={() => del(p.id)} className="text-[10px] uppercase tracking-widest font-bold border border-red-200 text-brand-red px-4 py-2 hover:bg-red-50 transition-colors">Excluir</button>
            </div>
          </div>
        ))}
        {loading && <div className="bg-white border border-[#E5E5E5] p-8 text-center text-sm text-brand-gray">Carregando...</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/80 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl p-8">
            <h2 className="font-serif text-3xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{editId ? 'Editar Citação' : 'Nova Citação'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Frase da Citação</label>
                <textarea rows={4} value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} required placeholder="Ex: O rigor científico é a bússola que orienta a excelência..." className="w-full border border-[#E5E5E5] p-4 text-base font-serif italic focus:border-brand-red focus:outline-none transition-colors resize-y" />
                <p className="text-xs text-brand-gray mt-2">O estilo visual (cores e fundo) será aplicado automaticamente para combinar com o design do site.</p>
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
