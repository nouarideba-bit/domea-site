import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { doux } from './Motion.jsx'
import * as I from './Icones.jsx'
import {
  creerCompte, dechiffrer, dechiffrerJson, genererMotDePasse, motDePasseValide, normaliserIdentifiant, ouvrirCoffre,
} from '../espace/coffre.js'

// Espace confidentiel : les documents sont publiés chiffrés dans public/espace/ et déchiffrés
// ici, dans le navigateur, avec l'identifiant et le mot de passe. Rien n'est envoyé à un serveur.
// La clé reste en mémoire le temps de la visite : recharger la page ou se déconnecter l'efface.

const DOSSIER = `${import.meta.env.BASE_URL}espace/`
const DEPOT_TELEVERSER = 'https://github.com/nouarideba-bit/domea-site/upload/main/public/espace'
const EXPIRATION = 30 * 60 * 1000 // déconnexion après 30 minutes d'inactivité

async function charger(chemin, json = false) {
  const r = await fetch(DOSSIER + chemin, { cache: 'no-store' })
  if (!r.ok) throw new Error(`${chemin} : ${r.status}`)
  return json ? r.json() : r.arrayBuffer()
}

export default function Espace() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!session) return
    let minuteur
    const relancer = () => {
      clearTimeout(minuteur)
      minuteur = setTimeout(() => setSession(null), EXPIRATION)
    }
    const evenements = ['pointerdown', 'keydown', 'scroll']
    evenements.forEach((e) => window.addEventListener(e, relancer, { passive: true }))
    relancer()
    return () => {
      clearTimeout(minuteur)
      evenements.forEach((e) => window.removeEventListener(e, relancer))
    }
  }, [session])

  return (
    <AnimatePresence mode="wait">
      {session
        ? <Documents key="docs" session={session} quitter={() => setSession(null)} />
        : <Connexion key="connexion" ouvrir={setSession} />}
    </AnimatePresence>
  )
}

const apparition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: doux } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

function Connexion({ ouvrir }) {
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [etat, setEtat] = useState('repos') // repos | verification | refuse | indisponible

  async function valider(e) {
    e.preventDefault()
    setEtat('verification')
    try {
      const acces = await charger('acces.json', true)
      const ouvert = await ouvrirCoffre(acces, identifiant, motDePasse)
      if (!ouvert) {
        setEtat('refuse')
        return
      }
      const catalogue = await dechiffrerJson(ouvert.cleMaitre, await charger('catalogue.bin'))
      setMotDePasse('')
      ouvrir({ ...ouvert, acces, catalogue, identifiant: normaliserIdentifiant(identifiant) })
    } catch {
      setEtat('indisponible')
    }
  }

  return (
    <motion.div className="espace-connexion" {...apparition}>
      <div className="espace-sceau"><I.Cadenas width={26} height={26} /></div>
      <h2>Connexion</h2>
      <p className="espace-aide">Accès réservé aux partenaires et investisseurs de DOMEA. Les identifiants vous ont été remis personnellement.</p>
      <form onSubmit={valider} className="espace-formulaire">
        <div className="champ">
          <label htmlFor="espace-id">Identifiant</label>
          <input id="espace-id" autoComplete="username" autoCapitalize="none" spellCheck={false} required
            value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
        </div>
        <div className="champ">
          <label htmlFor="espace-mdp">Mot de passe</label>
          <input id="espace-mdp" type="password" autoComplete="current-password" required
            value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
        </div>
        <p className="espace-message" role="status" aria-live="polite">
          {etat === 'refuse' && 'Identifiant ou mot de passe incorrect.'}
          {etat === 'indisponible' && "L'espace est momentanément indisponible. Merci de réessayer dans quelques instants."}
        </p>
        <button className="bouton bouton-plein" disabled={etat === 'verification'}>
          {etat === 'verification' ? 'Vérification…' : <>Accéder aux documents <I.Fleche /></>}
        </button>
      </form>
      <p className="espace-note">
        <I.Bouclier width={18} height={18} /> Documents chiffrés : ils ne sont lisibles qu'avec vos identifiants, directement dans votre navigateur.
      </p>
    </motion.div>
  )
}

const libelleType = (type) => (
  type === 'application/pdf' ? 'PDF'
    : type.includes('spreadsheet') ? 'Excel'
      : type.includes('wordprocessing') ? 'Word'
        : type.includes('presentation') ? 'PowerPoint'
          : 'Fichier'
)

function Documents({ session, quitter }) {
  const { catalogue, cleMaitre } = session
  const [enCours, setEnCours] = useState(null)
  const [erreur, setErreur] = useState('')
  const [reglages, setReglages] = useState(false)

  async function ouvrirDocument(doc, telecharger) {
    // L'onglet est ouvert tout de suite (sinon le navigateur le bloque), puis rempli une fois le fichier déchiffré.
    const onglet = telecharger ? null : window.open('', '_blank')
    setEnCours(doc.fichier)
    setErreur('')
    try {
      const contenu = await dechiffrer(cleMaitre, await charger(doc.fichier))
      const url = URL.createObjectURL(new Blob([contenu], { type: doc.type }))
      if (onglet) {
        onglet.location.href = url
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = doc.nom
        a.click()
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch {
      onglet?.close()
      setErreur(`« ${doc.titre} » n'a pas pu être ouvert. Merci de réessayer.`)
    } finally {
      setEnCours(null)
    }
  }

  const dateMaj = new Date(`${catalogue.maj}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <motion.div {...apparition}>
      <div className="espace-barre">
        <div>
          <span className="espace-connecte"><I.Cadenas width={16} height={16} /> Connecté : {session.identifiant}</span>
          <span className="espace-maj">Documents à jour au {dateMaj}</span>
        </div>
        <div className="espace-actions">
          <button className="bouton bouton-contour bouton-petit" onClick={() => setReglages((r) => !r)} aria-expanded={reglages}>
            Changer le mot de passe
          </button>
          <button className="bouton bouton-plein bouton-petit" onClick={quitter}>Se déconnecter</button>
        </div>
      </div>

      <AnimatePresence>
        {reglages && <ChangerMotDePasse session={session} fermer={() => setReglages(false)} />}
      </AnimatePresence>

      {erreur && <p className="espace-message" role="alert">{erreur}</p>}

      {catalogue.rubriques.map((rubrique) => (
        <section className="espace-rubrique" key={rubrique.titre}>
          <h2>{rubrique.titre}</h2>
          <ul className="espace-liste">
            {rubrique.documents.map((doc) => (
              <li className="espace-doc" key={doc.fichier}>
                <span className="espace-type">{libelleType(doc.type)}</span>
                <div className="espace-doc-texte">
                  <h3>{doc.titre}</h3>
                  {doc.description && <p>{doc.description}</p>}
                  <small>{doc.nom} · {doc.taille}</small>
                </div>
                <div className="espace-doc-actions">
                  {doc.type === 'application/pdf' && (
                    <button className="bouton bouton-contour bouton-petit" disabled={enCours === doc.fichier} onClick={() => ouvrirDocument(doc, false)}>
                      Consulter
                    </button>
                  )}
                  <button className="bouton bouton-plein bouton-petit" disabled={enCours === doc.fichier} onClick={() => ouvrirDocument(doc, true)}>
                    {enCours === doc.fichier ? 'Déchiffrement…' : 'Télécharger'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="espace-confidentialite">
        Ces documents sont strictement confidentiels. Ils vous sont communiqués à titre personnel, dans le cadre de l'étude du projet DOMEA,
        et ne peuvent être transmis à des tiers sans l'accord écrit de DOMEA SAS.
      </p>
    </motion.div>
  )
}

function ChangerMotDePasse({ session, fermer }) {
  const [identifiant, setIdentifiant] = useState(session.identifiant)
  const [mdp, setMdp] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [visible, setVisible] = useState(false)
  const [erreur, setErreur] = useState('')
  const [pret, setPret] = useState(false)
  const [calcul, setCalcul] = useState(false)

  function proposer() {
    const m = genererMotDePasse()
    setMdp(m)
    setConfirmation(m)
    setVisible(true)
  }

  async function valider(e) {
    e.preventDefault()
    setErreur('')
    if (!identifiant.trim()) return setErreur("L'identifiant ne peut pas être vide.")
    if (!motDePasseValide(mdp)) return setErreur('Le mot de passe doit compter au moins 12 caractères, avec au moins une lettre et un chiffre.')
    if (mdp !== confirmation) return setErreur('Les deux mots de passe ne sont pas identiques.')
    setCalcul(true)
    const comptes = [...session.acces.comptes]
    comptes[session.index] = await creerCompte(identifiant, mdp, session.cleMaitre)
    const fichier = new Blob([`${JSON.stringify({ ...session.acces, comptes }, null, 2)}\n`], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(fichier)
    a.download = 'acces.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 60000)
    setCalcul(false)
    setPret(true)
  }

  return (
    <motion.div className="espace-reglages" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: doux }}>
      <div className="espace-reglages-inner">
        {!pret ? (
          <form onSubmit={valider} className="espace-formulaire">
            <h3>Nouveaux identifiants</h3>
            <p className="espace-aide">
              Le site n'a pas de serveur : le changement prend la forme d'un fichier <strong>acces.json</strong> que vous déposez ensuite sur GitHub.
              Les documents ne changent pas.
            </p>
            <div className="champ">
              <label htmlFor="nouvel-id">Identifiant</label>
              <input id="nouvel-id" autoComplete="username" autoCapitalize="none" spellCheck={false}
                value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
            </div>
            <div className="champs-duo">
              <div className="champ">
                <label htmlFor="nouveau-mdp">Nouveau mot de passe</label>
                <input id="nouveau-mdp" type={visible ? 'text' : 'password'} autoComplete="new-password"
                  value={mdp} onChange={(e) => setMdp(e.target.value)} />
              </div>
              <div className="champ">
                <label htmlFor="confirmation-mdp">Confirmation</label>
                <input id="confirmation-mdp" type={visible ? 'text' : 'password'} autoComplete="new-password"
                  value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
              </div>
            </div>
            <div className="espace-ligne">
              <button type="button" className="lien-bouton" onClick={proposer}>Proposer un mot de passe robuste</button>
              <label className="espace-case"><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> Afficher</label>
            </div>
            <small>12 caractères minimum, avec au moins une lettre et un chiffre. Notez-le avant de valider.</small>
            {erreur && <p className="espace-message">{erreur}</p>}
            <div className="espace-ligne">
              <button className="bouton bouton-plein bouton-petit" disabled={calcul}>{calcul ? 'Préparation…' : 'Préparer le fichier acces.json'}</button>
              <button type="button" className="bouton bouton-contour bouton-petit" onClick={fermer}>Annuler</button>
            </div>
          </form>
        ) : (
          <div>
            <h3>Dernière étape : publier le fichier</h3>
            <ol className="espace-etapes">
              <li>Le fichier <strong>acces.json</strong> vient d'être téléchargé sur votre ordinateur.</li>
              <li>Ouvrez la <a href={DEPOT_TELEVERSER} target="_blank" rel="noreferrer">page de dépôt GitHub du dossier espace</a> (connecté au compte du site).</li>
              <li>Glissez-y le fichier <strong>acces.json</strong>, puis cliquez sur « Commit changes ».</li>
              <li>Après environ deux minutes, le nouveau mot de passe fonctionne et l'ancien est refusé.</li>
            </ol>
            <p className="espace-aide">
              Si vous pensez que l'ancien mot de passe a été communiqué à une personne non autorisée, demandez aussi un changement de clé :
              les documents sont alors chiffrés à nouveau et tous les anciens accès deviennent inutilisables.
            </p>
            <button className="bouton bouton-contour bouton-petit" onClick={fermer}>Fermer</button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
