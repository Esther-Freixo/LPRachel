import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EspecialidadesPesquisas from './pages/EspecialidadesPesquisas'
import Agenda from './pages/Agenda'
import Contato from './pages/Contato'
import InsightPost from './pages/InsightPost'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminPublicacoes from './pages/admin/Publicacoes'
import AdminAgenda from './pages/admin/Agenda'
import AdminTimeline from './pages/admin/Timeline'
import AdminInsights from './pages/admin/Insights'
import AdminCitacoes from './pages/admin/Citacoes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PrivateRoute({ children }) {
  return sessionStorage.getItem('rf_auth') ? children : <Navigate to="/login" replace />
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
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/insight/:id" element={<InsightPost />} />
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="publicacoes" element={<AdminPublicacoes />} />
        <Route path="agenda" element={<AdminAgenda />} />
        <Route path="timeline" element={<AdminTimeline />} />
        <Route path="insights" element={<AdminInsights />} />
        <Route path="citacoes" element={<AdminCitacoes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
