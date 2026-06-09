import { test, expect } from '@playwright/test'

test('login → "Esqueci minha senha" leva à recuperação', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('link', { name: /Esqueci minha senha/i }).click()
  await page.waitForURL('**/esqueci-senha')
  await expect(page.getByText(/Recuperar acesso/i)).toBeVisible()
})

test('esqueci-senha: envia e mostra confirmação genérica', async ({ page }) => {
  await page.goto('/esqueci-senha')
  await page.locator('#email').fill('qualquer@exemplo.com')
  await page.getByRole('button', { name: /Enviar link/i }).click()
  await expect(page.getByText(/enviamos um link/i)).toBeVisible()
})

test('redefinir-senha sem token: mostra link inválido', async ({ page }) => {
  await page.goto('/redefinir-senha')
  await expect(page.getByText(/Link inválido/i)).toBeVisible()
})

test('redefinir-senha: senhas que não conferem são barradas no cliente', async ({ page }) => {
  await page.goto('/redefinir-senha?token=abc.def')
  await page.locator('#senha').fill('senhanova123')
  await page.locator('#confirma').fill('diferente123')
  await page.getByRole('button', { name: /Redefinir senha/i }).click()
  await expect(page.getByText(/não conferem/i)).toBeVisible()
})

test('redefinir-senha: token inválido retorna erro do servidor', async ({ page }) => {
  await page.goto('/redefinir-senha?token=abc.def')
  await page.locator('#senha').fill('senhanova123')
  await page.locator('#confirma').fill('senhanova123')
  await page.getByRole('button', { name: /Redefinir senha/i }).click()
  await expect(page.getByText(/inválido ou expirado/i)).toBeVisible()
})
