const SUPABASE_URL = 'https://pabcmwgncpbfyrbbfzhj.supabase.co/rest/v1'
const SUPABASE_KEY = 'sb_publishable_L2rgKtI3lYpI6zMIbrPEKQ_Q9cm6uaj'

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
}

// Helpers
async function fetchSupabase(endpoint) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${endpoint}?order=id.desc`, { headers })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Fetch error:', err)
    return []
  }
}

async function insertSupabase(endpoint, data) {
  const res = await fetch(`${SUPABASE_URL}/${endpoint}`, { method: 'POST', headers, body: JSON.stringify(data) })
  return await res.json()
}

async function updateSupabase(endpoint, id, data) {
  const res = await fetch(`${SUPABASE_URL}/${endpoint}?id=eq.${id}`, { method: 'PATCH', headers, body: JSON.stringify(data) })
  return await res.json()
}

async function deleteSupabase(endpoint, id) {
  await fetch(`${SUPABASE_URL}/${endpoint}?id=eq.${id}`, { method: 'DELETE', headers })
}

// Publicações
export async function getPublicacoes() { return await fetchSupabase('publicacoes') }
export async function addPublicacao(obj) { return await insertSupabase('publicacoes', obj) }
export async function updatePublicacao(id, obj) { return await updateSupabase('publicacoes', id, obj) }
export async function deletePublicacao(id) { await deleteSupabase('publicacoes', id) }

// Agenda
export async function getAgenda() { return await fetchSupabase('agenda') }
export async function addEvento(obj) { return await insertSupabase('agenda', obj) }
export async function updateEvento(id, obj) { return await updateSupabase('agenda', id, obj) }
export async function deleteEvento(id) { await deleteSupabase('agenda', id) }

// Timeline
export async function getTimeline() { return await fetchSupabase('timeline') }
export async function addTimeline(obj) { return await insertSupabase('timeline', obj) }
export async function updateTimeline(id, obj) { return await updateSupabase('timeline', id, obj) }
export async function deleteTimeline(id) { await deleteSupabase('timeline', id) }

// Insights
export async function getInsights() { return await fetchSupabase('insights') }
export async function addInsight(obj) { return await insertSupabase('insights', obj) }
export async function updateInsight(id, obj) { return await updateSupabase('insights', id, obj) }
export async function deleteInsight(id) { await deleteSupabase('insights', id) }

// Citacoes
export async function getCitacoes() { return await fetchSupabase('citacoes') }
export async function addCitacao(obj) { return await insertSupabase('citacoes', obj) }
export async function updateCitacao(id, obj) { return await updateSupabase('citacoes', id, obj) }
export async function deleteCitacao(id) { await deleteSupabase('citacoes', id) }

// Midias
export async function getMidias() {
  try {
    const res = await fetch(`${SUPABASE_URL}/midias?order=ordem.asc`, { headers })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Fetch error:', err)
    return []
  }
}
export async function addMidia(obj) { return await insertSupabase('midias', obj) }
export async function updateMidia(id, obj) { return await updateSupabase('midias', id, obj) }
export async function deleteMidia(id) { await deleteSupabase('midias', id) }

// Contato
export async function sendContato(obj) { return await insertSupabase('contatos', obj) }

export const AUTH = { user: 'admrachel', pass: 'space123' }
export async function login(user, pass) { 
  if (user === AUTH.user && pass === AUTH.pass) { 
    sessionStorage.setItem('rf_auth','1'); 
    return true 
  } 
  return false 
}
export function logout() { sessionStorage.removeItem('rf_auth') }
export function isLoggedIn() { return !!sessionStorage.getItem('rf_auth') }
