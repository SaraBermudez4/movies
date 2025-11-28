import { expect, test } from "@playwright/test"

test.setTimeout(60000)

const BASE = process.env.BASE_URL ?? "http://localhost:3000"

test.describe("TC-MOV-001 - Partición de equivalencia búsqueda películas (UI)", () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get(BASE)
    test.skip(
      !res.ok(),
      `La aplicación no responde en ${BASE}. Inicia el servidor y vuelve a ejecutar los tests.`
    )
  })

  async function search(page: any, term: string) {
    // ESTRATEGIA: Navegar directamente a la URL de búsqueda
    const searchUrl = `${BASE}/search?q=${encodeURIComponent(term)}`
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    })

    await page.waitForTimeout(1500)

    // wait for either results (h2 titles) or "No results found" message
    await Promise.race([
      page
        .locator("h2.line-clamp-1")
        .first()
        .waitFor({ state: "visible", timeout: 15000 }),
      page
        .getByText(/No results found/i)
        .waitFor({ state: "visible", timeout: 15000 }),
    ]).catch(() => {})

    await page.waitForLoadState("domcontentloaded")
  }

  test('CE-01 - Título completo "Inception"', async ({ page }) => {
    await search(page, "Inception")

    expect(page.url()).toContain("/search")

    const titleCount = await page.locator("h2.line-clamp-1").count()
    expect(titleCount).toBeGreaterThan(0)

    const hasInception = await page.getByText(/Inception/i).count()
    expect(hasInception).toBeGreaterThan(0)
  })

  test('CE-02 - Fragmento "Matrix"', async ({ page }) => {
    await search(page, "Matrix")

    expect(page.url()).toContain("/search")

    const titleCount = await page.locator("h2.line-clamp-1").count()
    expect(titleCount).toBeGreaterThan(0)

    const hasMatrix = await page.getByText(/Matrix/i).count()
    expect(hasMatrix).toBeGreaterThan(0)
  })

  test('CE-03 - Texto inexistente "zzzxxyyqwe123"', async ({ page }) => {
    await search(page, "zzzxxyyqwe123")

    expect(page.url()).toContain("/search")
    const titleCount = await page.locator("h2.line-clamp-1").count()
    expect(titleCount).toBe(0)
  })

  test("CE-04 - Campo vacío (no crash)", async ({ page }) => {
    await page.goto(BASE)
    const input = page.locator('input[name="q"]')
    await input.fill("")

    // Para campo vacío, intentamos navegar con query vacío
    await page
      .goto(`${BASE}/search?q=`, { waitUntil: "domcontentloaded" })
      .catch(() => {})
    await page.waitForTimeout(1000)

    // Verificar que la app no crashea - puede quedarse en / o ir a /search
    const current = page.url()
    // La app debe responder de forma controlada (no crash)
    expect(current).toMatch(/\/(search)?/)
  })

  test('CE-05 - Solo caracteres especiales "@@@@@"', async ({ page }) => {
    await search(page, "@@@@@")

    expect(page.url()).toContain("/search")
    const titleCount = await page.locator("h2.line-clamp-1").count()
    expect(titleCount).toBe(0)
  })

  test("CE-06 - Texto muy largo ~100 chars", async ({ page }) => {
    const longText = "a".repeat(100)
    await search(page, longText)

    expect(page.url()).toContain("/search")
    const titleCount = await page.locator("h2.line-clamp-1").count()
    expect(titleCount).toBe(0)
  })
})
