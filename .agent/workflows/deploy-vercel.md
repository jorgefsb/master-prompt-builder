---
description: How to deploy Master Prompt Builder to Vercel
---

1. **GitHub Connection**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New" -> "Project".
   - Select the `master-prompt-builder` repository.

2. **Configuration**:
   - Vercel will auto-detect it's a static site.
   - **Framework Preset**: Other (or None).
   - **Build Command**: Leave empty (since there's no build step yet).
   - **Output Directory**: `.` (the root).

3. **Deploy**:
   - Click "Deploy".
   - Your site will be live at a `.vercel.app` domain.

4. **Custom Domain**:
   - Go to "Settings" -> "Domains" in your Vercel project.
   - Enter your domain (e.g., `mpb.tudominio.com`).
   - Follow Vercel's instructions to update your DNS records (CNAME or A record).
