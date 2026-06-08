// Lógica de domínio da agenda — extraída para ser testável isoladamente.

export type EventoStatus = 'realizado' | 'proximo'

export interface EventoLike {
  dia?: string | number | null
  mes?: string | null
  ano?: string | number | null
  status?: string | null
}

const MESES: Record<string, number> = {
  JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
  JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
}

// Decide se um evento já passou ('realizado') ou ainda vai acontecer
// ('proximo'), comparando com o horário atual no fuso de São Paulo.
// `now` é injetável para testes determinísticos.
export function getEventStatus(evt?: EventoLike | null, now: Date = new Date()): EventoStatus {
  const fallback = ((evt && evt.status) as EventoStatus) || 'proximo'
  if (!evt || !evt.dia || !evt.mes) return fallback

  const evtMonth = MESES[String(evt.mes).substring(0, 3).toUpperCase()] ?? -1
  if (evtMonth === -1) return fallback

  const evtDay = parseInt(String(evt.dia), 10) || 1
  const nowSP = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const currentYear = nowSP.getFullYear()
  const evtYear = evt.ano ? parseInt(String(evt.ano), 10) : currentYear

  const evtDate = new Date(evtYear, evtMonth, evtDay, 23, 59, 59)
  return evtDate < nowSP ? 'realizado' : 'proximo'
}
