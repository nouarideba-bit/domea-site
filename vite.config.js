import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relative : le build fonctionne aussi bien à la racine d'un domaine
// (Netlify) que dans un sous-dossier (GitHub Pages /domea-site/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
