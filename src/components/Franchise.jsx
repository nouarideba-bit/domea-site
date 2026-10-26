import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cascade, Compteur, Item, Reveal } from './Motion.jsx'
import * as I from './Icones.jsx'

const EMAIL = 'contact@domea-services.com'

const profils = ['Hôtelier', 'Investisseur ou foncière', 'Acteur de santé', 'Entrepreneur']

const apports = [
  [I.Bouclier, 'Un cadre juridique balisé', "Le modèle d'hébergement temporaire non médicalisé, les conventions types avec l'hôpital et les partenaires de soins (HAD, infirmiers libéraux)."],
  [I.Lien, "La relation avec l'hôpital", "Une méthode pour mesurer le besoin avec les services de chirurgie, écrire les critères d'admission et organiser le retour en service."],
  [I.Lit, 'Un concept prêt à construire', "Cahier des charges des chambres et des espaces communs, identité DOMEA, parcours patient et accompagnant."],
  [I.Coeur, "La qualité du partenariat de soins", "Convention type avec l'HAD, protocole d'alerte, formation des équipes d'accueil, sans aucun soin réalisé par l'hôtel."],
  [I.Famille, "L'expérience des proches", 'Offre accompagnants, restauration, salon et jardin : tout ce qui fait de DOMEA un lieu où l’on se sent chez soi.'],
  [I.Lune, "L'accompagnement dans la durée", "Ouverture assistée, outils de réservation et de pilotage, achats groupés, animation du réseau."],
]

const attentes = [
  "Un terrain ou un bâtiment à reconvertir à proximité immédiate d'un hôpital qui pratique la chirurgie programmée.",
  "Une capacité d'investissement adaptée à un établissement d'environ 60 chambres, seul ou avec des partenaires financiers.",
  "Une implantation locale et l'envie de travailler main dans la main avec les équipes hospitalières.",
  "L'adhésion à la promesse DOMEA : le bon soin, au bon endroit, au juste prix.",
]

const etapes = [
  ['Candidature', 'Vous nous présentez votre projet et votre territoire via le formulaire ci-dessous.'],
  ['Premier échange', 'Un rendez-vous pour faire connaissance, présenter le concept et vérifier nos attentes réciproques.'],
  ['Étude du site', "Analyse de l'hôpital, du bassin de patients, du foncier et du plan de financement."],
  ['Document d’information', "Remise du document d'information précontractuelle au moins 20 jours avant toute signature (loi Doubin)."],
  ['Contrat et formation', 'Signature, conception du bâtiment, recrutement et formation des équipes.'],
  ['Ouverture', 'Ouverture accompagnée, puis suivi qualité et animation du réseau.'],
]

export default function Franchise() {
  const [profil, setProfil] = useState(profils[0])
  const [envoye, setEnvoye] = useState(false)

  // Pas de serveur : la candidature prépare un e-mail dans la messagerie du visiteur.
  function envoyer(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const corps = [
      `Profil : ${profil}`,
      `Nom : ${f.get('nom')}`,
      `E-mail : ${f.get('email')}`,
      f.get('telephone') ? `Téléphone : ${f.get('telephone')}` : null,
      `Ville ou hôpital visé : ${f.get('ville')}`,
      f.get('apport') ? `Capacité d'investissement : ${f.get('apport')}` : null,
      '',
      f.get('message'),
    ].filter((l) => l !== null).join('\n')
    const sujet = `Candidature franchise DOMEA · ${profil}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
    setEnvoye(true)
  }

  return (
    <div className="franchise">
      <Reveal className="franchise-annonce">
        <strong>Le réseau ouvre après le site pilote.</strong> Le premier établissement DOMEA, de 60 chambres, est visé pour 2028.
        Nous constituons dès maintenant le cercle des futurs franchisés : les premiers candidats pourront choisir leur territoire.
      </Reveal>

      <Cascade className="impact franchise-chiffres">
        <Item className="carte"><strong><Compteur valeur={60} /></strong><p>chambres, le format type d'un établissement</p></Item>
        <Item className="carte"><strong><Compteur valeur={10} suffixe=" M€" /></strong><p>d'investissement environ, immobilier compris (prévisionnel du pilote)</p></Item>
        <Item className="carte"><strong><Compteur valeur={48} /></strong><p>emplois directs créés sur le territoire</p></Item>
        <Item className="carte"><strong><Compteur valeur={147} /></strong><p>hôtels hospitaliers en France, et aucun pensé pour les patients en HAD</p></Item>
      </Cascade>

      <section className="franchise-bloc">
        <Reveal className="entete-section">
          <span className="surtitre">Ce que DOMEA vous apporte</span>
          <h2>Un modèle complet, pour ouvrir sereinement.</h2>
        </Reveal>
        <Cascade className="piliers franchise-apports">
          {apports.map(([Icone, t, d]) => (
            <Item key={t} className="carte">
              <span className="icone-rond"><Icone /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Item>
          ))}
        </Cascade>
      </section>

      <section className="franchise-bloc franchise-duo">
        <Reveal>
          <span className="surtitre">Ce que vous apportez</span>
          <h2>Un territoire, un hôpital, un engagement.</h2>
          <p className="chapo">Nous recherchons des hôteliers, des investisseurs et foncières, des acteurs de santé et des entrepreneurs ancrés dans leur région.</p>
        </Reveal>
        <Cascade className="franchise-liste">
          {attentes.map((a) => (
            <Item key={a} className="franchise-attente"><span className="icone-rond"><I.Coche /></span><p>{a}</p></Item>
          ))}
        </Cascade>
      </section>

      <section className="franchise-bloc">
        <Reveal className="entete-section">
          <span className="surtitre">Les étapes</span>
          <h2>De la candidature à l'ouverture.</h2>
        </Reveal>
        <Cascade className="etapes-projet" ecart={0.08}>
          {etapes.map(([t, d], i) => (
            <Item key={t} className="etape-projet">
              <b>{i + 1}</b>
              <div><h4>{t}</h4><p>{d}</p></div>
            </Item>
          ))}
        </Cascade>
      </section>

      <section className="franchise-bloc contact-grille" id="candidature">
        <Reveal>
          <span className="surtitre">Candidature</span>
          <h2>Parlons de votre territoire.</h2>
          <p className="chapo">
            Dites-nous qui vous êtes et où vous imaginez un établissement DOMEA. Nous revenons vers vous pour un premier échange, sans engagement.
          </p>
          <p className="franchise-note">
            Le réseau de franchise DOMEA est en cours de structuration. Cette page ne constitue pas une offre de franchise : les droits d'entrée,
            redevances et conditions seront présentés dans le document d'information précontractuelle prévu par l'article L. 330-3 du Code de commerce.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <form className="formulaire" onSubmit={envoyer}>
            <div className="champ">
              <label>Vous êtes</label>
              <div className="profils" role="radiogroup" aria-label="Vous êtes">
                {profils.map((p) => (
                  <button type="button" key={p} role="radio" aria-checked={profil === p}
                    className={`profil ${profil === p ? 'actif' : ''}`} onClick={() => setProfil(p)}>
                    {profil === p && <motion.span layoutId="franchise-profil" className="onglet-fond" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="champs-duo">
              <div className="champ"><label htmlFor="f-nom">Nom</label><input id="f-nom" name="nom" required autoComplete="name" /></div>
              <div className="champ"><label htmlFor="f-email">E-mail</label><input id="f-email" name="email" type="email" required autoComplete="email" /></div>
            </div>
            <div className="champs-duo">
              <div className="champ"><label htmlFor="f-tel">Téléphone (facultatif)</label><input id="f-tel" name="telephone" type="tel" autoComplete="tel" /></div>
              <div className="champ"><label htmlFor="f-ville">Ville ou hôpital visé</label><input id="f-ville" name="ville" required /></div>
            </div>
            <div className="champ">
              <label htmlFor="f-apport">Capacité d'investissement (facultatif)</label>
              <select id="f-apport" name="apport" defaultValue="">
                <option value="">Je préfère en parler de vive voix</option>
                <option>Moins de 1 M€</option>
                <option>1 à 3 M€</option>
                <option>3 à 10 M€</option>
                <option>Plus de 10 M€</option>
              </select>
            </div>
            <div className="champ"><label htmlFor="f-message">Votre projet</label><textarea id="f-message" name="message" rows="5" required /></div>
            <motion.button type="submit" className="bouton bouton-terre" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Envoyer ma candidature <I.Fleche />
            </motion.button>
            <AnimatePresence>
              {envoye && (
                <motion.small initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Votre messagerie s'est ouverte avec la candidature prête à partir. Si rien ne s'affiche, écrivez-nous directement à {EMAIL}.
                </motion.small>
              )}
            </AnimatePresence>
            {!envoye && <small>Vos informations servent uniquement à étudier votre candidature. <a href="#donnees-personnelles">Données personnelles</a></small>}
          </form>
        </Reveal>
      </section>
    </div>
  )
}
