[Español](TECHNICAL.md) | [English](TECHNICAL.en.md)

# Technical guide

Base: `main` `c10a2e639b4a05336218bfa9aa5a50810423b575`.

```bash
git clone https://github.com/jorgefsb/master-prompt-builder.git
cd master-prompt-builder
python3 -m http.server 3000 --bind 127.0.0.1
```

Open http://127.0.0.1:3000 . Stop with Ctrl+C. No build needed for browsing; do not start a Worker or submit forms when testing documentation.

```bash
npm test
```

Tests use Node and some require Playwright/Chromium. Read the report; do not change code or tests to conceal failures. [Results](../reports/test-output.txt). [Verification](../reports/docs-brandkit-verification.json).

No local backend: Supabase/CDN remain external dependencies; do not simulate an authenticated session.
