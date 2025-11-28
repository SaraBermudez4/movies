import { expect, test } from "@playwright/test"

test.setTimeout(60000)

const BASE = process.env.BASE_URL ?? "http://localhost:3000"

test.describe("TC-MOV-007 - Navegación a detalle desde Populares", () => {
  // Skip tests if the app is not running
  test.beforeEach(async ({ request }) => {
    const res = await request.get(BASE)
    test.skip(
      !res.ok(),
      `La aplicación no responde en ${BASE}. Inicia el servidor y vuelve a ejecutar los tests.`
    )
  })

  test("NAV-P01 - Clic en tarjeta de popular navega a detalle", async ({
    page,
  }) => {
    // Abrir la app y esperar populares
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    // Verificar que existe lista de populares
    const movieCards = page.locator("h2.line-clamp-1")
    await movieCards.first().waitFor({ state: "visible", timeout: 15000 })

    // Hacer clic en la primera tarjeta (link padre)
    const firstCardLink = page
      .locator("a")
      .filter({ has: movieCards.first() })
      .first()
    await firstCardLink.click()

    // Verificar navegación a detalle (/movie/:id)
    await page.waitForURL(/\/movie\/\d+/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/movie\/\d+/)

    // Verificar que la página de detalle muestra contenido
    const detailTitle = page.locator("h1, h2").first()
    await detailTitle.waitFor({ state: "visible", timeout: 10000 })
    const titleText = await detailTitle.textContent()
    expect(titleText?.trim().length).toBeGreaterThan(0)
  })

  test("NAV-P02 - Clic fuera de tarjeta no navega", async ({ page }) => {
    // Abrir la app
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    const initialUrl = page.url()

    // Verificar que existe lista de populares
    const movieCards = page.locator("h2.line-clamp-1")
    await movieCards.first().waitFor({ state: "visible", timeout: 15000 })

    // Hacer clic en el heading "Popular" (elemento no interactivo)
    const popularHeading = page.getByText(/popular|trending/i).first()
    await popularHeading.click()

    // Esperar un momento
    await page.waitForTimeout(1500)

    // Verificar que NO navegamos (URL sigue igual)
    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(initialUrl))

    // Verificar que la UI sigue estable (tarjetas visibles)
    const cardStillVisible = await movieCards.first().isVisible()
    expect(cardStillVisible).toBeTruthy()
  })
})
