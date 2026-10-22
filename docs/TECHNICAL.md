[Español](TECHNICAL.md) | [English](TECHNICAL.en.md)

# Guía técnica

Base: `main` `c10a2e639b4a05336218bfa9aa5a50810423b575`.

```bash
git clone https://github.com/jorgefsb/master-prompt-builder.git
cd master-prompt-builder
python3 -m http.server 3000 --bind 127.0.0.1
```

Abre http://127.0.0.1:3000 . Detén con Ctrl+C. Sin build para navegar; no inicies Worker, no uses formularios para probar la documentación.

```bash
npm test
```

Las pruebas usan Node y algunas requieren Playwright/Chromium. Consulta el reporte; no cambiar código ni tests para ocultar fallos. [Resultados](../reports/test-output.txt). [Verificación](../reports/docs-brandkit-verification.json).

Sin backend local: Supabase/CDN siguen siendo dependencias externas; no simular sesión autenticada.
