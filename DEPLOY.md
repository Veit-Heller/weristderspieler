# Deployment auf Vercel 🚀

## Option 1: Über Vercel Dashboard (Empfohlen)

1. **GitHub Repository erstellen** (falls noch nicht vorhanden):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/wer-ist-der-spieler.git
   git push -u origin main
   ```

2. **Auf Vercel deployen**:
   - Gehe zu [vercel.com](https://vercel.com)
   - Melde dich mit GitHub an
   - Klicke auf "New Project"
   - Wähle dein Repository aus
   - Vercel erkennt automatisch Vite - klicke einfach auf "Deploy"
   - Fertig! 🎉

## Option 2: Über Vercel CLI

1. **Vercel CLI installieren**:
   ```bash
   npm install -g vercel
   ```

2. **Deployen**:
   ```bash
   vercel
   ```

3. **Für Produktion**:
   ```bash
   vercel --prod
   ```

## Was passiert automatisch:

- ✅ Vercel erkennt Vite automatisch
- ✅ Build wird automatisch ausgeführt (`npm run build`)
- ✅ App wird auf einer kostenlosen URL gehostet
- ✅ Automatische Deployments bei jedem Git Push

## Kostenloser Plan:

- ✅ Unbegrenzte Projekte
- ✅ Unbegrenzte Bandbreite
- ✅ Automatische HTTPS
- ✅ Custom Domain möglich
- ✅ Edge Network (schnelle Ladezeiten weltweit)

## Nach dem Deployment:

Deine App ist dann unter einer URL wie `wer-ist-der-spieler.vercel.app` erreichbar!

