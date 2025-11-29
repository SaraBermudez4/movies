# GitHub Actions CI/CD

[![CI/CD Pipeline](https://github.com/SaraBermudez4/movies/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/SaraBermudez4/movies/actions)
[![Playwright Tests](https://github.com/SaraBermudez4/movies/workflows/Playwright%20Tests/badge.svg)](https://github.com/SaraBermudez4/movies/actions)

## 🚀 Configuración Completa de CI/CD

Tu proyecto ahora tiene integración continua y despliegue continuo configurado con GitHub Actions.

### ✅ Workflows Creados

1. **`ci.yml`** - Pipeline principal de CI/CD
2. **`playwright.yml`** - Tests automatizados en múltiples navegadores
3. **`deploy.yml`** - Despliegue automático a producción

### 📦 Scripts NPM Agregados

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests en modo headed (ver navegador)
npm run test:headed

# Ejecutar tests con servidor (para CI)
npm run test:ci

# Ver reporte de tests
npm run test:report
```

### 🔧 Próximos Pasos

1. **Subir a GitHub:**

   ```bash
   git add .
   git commit -m "feat: Add CI/CD with GitHub Actions"
   git push origin main
   ```

2. **Configurar Secrets** (si vas a usar deploy):

   - Ve a Settings → Secrets and variables → Actions
   - Agrega:
     - `TMDB_API_KEY`
     - `VERCEL_TOKEN` (opcional, para deploy)
     - `VERCEL_ORG_ID` (opcional)
     - `VERCEL_PROJECT_ID` (opcional)

3. **Ver Resultados:**
   - Ve a la pestaña "Actions" en tu repositorio
   - Verás los workflows ejecutándose automáticamente

### 📊 Características

- ✅ Tests automáticos en cada push/PR
- ✅ Tests en 3 navegadores (Chromium, Firefox, WebKit)
- ✅ Linting automático
- ✅ Build verification
- ✅ Reportes de tests guardados como artefactos
- ✅ Deploy automático a producción (opcional)

### 🎯 Triggers

Los workflows se ejecutan automáticamente cuando:

- Haces push a `main` o `develop`
- Creas un Pull Request
- Cambias archivos en `tests/`, `app/` o `components/`

También puedes ejecutarlos manualmente desde la pestaña Actions.

---

**¡Tu proyecto ahora tiene CI/CD profesional! 🎉**
