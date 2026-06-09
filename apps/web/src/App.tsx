import { useEffect, lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EspecialidadesPesquisas from './pages/EspecialidadesPesquisas'
import Agenda from './pages/Agenda'
import Contato from './pages/Contato'
import InsightPost from './pages/InsightPost'
import Login from './pages/Login'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminPublicacoes from './pages/admin/Publicacoes'
import AdminAgenda from './pages/admin/Agenda'
import AdminTimeline from './pages/admin/Timeline'
import AdminInsights from './pages/admin/Insights'
import AdminCitacoes from './pages/admin/Citacoes'
import Midia from './pages/Midia'
import AdminMidias from './pages/admin/Midias'

// Lab de comparação da timeline: só existe em desenvolvimento (lazy import,
// fica fora do bundle de produção).
const TimelineLab = import.meta.env.DEV ? lazy(() => import('./pages/TimelineLab')) : null

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PrivateRoute({ children }: { children: ReactNode }) {
  return sessionStorage.getItem('rf_auth') ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Público */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/especialidades" element={<EspecialidadesPesquisas />} />
        <Route path="/midia" element={<Midia />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/insight/:id" element={<InsightPost />} />
      </Route>

      {/* Login + recuperação de senha */}
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />

      {/* Lab — comparação de variações da timeline (apenas em dev, não linkado) */}
      {import.meta.env.DEV && TimelineLab && (
        <Route path="/lab/timeline" element={<Suspense fallback={null}><TimelineLab /></Suspense>} />
      )}

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="publicacoes" element={<AdminPublicacoes />} />
        <Route path="agenda" element={<AdminAgenda />} />
        <Route path="timeline" element={<AdminTimeline />} />
        <Route path="insights" element={<AdminInsights />} />
        <Route path="citacoes" element={<AdminCitacoes />} />
        <Route path="midias" element={<AdminMidias />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
