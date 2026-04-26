import { useState, useEffect } from 'react'
import { getAgenda, addEvento, updateEvento, deleteEvento } from '../../store/data'

const TIPOS = ['Palestra','Painel','Curso','Banca','Outro']
const EMPTY = { dia: '', mes: '', ano: '', tipo: 'Palestra', titulo: '', local: '', descricao: '', link: '', status: 'proximo' }

export default function AdminAgenda() {
  const [eventos, setEventos] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const res = await getAgenda()
    setEventos(res)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  function openNew() { setForm(EMPTY); setEditId(null); setModal(true) }
  function openEdit(e) { setForm({ dia: e.dia, mes: e.mes, ano: e.ano, tipo: e.tipo, titulo: e.titulo, local: e.local||'', descricao: e.descricao||'', link: e.link||'', status: e.status }); setEditId(e.id); setModal(true) }
  async function del(id) { if (window.confirm('Excluir este evento?')) { await deleteEvento(id); await refresh() } }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editId) await updateEvento(editId, form); else await addEvento({ ...form })
    setModal(false); await refresh()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-brand-dark mb-2">Agenda</h2>
          <p className="text-sm text-brand-gray">Cadastre e gerencie seus próximos eventos.</p>
        </div>
        <button className="bg-brand-red text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-red-800 transition-colors" onClick={openNew}>+ Novo evento</button>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-dark text-white border-b border-brand-dark">
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Data</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Tipo</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold">Título</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold hidden sm:table-cell">Status</th>
              <th className="p-4 text-xs uppercase tracking-widest font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 && !loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-brand-gray">Nenhum evento cadastrado.</td></tr>
            ) : eventos.map(e => (
              <tr key={e.id} className="border-b border-[#E5E5E5] hover:bg-[#EFECE8]/30 transition-colors group">
                <td className="p-4 align-top font-bold text-sm whitespace-nowrap">{e.dia}/{e.mes}/{e.ano}</td>
                <td className="p-4 align-top text-xs text-brand-gray uppercase tracking-widest">{e.tipo}</td>
                <td className="p-4 align-top">
                  <span className="font-bold text-brand-dark text-sm block max-w-sm">{e.titulo}</span>
                  <span className="text-xs text-brand-gray mt-1 block sm:hidden">
                    {e.status === 'proximo' ? 'Próximo' : 'Realizado'}
                  </span>
                </td>
                <td className="p-4 align-top hidden sm:table-cell">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 ${e.status === 'proximo' ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-gray-100 text-brand-gray border border-gray-200'}`}>
                    {e.status === 'proximo' ? 'Próximo' : 'Realizado'}
                  </span>
                </td>
                <td className="p-4 align-top text-right whitespace-nowrap">
                  <button onClick={() => openEdit(e)} className="text-[10px] uppercase tracking-widest font-bold border border-[#E5E5E5] text-brand-dark px-3 py-1.5 hover:border-brand-dark transition-colors mr-2">Editar</button>
                  <button onClick={() => del(e.id)} className="text-[10px] uppercase tracking-widest font-bold border border-red-200 text-brand-red px-3 py-1.5 hover:bg-red-50 transition-colors">Excluir</button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={5} className="p-8 text-center text-sm text-brand-gray">Carregando...</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/80 z-50 flex items-center justify-center p-4" onClick={ev => ev.target === ev.currentTarget && setModal(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl p-8">
            <h2 className="font-serif text-3xl text-brand-dark mb-6 border-b border-[#E5E5E5] pb-4">{editId ? 'Editar Evento' : 'Novo Evento'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Dia</label>
                  <input type="text" value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} placeholder="15" maxLength={2} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Mês</label>
                  <input type="text" value={form.mes} onChange={e => setForm({ ...form, mes: e.target.value })} placeholder="Mai" maxLength={3} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Ano</label>
                  <input type="text" value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} placeholder="2025" maxLength={4} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors bg-white">
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Local</label>
                <input type="text" value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} placeholder="Cidade, Estado" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Descrição curta</label>
                <input type="text" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Link de inscrição</label>
                <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://" className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-[#E5E5E5] p-3 text-sm focus:border-brand-red focus:outline-none transition-colors bg-white">
                  <option value="proximo">Próximo</option>
                  <option value="realizado">Realizado</option>
                </select>
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
