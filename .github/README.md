# CI/CD Configuration

Este proyecto utiliza GitHub Actions para automatizar el proceso de integración y despliegue continuo.

## Workflows Configurados

### 1. CI Pipeline (`ci.yml`)

Se ejecuta en cada push y pull request a las ramas `main` y `develop`.

**Jobs:**

- **Test**: Ejecuta todos los tests de Playwright
- **Lint**: Verifica el código con ESLint
- **Build**: Construye la aplicación

### 2. Playwright Tests (`playwright.yml`)

Se ejecuta cuando hay cambios en tests, app o components.

**Características:**

- Ejecuta tests en 3 navegadores: Chromium, Firefox y WebKit
- Inicia el servidor de desarrollo automáticamente
- Sube reportes de tests como artefactos

### 3. Deploy (`deploy.yml`)

Se ejecuta en cada push a `main` para desplegar a producción.

**Requiere configurar estos secrets en GitHub:**

- `TMDB_API_KEY`: Tu API key de TMDB
- `VERCEL_TOKEN`: Token de Vercel
- `VERCEL_ORG_ID`: ID de organización de Vercel
- `VERCEL_PROJECT_ID`: ID del proyecto en Vercel

## Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Agrega los siguientes secrets:

```
TMDB_API_KEY=tu_api_key_aqui
VERCEL_TOKEN=tu_token_de_vercel
VERCEL_ORG_ID=tu_org_id
VERCEL_PROJECT_ID=tu_project_id
```

## Ver Resultados

### Reportes de Tests

Los reportes de Playwright se guardan como artefactos en cada ejecución:

1. Ve a la pestaña **Actions** en GitHub
2. Click en el workflow ejecutado
3. Descarga los artefactos en la sección **Artifacts**

### Estado de los Workflows

Puedes agregar badges al README principal:

```markdown
![CI](https://github.com/tu-usuario/tu-repo/workflows/CI%2FCD%20Pipeline/badge.svg)
![Tests](https://github.com/tu-usuario/tu-repo/workflows/Playwright%20Tests/badge.svg)
```

## Ejecutar Workflows Manualmente

Algunos workflows tienen `workflow_dispatch` habilitado, lo que permite ejecutarlos manualmente:

1. Ve a **Actions**
2. Selecciona el workflow
3. Click en **Run workflow**

## Notas Importantes

- Los tests requieren que el servidor esté corriendo en `http://localhost:3000`
- Los reportes se mantienen por 30 días
- Los builds se mantienen por 7 días
- El workflow de deploy solo se ejecuta en la rama `main`
