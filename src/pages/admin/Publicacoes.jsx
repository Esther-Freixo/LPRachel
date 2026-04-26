import { useState, useEffect } from 'react'
import { getPublicacoes, addPublicacao, updatePublicacao, deletePublicacao } from '../../store/data'

const TIPOS = ['livro','artigo','opiniao','imprensa']
const LABELS = { livro:'Livro', artigo:'Artigo', opiniao:'Coluna', imprensa:'Imprensa' }

const EMPTY = { tipo: 'livro', titulo: '', meta: '', resumo: '', link: '' }

export default function AdminPublicacoes() {
  const [pubs, setPubs] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const res = await getPublicacoes()
    setPubs(res)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  function openNew() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(p) { setForm({ tipo: p.tipo, titulo: p.titulo, meta: p.meta || '', resumo: p.resumo || '', link: p.link || '' }); setEditId(p.id); setModal(true) }
  async function del(id) { if (window.confirm('Excluir esta publicação?')) { await deletePublicacao(id); await refresh() } }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editId) await updatePublicacao(editId, form); else await addPublicacao({ ...form })
    setModal(false); await refresh()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Publicações</h2>
          <p className="text-sm text-brand-gray">Gerencie o acervo literário e produção intelectual.</p>
        </div>
        <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={openNew}>+ Nova publicação</button>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-dark text-white border-b border-brand-dark">
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Tipo</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Título</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold hidden md:table-cell">Meta</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pubs.length === 0 && !loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-sm text-brand-gray">Nenhuma publicação cadastrada.</td></tr>
            ) : pubs.map(p => (
              <tr key={p.id} className="border-b border-[#E5E5E5] hover:bg-[#EFECE8]/30 transition-colors group">
                <td className="p-4 align-top">
                  <span className="text-[10px] uppercase tracking-widest bg-[#EFECE8] text-brand-dark px-3 py-1 font-bold inline-block whitespace-nowrap">
                    {LABELS[p.tipo]||p.tipo}
                  </span>
                </td>
                <td className="p-4 align-top">
                  <span className="font-bold text-brand-dark text-sm leading-relaxed block max-w-sm">{p.titulo}</span>
                  <span className="text-xs text-brand-gray mt-1 block md:hidden">{p.meta}</span>
                </td>
                <td className="p-4 align-top hidden md:table-cell">
                  <span className="text-xs text-brand-gray">{p.meta}</span>
                </td>
                <td className="p-4 align-top text-right whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-3 py-1.5 hover:border-brand-dark transition-colors mr-2">Editar</button>
                  <button onClick={() => del(p.id)} className="text-[10px] uppercase tracking-widest font-bold border border-red-200 text-brand-red px-3 py-1.5 hover:bg-red-50 transition-colors">Excluir</button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={4} className="p-8 text-center text-sm text-brand-gray">Carregando...</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/80 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl p-8">
            <h2 className="font-serif text-3xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{editId ? 'Editar Publicação' : 'Nova Publicação'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors bg-white">
                  {TIPOS.map(t => <option key={t} value={t}>{LABELS[t]}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Meta (veículo · ano)</label>
                <input type="text" value={form.meta} onChange={e => setForm({ ...form, meta: e.target.value })} placeholder="Ex: JOTA · 2024" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Resumo</label>
                <textarea rows={4} value={form.resumo} onChange={e => setForm({ ...form, resumo: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors resize-y" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Link externo</label>
                <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
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
