import { useState, useEffect } from 'react'
import { getCitacoes, addCitacao, updateCitacao, deleteCitacao } from '../../store/data'

const EMPTY = { texto: '', bg: 'bg-white/60', text_col: 'text-brand-dark', border: 'border-brand-red', quote_mark: 'text-brand-dark/10' }

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
  function openEdit(p) { setForm({ ...p }); setEditId(p.id); setModal(true) }
  async function del(id) { if (window.confirm('Excluir esta citação?')) { await deleteCitacao(id); await refresh() } }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editId) await updateCitacao(editId, form); else await addCitacao(form)
    setModal(false); await refresh()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Citações</h2>
          <p className="text-sm text-brand-gray">Gerencie as citações animadas que aparecem na tela Especialidades.</p>
        </div>
        <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={openNew}>+ Nova citação</button>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-dark text-white border-b border-brand-dark">
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Texto</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold hidden md:table-cell">Cor do Fundo (bg)</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-sm text-brand-gray">Nenhuma citação cadastrada.</td></tr>
            ) : items.map(p => (
              <tr key={p.id} className="border-b border-[#E5E5E5] hover:bg-[#EFECE8]/30 transition-colors group">
                <td className="p-4 align-top">
                  <span className="font-bold text-brand-dark text-sm leading-relaxed block max-w-lg">{p.texto}</span>
                </td>
                <td className="p-4 align-top hidden md:table-cell">
                  <span className="text-xs text-brand-gray">{p.bg}</span>
                </td>
                <td className="p-4 align-top text-right whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-3 py-1.5 hover:border-brand-dark transition-colors mr-2">Editar</button>
                  <button onClick={() => del(p.id)} className="text-[10px] uppercase tracking-widest font-bold border border-red-200 text-brand-red px-3 py-1.5 hover:bg-red-50 transition-colors">Excluir</button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={3} className="p-8 text-center text-sm text-brand-gray">Carregando...</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/80 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl p-8">
            <h2 className="font-serif text-3xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{editId ? 'Editar Citação' : 'Nova Citação'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Texto da Citação</label>
                <textarea rows={3} value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors resize-y" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Classe de Fundo (bg)</label>
                  <input type="text" value={form.bg} onChange={e => setForm({ ...form, bg: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Cor do Texto (text)</label>
                  <input type="text" value={form.text_col} onChange={e => setForm({ ...form, text_col: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Cor da Borda (border)</label>
                  <input type="text" value={form.border} onChange={e => setForm({ ...form, border: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Cor das Aspas (quote mark)</label>
                  <input type="text" value={form.quote_mark} onChange={e => setForm({ ...form, quote_mark: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
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
