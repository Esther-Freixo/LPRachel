import { test, expect } from '@playwright/test'

const EMAIL = 'rachel@exemplo.com'
const SENHA = 'troque-isto'

async function login(page) {
  await page.goto('/login')
  await page.locator('#email').fill(EMAIL)
  await page.locator('#pass').fill(SENHA)
  await page.getByRole('button', { name: /Acessar Painel/i }).click()
  await page.waitForURL('**/admin')
}

test('login leva ao dashboard', async ({ page }) => {
  await login(page)
  await expect(page.getByText(/Bem-vinda/i)).toBeVisible()
})

test('login rejeita credenciais inválidas', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email').fill(EMAIL)
  await page.locator('#pass').fill('senha-errada')
  await page.getByRole('button', { name: /Acessar Painel/i }).click()
  await expect(page.getByText(/Credenciais incorretas/i)).toBeVisible()
})

test('rota /admin exige autenticação', async ({ page }) => {
  await page.goto('/admin')
  await page.waitForURL('**/login')
  await expect(page.getByText(/Área Administrativa/i)).toBeVisible()
})

test('CRUD de publicação: cria, edita e exclui', async ({ page }) => {
  await login(page)
  await page.goto('/admin/publicacoes')

  const titulo = `Publicação E2E ${Date.now()}`
  const tituloEditado = `${titulo} (editada)`

  // CREATE
  await page.getByRole('button', { name: /Nova publicação/i }).click()
  const modal = page.locator('div.fixed.inset-0')
  await expect(modal).toBeVisible()
  await modal.locator('select').selectOption('artigo')
  await modal.locator('input[type="text"]').first().fill(titulo)
  await modal.locator('input[type="text"]').nth(1).fill('Teste · 2026')
  await modal.getByRole('button', { name: /^Salvar$/i }).click()
  await expect(page.getByText(titulo)).toBeVisible()

  // UPDATE
  const row = page.locator('tr', { hasText: titulo })
  await row.getByRole('button', { name: /Editar/i }).click()
  const editModal = page.locator('div.fixed.inset-0')
  await editModal.locator('input[type="text"]').first().fill(tituloEditado)
  await editModal.getByRole('button', { name: /^Salvar$/i }).click()
  await expect(page.getByText(tituloEditado)).toBeVisible()

  // DELETE (confirm via dialog)
  page.on('dialog', (d) => d.accept())
  await page.locator('tr', { hasText: tituloEditado }).getByRole('button', { name: /Excluir/i }).click()
  await expect(page.getByText(tituloEditado)).toHaveCount(0)
})
