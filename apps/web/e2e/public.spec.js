import { test, expect } from '@playwright/test'

// Smoke das páginas públicas: carregam, sem exceção JS e sem scroll horizontal.
const routes = ['/', '/especialidades', '/midia', '/agenda', '/contato', '/login']

for (const route of routes) {
  test(`smoke ${route}: carrega sem erro e sem overflow`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(route, { waitUntil: 'networkidle' })
    await expect(page.locator('#root')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow, 'sem scroll horizontal').toBeLessThanOrEqual(1)
    expect(errors, errors.join('\n')).toHaveLength(0)
  })
}

test('home: hero e seção de trajetória presentes', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Professora/i }).first()).toBeVisible()
  await expect(page.getByText('Trajetória e Impacto')).toBeAttached()
})

test('home: smoke da API (timeline retornou itens)', async ({ request }) => {
  const res = await request.get('/api/timeline')
  expect(res.ok()).toBeTruthy()
  const items = await res.json()
  expect(Array.isArray(items)).toBeTruthy()
  expect(items.length).toBeGreaterThan(0)
})

test('mobile: home sem overflow em 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
