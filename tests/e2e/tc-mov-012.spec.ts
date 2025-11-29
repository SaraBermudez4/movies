import { expect, test } from "@playwright/test"

test.setTimeout(60000)

const BASE = process.env.BASE_URL ?? "http://localhost:3000"

test.describe("TC-MOV-012 - Volver desde detalle a vista anterior (UI)", () => {
  test.beforeEach(async ({ request }) => {
    try {
      const res = await request.get(BASE)
      test.skip(
        !res.ok(),
        `La aplicación no responde en ${BASE}. Inicia el servidor y vuelve a ejecutar los tests.`
      )
    } catch (error) {
      test.skip(
        true,
        `La aplicación no responde en ${BASE}. Inicia el servidor y vuelve a ejecutar los tests.`
      )
    }
  })

  test("BACK-01 - Volver desde detalle usando botón UI o navegador", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    const movieCards = page.locator("h2.line-clamp-1")
    await movieCards.first().waitFor({ state: "visible", timeout: 15000 })

    const firstCardLink = page.locator('a[href^="/movie/"]').first()
    await firstCardLink.click()
    await page.waitForURL(/\/movie\/\d+/, { timeout: 20000 })
    await page.waitForLoadState("domcontentloaded")

    expect(page.url()).toMatch(/\/movie\/\d+/)

    // Buscar botón de volver en UI
    const backButton = page
      .locator("button, a")
      .filter({ hasText: /back|volver|atrás/i })
      .first()
    const hasBackButton = (await backButton.count()) > 0

    if (hasBackButton) {
      await backButton.click()
    } else {
      await page.goBack()
    }

    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    expect(page.url()).not.toMatch(/\/movie\/\d+/)
    expect(page.url()).not.toContain("404")
  })

  test("LOGO-01 - Logo redirige a Home desde detalle", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    const firstCardLink = page.locator('a[href^="/movie/"]').first()
    await firstCardLink.click()
    await page.waitForURL(/\/movie\/\d+/, { timeout: 20000 })
    await page.waitForLoadState("domcontentloaded")

    expect(page.url()).toMatch(/\/movie\/\d+/)

    const logo = page.locator('header a[href="/"]').first()
    await logo.click()

    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(BASE))
  })

  test("LOGO-02 - Logo redirige a Home desde búsqueda", async ({ page }) => {
    const searchUrl = `${BASE}/search?q=Inception`
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    expect(page.url()).toContain("/search")

    const logo = page.locator('header a[href="/"]').first()
    await logo.click()

    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(BASE))
    expect(page.url()).not.toContain("404")
  })

  test("NAV-01 - Flujo completo: Home → Búsqueda → Detalle → Logo → Home", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(BASE))

    const searchUrl = `${BASE}/search?q=Matrix`
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    expect(page.url()).toContain("/search")

    const firstResultLink = page
      .locator('a[href^="/movie/"], a[href^="/tv/"]')
      .first()
    await firstResultLink.click()
    await page.waitForURL(/\/(movie|tv)\/\d+/, { timeout: 20000 })
    await page.waitForLoadState("domcontentloaded")

    expect(page.url()).toMatch(/\/(movie|tv)\/\d+/)

    const logo = page.locator('header a[href="/"]').first()
    await logo.click()

    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    expect(normalize(page.url())).toBe(normalize(BASE))
    expect(page.url()).not.toContain("404")
  })

  test("ERROR-01 - No hay errores 404 en navegación", async ({ page }) => {
    page.on("response", (response) => {
      if (
        response.url().includes(BASE) &&
        !response.url().includes("apple-touch-icon") &&
        !response.url().includes("favicon") &&
        !response.url().includes("_next/static") &&
        !response.url().includes(".png") &&
        !response.url().includes(".jpg")
      ) {
        expect(response.status()).not.toBe(404)
      }
    })

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })
    expect(page.url()).not.toContain("404")

    await page.goto(`${BASE}/search?q=Test`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })
    expect(page.url()).not.toContain("404")

    await page.goBack()
    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(BASE))
  })

  test("NAV-02 - URLs coherentes en toda la navegación", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForLoadState("networkidle", { timeout: 30000 })

    const normalize = (u: string) => u.replace(/\/$/, "")
    expect(normalize(page.url())).toBe(normalize(BASE))

    const firstCardLink = page.locator('a[href^="/movie/"]').first()
    await firstCardLink.click()
    await page.waitForURL(/\/movie\/\d+/, { timeout: 20000 })

    const detailUrl = page.url()
    expect(detailUrl).toMatch(/\/movie\/\d+/)
    expect(detailUrl).not.toContain("404")

    const logo = page.locator('header a[href="/"]').first()
    await logo.click()
    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1500)

    expect(normalize(page.url())).toBe(normalize(BASE))
    expect(page.url()).not.toMatch(/\/movie\/\d+/)
  })
})
