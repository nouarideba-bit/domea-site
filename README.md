# Site DOMEA

Site vitrine de DOMEA, hôtel de convalescence au pied d'un hôpital partenaire (séjours Avant, Après, Avec).

- React 19 + Vite, animations [Framer Motion](https://motion.dev)
- Une seule page, sans serveur : le build est un dossier statique (`dist/`)
- Formulaire de contact : ouvre la messagerie du visiteur vers `contact@domea-services.com` (aucune donnée stockée)

## Travailler en local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/
npm run preview  # sert dist/ en local
```

## Mise en ligne

Le build utilise des chemins relatifs (`base: './'`) : le contenu de `dist/` fonctionne à la racine d'un domaine comme dans un sous-dossier.

**GitHub Pages (prévu)** : le workflow `.github/workflows/deploy.yml` publie `dist/` à chaque push sur `main`. Le fichier `public/CNAME` rattache le site au domaine `domea-services.com`. Côté OVH, la zone DNS du domaine doit pointer vers GitHub Pages :

| Type  | Sous-domaine | Cible               |
|-------|--------------|---------------------|
| A     | (vide)       | 185.199.108.153     |
| A     | (vide)       | 185.199.109.153     |
| A     | (vide)       | 185.199.110.153     |
| A     | (vide)       | 185.199.111.153     |
| CNAME | www          | `<compte>.github.io.` |

Ne pas toucher aux enregistrements MX (e-mails).

**Hébergement web OVH (alternative)** : envoyer le contenu de `dist/` dans le dossier `www/` de l'hébergement par FTP.

## Contenu

Les textes et chiffres viennent du dossier DOMEA (plaquette, note de concept, prévisionnel, scénario central). Le vocabulaire reste celui d'un **hébergement temporaire non médicalisé avec soins coordonnés** : ne pas présenter DOMEA comme un établissement médicalisé ou une clinique.

À compléter avant ouverture : mentions légales (éditeur, SIREN, hébergeur), adresse e-mail de contact définitive, photos en haute définition (exports Canva ×3) à la place des images extraites de la plaquette.
