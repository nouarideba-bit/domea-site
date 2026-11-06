#!/usr/bin/env node
// Gestion de l'espace confidentiel (public/espace/), voir README, section « Espace confidentiel ».
//
//   node scripts/espace.mjs publier --source <dossier>       chiffre les documents du dossier et met à jour le catalogue
//   node scripts/espace.mjs publier --source <dossier> --nouvelle-cle
//                                                              nouvelle clé : tous les anciens accès sont révoqués
//   node scripts/espace.mjs compte                             change l'identifiant et le mot de passe d'un compte
//   node scripts/espace.mjs ajouter-compte                     ajoute un accès (par exemple pour un partenaire)
//
// Le dossier source contient les documents en clair et un fichier catalogue.json ; il ne doit
// jamais être ajouté au dépôt (espace-prive/ est ignoré par git).
// Identifiants : variables ESPACE_IDENTIFIANT / ESPACE_MOT_DE_PASSE (compte existant) et
// ESPACE_NOUVEL_IDENTIFIANT / ESPACE_NOUVEAU_MOT_DE_PASSE (nouveau compte), sinon saisie au clavier.
// --generer crée un mot de passe aléatoire pour le nouveau compte et l'affiche.

import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import {
  aleatoire, chiffrer, chiffrerJson, creerCompte, genererMotDePasse, motDePasseValide, ouvrirCoffre,
} from '../src/espace/coffre.js'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = join(RACINE, 'public', 'espace')
const ACCES = join(SORTIE, 'acces.json')

const TYPES = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
}

const args = process.argv.slice(2)
const commande = args[0]
const option = (nom) => args.includes(`--${nom}`)
const valeur = (nom) => { const i = args.indexOf(`--${nom}`); return i >= 0 ? args[i + 1] : undefined }

let rl
async function demander(question, variable) {
  if (process.env[variable]) return process.env[variable]
  rl ??= createInterface({ input: process.stdin, output: process.stdout })
  return (await rl.question(question)).trim()
}

function quitter(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

async function lireAcces() {
  if (!existsSync(ACCES)) return null
  return JSON.parse(await readFile(ACCES, 'utf8'))
}

async function ecrireAcces(acces) {
  await mkdir(SORTIE, { recursive: true })
  await writeFile(ACCES, `${JSON.stringify(acces, null, 2)}\n`)
}

async function ouvrir(acces) {
  const id = await demander('Identifiant actuel : ', 'ESPACE_IDENTIFIANT')
  const mdp = await demander('Mot de passe actuel : ', 'ESPACE_MOT_DE_PASSE')
  const ouvert = await ouvrirCoffre(acces, id, mdp)
  if (!ouvert) quitter('Identifiant ou mot de passe incorrect.')
  return ouvert
}

async function nouveauCompte() {
  const id = await demander('Nouvel identifiant : ', 'ESPACE_NOUVEL_IDENTIFIANT')
  if (!id) quitter('Identifiant vide.')
  const mdp = option('generer') ? genererMotDePasse() : await demander('Nouveau mot de passe : ', 'ESPACE_NOUVEAU_MOT_DE_PASSE')
  if (!motDePasseValide(mdp)) quitter('Mot de passe trop faible : 12 caractères minimum, avec au moins une lettre et un chiffre.')
  return { id, mdp }
}

const taille = (o) => (o < 1e6 ? `${Math.round(o / 1e3)} Ko` : `${(o / 1e6).toFixed(1).replace('.', ',')} Mo`)

async function publier() {
  const source = valeur('source')
  if (!source) quitter('Indiquez le dossier des documents : --source <dossier>.')
  const catalogueSource = JSON.parse(await readFile(join(source, 'catalogue.json'), 'utf8'))

  let acces = await lireAcces()
  let cleMaitre
  if (!acces || option('nouvelle-cle')) {
    cleMaitre = aleatoire(32)
    const { id, mdp } = await nouveauCompte()
    acces = { version: 1, comptes: [await creerCompte(id, mdp, cleMaitre)] }
    console.log(`\nNouvelle clé créée. Compte : ${id}${option('generer') ? `  ·  mot de passe : ${mdp}` : ''}`)
  } else {
    ;({ cleMaitre } = await ouvrir(acces))
  }

  // Les anciens fichiers chiffrés sont remplacés ; leurs noms sont aléatoires et ne disent rien du contenu.
  await rm(join(SORTIE, 'd'), { recursive: true, force: true })
  await mkdir(join(SORTIE, 'd'), { recursive: true })

  const rubriques = []
  for (const rubrique of catalogueSource.rubriques) {
    const documents = []
    for (const doc of rubrique.documents) {
      const chemin = join(source, doc.fichier)
      const donnees = await readFile(chemin)
      const fichier = `d/${Buffer.from(aleatoire(10)).toString('hex')}.bin`
      await writeFile(join(SORTIE, fichier), await chiffrer(cleMaitre, donnees))
      documents.push({
        titre: doc.titre,
        description: doc.description || '',
        nom: doc.nom || basename(doc.fichier),
        type: TYPES[extname(doc.fichier).toLowerCase()] || 'application/octet-stream',
        taille: taille((await stat(chemin)).size),
        fichier,
      })
      console.log(`  ✓ ${doc.titre}`)
    }
    rubriques.push({ titre: rubrique.titre, documents })
  }

  const maj = new Date().toISOString().slice(0, 10)
  await writeFile(join(SORTIE, 'catalogue.bin'), await chiffrerJson(cleMaitre, { maj, rubriques }))
  await ecrireAcces(acces)
  const n = rubriques.reduce((s, r) => s + r.documents.length, 0)
  console.log(`\n${n} documents chiffrés dans public/espace/. Rien n'y est lisible sans identifiant et mot de passe.`)
}

async function changerCompte() {
  const acces = await lireAcces()
  if (!acces) quitter("L'espace n'existe pas encore : lancez d'abord « publier ».")
  const { cleMaitre, index } = await ouvrir(acces)
  const { id, mdp } = await nouveauCompte()
  acces.comptes[index] = await creerCompte(id, mdp, cleMaitre)
  await ecrireAcces(acces)
  console.log(`\nCompte mis à jour : ${id}${option('generer') ? `  ·  mot de passe : ${mdp}` : ''}`)
}

async function ajouterCompte() {
  const acces = await lireAcces()
  if (!acces) quitter("L'espace n'existe pas encore : lancez d'abord « publier ».")
  const { cleMaitre } = await ouvrir(acces)
  const { id, mdp } = await nouveauCompte()
  acces.comptes.push(await creerCompte(id, mdp, cleMaitre))
  await ecrireAcces(acces)
  console.log(`\nAccès ajouté : ${id}${option('generer') ? `  ·  mot de passe : ${mdp}` : ''} (${acces.comptes.length} comptes)`)
}

const commandes = { publier, compte: changerCompte, 'ajouter-compte': ajouterCompte }
if (!commandes[commande]) {
  console.log('Usage : node scripts/espace.mjs publier --source <dossier> [--nouvelle-cle] [--generer] | compte [--generer] | ajouter-compte [--generer]')
  process.exit(commande ? 1 : 0)
}
await commandes[commande]()
rl?.close()
