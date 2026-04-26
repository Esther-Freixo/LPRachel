import { Link } from 'react-router-dom'
import { getPublicacoes, getAgenda } from '../../store/data'
import useData from '../../hooks/useData'

export default function Dashboard() {
  const { data: pubs, loading: loadingPubs } = useData(getPublicacoes)
  const { data: agenda, loading: loadingAgenda } = useData(getAgenda)

  const pubsSeguras = pubs || []
  const agendaSegura = agenda || []

  const proximos = agendaSegura.filter(e => e.status !== 'realizado').length
  const realizados = agendaSegura.filter(e => e.status === 'realizado').length

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-brand-dark mb-2">Bem-vinda, Rachel!</h1>
        <p className="text-sm text-brand-gray">Aqui você gerencia as publicações e a agenda do seu site.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 border border-[#E5E5E5] shadow-sm">
          <div className="font-serif text-4xl font-bold text-brand-red mb-2">{pubsSeguras.length}</div>
          <div className="text-xs uppercase tracking-widest text-brand-gray font-bold">Publicações</div>
        </div>
        <div className="bg-white p-6 border border-[#E5E5E5] shadow-sm">
          <div className="font-serif text-4xl font-bold text-brand-red mb-2">{proximos}</div>
          <div className="text-xs uppercase tracking-widest text-brand-gray font-bold">Próximos eventos</div>
        </div>
        <div className="bg-white p-6 border border-[#E5E5E5] shadow-sm">
          <div className="font-serif text-4xl font-bold text-brand-dark mb-2">{realizados}</div>
          <div className="text-xs uppercase tracking-widest text-brand-gray font-bold">Eventos realizados</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { to: '/admin/publicacoes', title: 'Gerenciar Publicações', desc: 'Adicione, edite ou remova livros, artigos, colunas e entrevistas.' },
          { to: '/admin/agenda', title: 'Gerenciar Agenda', desc: 'Cadastre novos eventos, palestras e cursos na agenda.' },
          { to: '/admin/timeline', title: 'Gerenciar Timeline', desc: 'Edite os marcos da sua trajetória na página inicial.' },
          { to: '/admin/insights', title: 'Gerenciar Insights', desc: 'Publique suas reflexões e artigos do LinkedIn.' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="bg-white p-8 border border-[#E5E5E5] shadow-sm hover:border-brand-red hover:shadow-md transition-all group block">
            <h3 className="font-serif text-2xl text-brand-dark mb-3 group-hover:text-brand-red transition-colors">{item.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
