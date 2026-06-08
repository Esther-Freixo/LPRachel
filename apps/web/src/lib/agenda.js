// Lógica de domínio da agenda — extraída para ser testável isoladamente.

const MESES = {
  JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
  JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11,
}

// Decide se um evento já passou ('realizado') ou ainda vai acontecer
// ('proximo'), comparando com o horário atual no fuso de São Paulo.
// `now` é injetável para testes determinísticos.
export function getEventStatus(evt, now = new Date()) {
  if (!evt || !evt.dia || !evt.mes) return (evt && evt.status) || 'proximo'

  const evtMonth = MESES[String(evt.mes).substring(0, 3).toUpperCase()] ?? -1
  if (evtMonth === -1) return evt.status || 'proximo'

  const evtDay = parseInt(evt.dia, 10) || 1
  const nowSP = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const currentYear = nowSP.getFullYear()
  const evtYear = evt.ano ? parseInt(evt.ano, 10) : currentYear

  const evtDate = new Date(evtYear, evtMonth, evtDay, 23, 59, 59)
  return evtDate < nowSP ? 'realizado' : 'proximo'
}
