// Coffre de l'espace confidentiel : chiffrement des documents côté client.
//
// Le site est statique (GitHub Pages) : tout ce qui est publié est téléchargeable par n'importe qui.
// Les documents ne sont donc jamais publiés en clair. Ils sont chiffrés (AES-256-GCM) avec une
// « clé maîtresse » aléatoire. Cette clé n'est publiée que chiffrée à son tour, une fois par compte,
// avec une clé dérivée de l'identifiant et du mot de passe (PBKDF2-SHA-256, 600 000 itérations).
// Sans le bon couple identifiant + mot de passe, les fichiers publiés sont illisibles.
//
// Ce module n'utilise que l'API Web Crypto : il sert au navigateur et au script Node
// (scripts/espace.mjs), qui produisent ainsi exactement le même format.

export const ITERATIONS = 600000
const enc = new TextEncoder()
const dec = new TextDecoder()

export const aleatoire = (n) => crypto.getRandomValues(new Uint8Array(n))

export function versB64(octets) {
  let s = ''
  const u = new Uint8Array(octets)
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000))
  return btoa(s)
}

export const depuisB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export const normaliserIdentifiant = (id) => id.trim().toLowerCase()

async function cleDeCompte(identifiant, motDePasse, sel, iterations) {
  const base = await crypto.subtle.importKey(
    'raw', enc.encode(`${normaliserIdentifiant(identifiant)}\u0000${motDePasse}`), 'PBKDF2', false, ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: sel, iterations },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  )
}

/** Fiche d'accès d'un compte : la clé maîtresse chiffrée avec l'identifiant et le mot de passe. */
export async function creerCompte(identifiant, motDePasse, cleMaitre) {
  const sel = aleatoire(16)
  const iv = aleatoire(12)
  const cle = await cleDeCompte(identifiant, motDePasse, sel, ITERATIONS)
  const chiffre = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cle, cleMaitre)
  return { iterations: ITERATIONS, sel: versB64(sel), iv: versB64(iv), cle: versB64(chiffre) }
}

/** Retrouve la clé maîtresse si l'identifiant et le mot de passe ouvrent l'un des comptes. */
export async function ouvrirCoffre(acces, identifiant, motDePasse) {
  for (const [index, compte] of acces.comptes.entries()) {
    try {
      const cle = await cleDeCompte(identifiant, motDePasse, depuisB64(compte.sel), compte.iterations)
      const brute = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: depuisB64(compte.iv) }, cle, depuisB64(compte.cle))
      return { cleMaitre: new Uint8Array(brute), index }
    } catch {
      // mauvais couple identifiant + mot de passe pour ce compte : on essaie le suivant
    }
  }
  return null
}

const importer = (cleMaitre) => crypto.subtle.importKey('raw', cleMaitre, 'AES-GCM', false, ['encrypt', 'decrypt'])

/** Format d'un fichier chiffré : 12 octets de vecteur d'initialisation, puis le contenu chiffré. */
export async function chiffrer(cleMaitre, donnees) {
  const iv = aleatoire(12)
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await importer(cleMaitre), donnees))
  const sortie = new Uint8Array(12 + chiffre.length)
  sortie.set(iv)
  sortie.set(chiffre, 12)
  return sortie
}

export async function dechiffrer(cleMaitre, octets) {
  const u = new Uint8Array(octets)
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.subarray(0, 12) }, await importer(cleMaitre), u.subarray(12)))
}

export const chiffrerJson = (cleMaitre, objet) => chiffrer(cleMaitre, enc.encode(JSON.stringify(objet)))
export const dechiffrerJson = async (cleMaitre, octets) => JSON.parse(dec.decode(await dechiffrer(cleMaitre, octets)))

/** Mot de passe aléatoire lisible (sans 0/O, 1/l/I), par groupes de 4 : environ 93 bits d'entropie. */
export function genererMotDePasse() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const groupes = []
  for (let g = 0; g < 4; g++) {
    let s = ''
    while (s.length < 4) {
      const [o] = aleatoire(1)
      if (o < 228) s += alphabet[o % alphabet.length] // 228 = 4 × 57 : pas de biais
    }
    groupes.push(s)
  }
  return groupes.join('-')
}

/** Règle minimale : 12 caractères, au moins une lettre et un chiffre. */
export function motDePasseValide(mdp) {
  return mdp.length >= 12 && /[A-Za-z]/.test(mdp) && /\d/.test(mdp)
}
