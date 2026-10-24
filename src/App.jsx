import { useRef, useState } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Cascade, Compteur, Item, Photo, Reveal, doux } from './components/Motion.jsx'
import * as I from './components/Icones.jsx'

const EMAIL = 'contact@domea-services.com'

const liens = [
  ['#concept', 'Le concept'],
  ['#sejours', 'Séjours'],
  ['#parcours', 'Parcours'],
  ['#proches', 'Proches'],
  ['#etablissements', 'Établissements'],
  ['#projet', 'Le projet'],
  ['#faq', 'Questions'],
]

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BarreProgression />
      <Entete />
      <main>
        <Heros />
        <Constat />
        <Solution />
        <Sejours />
        <Parcours />
        <Journee />
        <Proches />
        <Etablissements />
        <Projet />
        <BandeauJardin />
        <Faq />
        <Contact />
      </main>
      <Pied />
    </MotionConfig>
  )
}

function BarreProgression() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="barre-progression" style={{ scaleX }} />
}

function Entete() {
  const { scrollY } = useScroll()
  const [defile, setDefile] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const [survol, setSurvol] = useState(null)
  useMotionValueEvent(scrollY, 'change', (y) => setDefile(y > 30))

  return (
    <>
      <motion.header
        className={`entete ${defile || ouvert ? 'defile' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: doux }}
      >
        <div className="conteneur entete-inner">
          <a href="#haut" className="logo" aria-label="DOMEA, retour en haut">
            <I.Logo /> DOMEA
          </a>
          <nav className="nav" aria-label="Navigation principale" onMouseLeave={() => setSurvol(null)}>
            {liens.map(([href, label]) => (
              <a key={href} href={href} onMouseEnter={() => setSurvol(href)}>
                {survol === href && (
                  <motion.span layoutId="nav-survol" className="nav-survol" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {label}
              </a>
            ))}
            <motion.a href="#contact" className="bouton bouton-plein" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Nous contacter
            </motion.a>
          </nav>
          <button className="burger" aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>
            {ouvert ? <I.Croix /> : <I.Menu />}
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {ouvert && (
          <motion.nav
            className="menu-mobile"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {[...liens, ['#contact', 'Nous contacter']].map(([href, label], i) => (
              <motion.a key={href} href={href} onClick={() => setOuvert(false)}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                {label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

function Heros() {
  const { scrollY } = useScroll()
  const yPhoto = useTransform(scrollY, [0, 800], [0, 160])
  const echelle = useTransform(scrollY, [0, 800], [1.05, 1.15])
  const yTexte = useTransform(scrollY, [0, 600], [0, -60])
  const mots = ['Se', 'rétablir', 'près', 'de', "l'hôpital,"]

  return (
    <section className="heros" id="haut">
      <motion.div className="heros-fond" style={{ y: yPhoto, scale: echelle }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
        <img src={`${import.meta.env.BASE_URL}photos/residence.jpg`} alt="La résidence DOMEA, ses terrasses et son jardin, à côté de l'hôpital" />
      </motion.div>
      <div className="heros-voile" />

      <motion.div className="conteneur heros-contenu" style={{ y: yTexte }}>
        <motion.span className="surtitre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Hôtel de convalescence · Site pilote de 60 chambres
        </motion.span>
        <h1>
          {mots.map((m, i) => (
            <motion.span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: doux, delay: 0.35 + i * 0.08 }}>
              {m}
            </motion.span>
          ))}
          <motion.em style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: doux, delay: 0.35 + mots.length * 0.08 }}>
            comme à la maison.
          </motion.em>
        </h1>
        <motion.p className="chapo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
          DOMEA accueille les patients avant et après une opération, et leurs proches, au pied d'un hôpital partenaire.
          Le confort d'un hôtel, une équipe soignante présente jour et nuit, pour environ trois fois moins qu'une journée d'hospitalisation.
        </motion.p>
        <motion.div className="heros-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.15 }}>
          <motion.a href="#sejours" className="bouton bouton-plein" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Découvrir les séjours <I.Fleche />
          </motion.a>
          <motion.a href="#etablissements" className="bouton bouton-clair" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Vous êtes un établissement de santé
          </motion.a>
        </motion.div>
        <Cascade className="pastilles" ecart={0.08}>
          {['Avant l’opération', 'Après l’opération', 'Avec ses proches'].map((t) => (
            <Item key={t} as="span" className="pastille"><i />{t}</Item>
          ))}
        </Cascade>
      </motion.div>

      <motion.div className="heros-carte" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.7, ease: doux }}>
        <span className="icone-rond"><I.Lieu /></span>
        <div><strong>0 km</strong><span>de l'hôpital partenaire</span></div>
      </motion.div>
      <motion.a href="#concept" className="defiler" aria-label="Défiler vers la suite"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <span />
      </motion.a>
    </section>
  )
}

function Constat() {
  const chiffres = [
    { v: 84, s: ' %', t: 'Taux d’occupation des lits de médecine, chirurgie et obstétrique dans les hôpitaux publics.' },
    { v: 45700, s: '', t: 'Lits d’hospitalisation complète supprimés en France depuis 2013, soit 11 % du parc.' },
    { v: 1700, s: ' €', t: 'Coût moyen d’une journée en chirurgie, contre environ 1 300 € en médecine.' },
    { v: 2.9, d: 1, s: ' Md€', t: 'Déficit des hôpitaux publics en 2024, soit 2,7 % de leurs recettes.' },
  ]
  return (
    <section className="section constat" id="concept">
      <div className="conteneur">
        <div className="constat-grille">
        <Photo src="couloir-hopital.jpg" alt="Couloir d'hôpital encombré de lits" className="photo-haute" />
        <div>
        <Reveal className="entete-section">
          <span className="surtitre">01 · Le constat</span>
          <h2>L'hôpital est plein. Une partie de ses lits pourrait être libérée.</h2>
          <p className="chapo">
            Beaucoup de patients opérés sont stables dès le lendemain, mais restent hospitalisés « par précaution » :
            ils habitent loin, vivent seuls ou rentrent dans un logement inadapté. Chaque nuit dans un lit de chirurgie
            coûte cher à la collectivité et bloque la place d'un autre patient.
          </p>
        </Reveal>
        <Cascade className="chiffres">
          {chiffres.map((c) => (
            <Item key={c.t} className="chiffre">
              <strong><Compteur valeur={c.v} decimales={c.d || 0} suffixe={c.s} /></strong>
              <p>{c.t}</p>
            </Item>
          ))}
        </Cascade>
        </div>
        </div>
        <Reveal as="blockquote" className="citation">
          « Le bon soin, au bon endroit, au juste prix : c'est tout l'enjeu du virage ambulatoire. »
        </Reveal>
        <p className="source">Sources : DREES (2024), Assurance Maladie. Ordres de grandeur.</p>
      </div>
    </section>
  )
}

function Solution() {
  const piliers = [
    { icone: <I.Lit />, titre: 'Le confort d’un hôtel', texte: 'Chambres spacieuses, salle d’eau adaptée, restaurant, salon et jardin. On s’y repose vraiment, loin de l’agitation d’un service.' },
    { icone: <I.Coeur />, titre: 'Des soins coordonnés', texte: 'Infirmiers et aides-soignants présents jour et nuit, kinésithérapeutes, médecin coordonnateur à temps partiel, télésurveillance.' },
    { icone: <I.Lien />, titre: 'Relié à l’hôpital', texte: 'Convention avec le service qui vous a opéré, dossier partagé et retour garanti dans le service en cas de besoin.' },
  ]
  return (
    <section className="section">
      <div className="conteneur">
        <div className="duo">
          <Reveal className="entete-section">
            <span className="surtitre">02 · La solution</span>
            <h2>Un lieu de séjour entre l'hôpital et la maison.</h2>
            <p className="chapo">
              DOMEA est construit au pied d'un hôpital partenaire. Le patient y poursuit sa convalescence dans une chambre
              pensée comme un hôtel haut de gamme, avec un lien direct avec l'équipe qui l'a opéré.
            </p>
          </Reveal>
          <Photo src="chambre.jpg" alt="Chambre DOMEA : lit habillé comme un lit d'hôtel, fauteuil, grande baie sur le jardin" className="photo-large" />
        </div>
        <Cascade className="piliers">
          {piliers.map((p) => (
            <Item key={p.titre} className="carte" whileHover={{ y: -6, transition: { duration: 0.25 } }}>
              <span className="icone-rond">{p.icone}</span>
              <h3>{p.titre}</h3>
              <p>{p.texte}</p>
            </Item>
          ))}
        </Cascade>
        <Reveal className="bandeau-ratio" delay={0.1}>
          <strong>÷3</strong>
          <p>Une nuit DOMEA, soins courants et pension compris, coûte environ trois fois moins qu'une journée en chirurgie.</p>
        </Reveal>
      </div>
    </section>
  )
}

const sejours = [
  {
    id: 'avant',
    onglet: 'Avant',
    moment: 'La veille de l’opération',
    titre: 'Arriver serein, à quelques pas du bloc.',
    texte: 'Le patient qui habite loin arrive la veille, dîne, dort au calme et se présente au bloc à 7 h, à pied. Fini le trajet de nuit et le stress du matin.',
    points: ['Repas adapté, y compris à jeun avant l’intervention', 'Navette ou accompagnement jusqu’à l’hôpital', 'Une chambre pour un proche si besoin'],
    prix: '130 €',
    detail: 'la nuit, à titre indicatif',
    photo: 'accueil.jpg',
    alt: 'Arrivée à l’accueil DOMEA, valise à la main',
  },
  {
    id: 'apres',
    onglet: 'Après',
    moment: 'De J+1 à J+10 · le cœur de DOMEA',
    titre: 'Une convalescence entourée et rassurante.',
    texte: 'Dès que le chirurgien juge le patient stable, souvent le lendemain, il prescrit le transfert vers DOMEA. Le patient récupère dans un cadre apaisant, avec les soins dont il a besoin.',
    points: ['Pansements, gestion de la douleur, rééducation quotidienne', 'Repas validés par un diététicien', 'Télésurveillance et téléconsultation avec le chirurgien', 'Retour à domicile préparé avec les soignants de ville'],
    prix: '480 €',
    detail: 'la nuit, soins courants et pension compris (tarif indicatif)',
    photo: 'soins.jpg',
    alt: 'Une soignante et un kinésithérapeute accompagnent des patients en convalescence',
  },
  {
    id: 'avec',
    onglet: 'Avec',
    moment: 'Pendant tout le séjour',
    titre: 'Les proches restent tout près.',
    texte: 'Un conjoint, un enfant, un parent : chacun peut dormir sur place, partager les repas et profiter du salon et du jardin. Personne ne vit l’opération seul.',
    points: ['Chambre accompagnant ou lit d’appoint', 'Repas au restaurant avec le patient', 'Espace enfants et coin travail'],
    prix: '110 €',
    detail: 'la nuit, à titre indicatif',
    photo: 'proches.jpg',
    alt: 'Un patient partage un repas avec ses proches au restaurant',
  },
]

function Sejours() {
  const [actif, setActif] = useState('apres')
  const s = sejours.find((x) => x.id === actif)
  return (
    <section className="section sejours" id="sejours">
      <div className="conteneur">
        <Reveal className="entete-section">
          <span className="surtitre">03 · Les séjours</span>
          <h2>Avant, après, avec : trois façons de séjourner chez DOMEA.</h2>
        </Reveal>
        <div className="onglets" role="tablist" aria-label="Types de séjour">
          {sejours.map((x) => (
            <button key={x.id} role="tab" aria-selected={actif === x.id} aria-controls="panneau-sejour"
              className={`onglet ${actif === x.id ? 'actif' : ''}`} onClick={() => setActif(x.id)}>
              {actif === x.id && <motion.span layoutId="onglet-fond" className="onglet-fond" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{x.onglet}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.id} id="panneau-sejour" role="tabpanel" className="sejour-panneau"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: doux }}>
            <div>
              <p className="moment">{s.moment}</p>
              <h3>{s.titre}</h3>
              <p>{s.texte}</p>
              <ul>
                {s.points.map((p, i) => (
                  <motion.li key={p} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                    <I.Coche />{p}
                  </motion.li>
                ))}
              </ul>
              <div className="prix"><strong>{s.prix}</strong><span>{s.detail}</span></div>
            </div>
            <motion.div className="sejour-visuel photo" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: doux }}>
              <motion.img src={`${import.meta.env.BASE_URL}photos/${s.photo}`} alt={s.alt}
                initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: doux }} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function Parcours() {
  const etapes = [
    { n: 1, quand: 'Étape 1 · La veille', titre: 'Avant : arriver serein', texte: 'Le patient venu de loin dort sur place et rejoint le bloc à pied le matin.', badge: '130 €', sous: 'la nuit' },
    { n: 2, quand: 'Étape 2 · Jour J', titre: 'L’opération à l’hôpital', texte: 'L’intervention et la première surveillance ont lieu dans le service. Le chirurgien décide du transfert quand le patient est stable.', badge: 'Hôpital', sous: 'bloc et réveil' },
    { n: 3, quand: 'Étape 3 · De J+1 à J+10', titre: 'Après : la convalescence', texte: 'Soins, rééducation avec les kinés, repas adaptés et téléconsultation, dans un cadre apaisant.', badge: '480 €', sous: 'la nuit, tout compris' },
    { n: 4, quand: 'Étape 4 · Le retour', titre: 'Le retour à domicile préparé', texte: 'Ordonnances, matériel, passage de l’infirmier et du kiné libéraux : tout est organisé avant le départ.', badge: 'Ville', sous: 'relais libéraux' },
  ]
  return (
    <section className="section" id="parcours">
      <div className="conteneur">
        <Reveal className="entete-section">
          <span className="surtitre">04 · Le parcours patient</span>
          <h2>Quatre étapes, un seul fil conducteur.</h2>
          <p className="chapo">Du soir qui précède l'opération jusqu'au retour à la maison, DOMEA organise chaque étape avec l'hôpital et les soignants de ville.</p>
        </Reveal>
        <RailParcours etapes={etapes} />
        <Reveal className="note-proches">
          À chaque étape, les proches peuvent rester : un accompagnant dort sur place pour 110 € la nuit, prend ses repas au restaurant et profite du salon et du jardin.
        </Reveal>
      </div>
    </section>
  )
}

function RailParcours({ etapes }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })
  return (
    <div className="parcours-liste" ref={ref}>
      <div className="parcours-rail"><motion.div className="parcours-rail-plein" style={{ scaleY }} /></div>
      {etapes.map((e, i) => (
        <Reveal key={e.n} className="etape" delay={i * 0.05}>
          <motion.span className="etape-num" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}>{e.n}</motion.span>
          <div>
            <small>{e.quand}</small>
            <h3>{e.titre}</h3>
            <p>{e.texte}</p>
          </div>
          <div className="etape-badge"><strong>{e.badge}</strong><span>{e.sous}</span></div>
        </Reveal>
      ))}
    </div>
  )
}

function Journee() {
  const horaires = [
    ['7 h 30', 'Passage infirmier : constantes, douleur, traitement.'],
    ['8 h 30', 'Petit-déjeuner en chambre ou au restaurant.'],
    ['10 h', 'Séance de kinésithérapie et marche accompagnée.'],
    ['12 h 30', 'Déjeuner adapté, partagé avec un proche.'],
    ['15 h', 'Pansement, puis téléconsultation avec le chirurgien.'],
    ['17 h', 'Repos au jardin ou au salon.'],
    ['Nuit', 'Infirmier et aide-soignant présents, appel possible à toute heure.'],
  ]
  return (
    <section className="section journee">
      <div className="conteneur">
        <Reveal className="entete-section">
          <span className="surtitre">05 · Une journée type à J+3</span>
          <h2>Une journée chez DOMEA, entourée et rassurante.</h2>
        </Reveal>
        <Photo src="hall.jpg" alt="Le hall lumineux de DOMEA, accueil et espaces de repos" className="photo-bandeau" position="center 60%" />
        <div className="journee-grille">
          <Cascade className="horaires" ecart={0.07}>
            {horaires.map(([h, t]) => (
              <Item key={h} className="horaire"><b>{h}</b><span>{t}</span></Item>
            ))}
          </Cascade>
          <Cascade className="equipe">
            <Item className="carte"><strong>2+2</strong><p>infirmiers et aides-soignants présents en permanence</p></Item>
            <Item className="carte"><strong>3</strong><p>kinésithérapeutes pour la rééducation quotidienne</p></Item>
            <Item className="carte"><strong>1</strong><p>médecin coordonnateur à temps partiel</p></Item>
            <Item className="carte"><strong>48</strong><p>emplois au total : soin, accueil et restauration</p></Item>
            <Item className="securite">
              <h3>La sécurité avant tout</h3>
              <ul>
                {['Critères d’admission validés par le chirurgien', 'Télésurveillance avec seuils d’alerte', 'Retour garanti dans le service', 'Protocole écrit des soins autorisés'].map((t) => (
                  <li key={t}><I.Bouclier width={18} height={18} />{t}</li>
                ))}
              </ul>
            </Item>
          </Cascade>
        </div>
      </div>
    </section>
  )
}

function Proches() {
  return (
    <section className="section" id="proches">
      <div className="conteneur proches-grille">
        <Reveal>
          <span className="surtitre">06 · Les proches</span>
          <h2>Les proches restent tout près.</h2>
          <p className="chapo">
            Un conjoint, un enfant, un parent : chacun peut rester tout près, dans une chambre à prix raisonnable, et partager les repas.
            Les patients venus de loin ou d'outre-mer ne vivent plus l'opération seuls.
          </p>
          <ul className="liste-services">
            {['Restaurant savoureux', 'Salon chaleureux', 'Jardin apaisant'].map((t) => <li key={t}><I.Coche />{t}</li>)}
          </ul>
          <Cascade className="proches-chiffres">
            <Item><strong>110 €</strong><p>la nuit, chambre accompagnant ou lit d’appoint</p></Item>
            <Item><strong>15 %</strong><p>des nuitées prévues pour les proches</p></Item>
            <Item><strong>0 km</strong><p>pas d’hôtel à trouver, pas de trajet</p></Item>
          </Cascade>
        </Reveal>
        <Reveal delay={0.15}>
          <Photo src="proches.jpg" alt="Patient entouré de sa famille autour d'une table, devant le jardin" className="photo-carree" />
        </Reveal>
      </div>
    </section>
  )
}

function Etablissements() {
  const cibles = [
    { titre: 'Hôpitaux publics et CHU', texte: 'Libérer des lits, réduire la durée de séjour et rattraper les listes d’attente. Un lit libéré, c’est une nouvelle admission.' },
    { titre: 'Cliniques privées', texte: 'Développer l’ambulatoire et la récupération rapide (RAAC) en orthopédie, bariatrique ou urologie, avec une sortie à J+1 sereine.' },
    { titre: 'Mutuelles et assureurs', texte: 'Réduire le coût des complications et des réhospitalisations avec un forfait « convalescence DOMEA » intégrable aux garanties.' },
  ]
  const barres = [
    { label: 'Journée en chirurgie', v: 1700, couleur: '#c9774f' },
    { label: 'Journée en médecine', v: 1300, couleur: '#e7a47c' },
    { label: 'Nuit DOMEA, tout compris', v: 480, couleur: '#1f4d4a' },
  ]
  return (
    <section className="section etablissements" id="etablissements">
      <div className="conteneur">
        <Reveal className="entete-section">
          <span className="surtitre">07 · Pour les établissements</span>
          <h2>Un partenaire pour fluidifier vos services.</h2>
          <p className="chapo">
            DOMEA signe une convention avec chaque établissement et peut porter à sa place la charge administrative de l'hébergement temporaire
            (déclarations, coordination, facturation).
          </p>
        </Reveal>
        <Cascade className="cibles">
          {cibles.map((c) => (
            <Item key={c.titre} className="cible" whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.09)' }}>
              <h3>{c.titre}</h3>
              <p>{c.texte}</p>
            </Item>
          ))}
        </Cascade>
        <Reveal className="comparatif">
          <h3>Coût d'une nuit après une opération</h3>
          {barres.map((b, i) => (
            <div key={b.label} className="barre-ligne">
              <span>{b.label}</span>
              <div className="barre">
                <motion.div style={{ background: b.couleur }} initial={{ scaleX: 0 }} whileInView={{ scaleX: b.v / 1700 }}
                  viewport={{ once: true }} transition={{ duration: 1.2, ease: doux, delay: 0.2 + i * 0.15 }} />
              </div>
              <span><Compteur valeur={b.v} suffixe=" €" /></span>
            </div>
          ))}
          <p className="source">Coûts hospitaliers : moyennes publiées (d'après l'Assurance Maladie). Prix DOMEA indicatif, scénario central du projet.</p>
        </Reveal>
      </div>
    </section>
  )
}

function Projet() {
  const etapes = [
    ['Hôpital pilote', 'Choisir la ville et obtenir une lettre d’intention.'],
    ['Mesure du besoin', 'Compter avec l’hôpital les journées qui pourraient se faire chez DOMEA.'],
    ['Cadre juridique', 'Valider l’hébergement et les soins coordonnés avec l’ARS.'],
    ['Article 51', 'Déposer une expérimentation pour financer le séjour au-delà du forfait hôtelier.'],
    ['Bâtiment', 'Identifier un bâtiment à reconvertir près de l’hôpital.'],
    ['Financeurs', 'Présenter le dossier à la Banque des Territoires.'],
  ]
  return (
    <section className="section" id="projet">
      <div className="conteneur">
        <Reveal className="entete-section">
          <span className="surtitre">08 · Le projet</span>
          <h2>Moins cher pour la collectivité, utile pour le territoire.</h2>
          <p className="chapo">Un site pilote de 60 chambres, avec une ouverture visée en 2028, puis un modèle reproductible près d'autres hôpitaux.</p>
        </Reveal>
        <Cascade className="impact">
          <Item className="carte"><strong><Compteur valeur={60} /></strong><p>chambres sur le site pilote</p></Item>
          <Item className="carte"><strong><Compteur valeur={40} /></strong><p>lits d’hôpital libérés, l’équivalent d’un service</p></Item>
          <Item className="carte"><strong><Compteur valeur={15} suffixe=" M€" /></strong><p>de coûts hospitaliers évités chaque année en croisière</p></Item>
          <Item className="carte"><strong><Compteur valeur={48} /></strong><p>emplois directs, locaux et non délocalisables</p></Item>
        </Cascade>
        <Reveal className="villes">
          <span className="surtitre" style={{ margin: 0 }}>Villes pilotes envisagées</span>
          {['Toulouse', 'Lyon', 'Sud de Paris'].map((v, i) => (
            <motion.span key={v} className="ville" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.1 }}>{v}</motion.span>
          ))}
        </Reveal>
        <Cascade className="etapes-projet" ecart={0.08}>
          {etapes.map(([t, d], i) => (
            <Item key={t} className="etape-projet">
              <b>{i + 1}</b>
              <div><h4>{t}</h4><p>{d}</p></div>
            </Item>
          ))}
        </Cascade>
      </div>
    </section>
  )
}

const questions = [
  ['DOMEA est-il une clinique ?', 'Non. DOMEA est un hébergement temporaire non médicalisé, situé au pied d’un hôpital partenaire. Les soins y sont assurés par des professionnels de santé, en coordination avec le service qui a opéré le patient. Les patients qui ont besoin d’une surveillance médicale continue restent à l’hôpital.'],
  ['Qui peut séjourner chez DOMEA ?', 'Un patient stable, dont le séjour est prescrit ou validé par son chirurgien selon des critères d’admission écrits avec l’hôpital. Les proches peuvent l’accompagner pendant tout le séjour.'],
  ['Combien coûte un séjour et qui le paie ?', 'Les tarifs affichés sont indicatifs : 130 € la nuit avant l’opération, environ 480 € la nuit de convalescence (soins courants et pension compris), 110 € pour un accompagnant. Une partie peut être couverte par le forfait d’hébergement temporaire de l’Assurance Maladie versé à l’hôpital, le complément étant en cours de discussion avec les hôpitaux et les mutuelles.'],
  ['Que se passe-t-il en cas de problème ?', 'Une télésurveillance avec seuils d’alerte est suivie en lien avec le service d’origine, et le retour dans le service est garanti par la convention signée avec l’hôpital.'],
  ['Quand et où DOMEA ouvrira-t-il ?', 'L’ouverture du premier site, de 60 chambres, est visée en 2028. Toulouse, Lyon et le sud de Paris sont envisagés. Laissez-nous vos coordonnées pour être informé.'],
  ['Notre établissement peut-il devenir partenaire ?', 'Oui, nous recherchons un hôpital pilote. Écrivez-nous via le formulaire ci-dessous : nous vous présenterons le projet et la manière de mesurer ensemble le besoin dans vos services.'],
]

function BandeauJardin() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <section className="bandeau-jardin" ref={ref}>
      <motion.img src={`${import.meta.env.BASE_URL}photos/jardin.jpg`} alt="Le jardin de DOMEA, allée et banc sous les arbres" style={{ y }} />
      <div className="bandeau-jardin-voile" />
      <Reveal className="conteneur bandeau-jardin-texte">
        <p className="surtitre">Ouverture visée en 2028</p>
        <h2>Le bon soin, au bon endroit, au juste prix.</h2>
      </Reveal>
    </section>
  )
}

function Faq() {
  const [ouverte, setOuverte] = useState(0)
  return (
    <section className="section faq" id="faq">
      <div className="conteneur">
        <Reveal className="entete-section centre">
          <span className="surtitre">09 · Questions fréquentes</span>
          <h2>Vos questions, nos réponses.</h2>
        </Reveal>
        <div className="faq-liste">
          {questions.map(([q, r], i) => {
            const active = ouverte === i
            return (
              <Reveal key={q} className="question" delay={i * 0.04} y={16}>
                <button aria-expanded={active} onClick={() => setOuverte(active ? null : i)}>
                  {q}
                  <motion.span className="plus" animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.3 }}><I.Plus /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div className="reponse" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: doux }}>
                      <p>{r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const profils = ['Patient ou proche', 'Établissement de santé', 'Mutuelle ou assureur', 'Investisseur ou partenaire', 'Presse']

function Contact() {
  const [profil, setProfil] = useState(profils[0])
  const [envoye, setEnvoye] = useState(false)

  // Pas de serveur : le formulaire prépare un e-mail dans la messagerie du visiteur.
  function envoyer(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const corps = [
      `Profil : ${profil}`,
      `Nom : ${f.get('nom')}`,
      `E-mail : ${f.get('email')}`,
      f.get('organisation') ? `Organisation : ${f.get('organisation')}` : null,
      '',
      f.get('message'),
    ].filter((l) => l !== null).join('\n')
    const sujet = `Contact site DOMEA · ${profil}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
    setEnvoye(true)
  }

  return (
    <section className="section" id="contact">
      <div className="conteneur contact-grille">
        <Reveal>
          <span className="surtitre">10 · Contact</span>
          <h2>Parlons de votre projet de soin, ou du nôtre.</h2>
          <p className="chapo">
            DOMEA est en préparation : aucune réservation n'est encore possible. Écrivez-nous pour être informé de l'ouverture,
            devenir établissement pilote ou rejoindre le projet.
          </p>
          <div className="coordonnees">
            <a href={`mailto:${EMAIL}`}><span className="icone-rond"><I.Mail /></span>{EMAIL}</a>
            <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span className="icone-rond"><I.Lieu /></span>Toulouse · Lyon · Sud de Paris</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form className="formulaire" onSubmit={envoyer}>
            <div className="champ">
              <label>Vous êtes</label>
              <div className="profils" role="radiogroup" aria-label="Vous êtes">
                {profils.map((p) => (
                  <button type="button" key={p} role="radio" aria-checked={profil === p}
                    className={`profil ${profil === p ? 'actif' : ''}`} onClick={() => setProfil(p)}>
                    {profil === p && <motion.span layoutId="profil-fond" className="onglet-fond" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="champs-duo">
              <div className="champ"><label htmlFor="nom">Nom</label><input id="nom" name="nom" required autoComplete="name" /></div>
              <div className="champ"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
            </div>
            <div className="champ"><label htmlFor="organisation">Organisation (facultatif)</label><input id="organisation" name="organisation" autoComplete="organization" /></div>
            <div className="champ"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="5" required /></div>
            <motion.button type="submit" className="bouton bouton-terre" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Envoyer le message <I.Fleche />
            </motion.button>
            <AnimatePresence>
              {envoye && (
                <motion.small initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Votre messagerie s'est ouverte avec le message prêt à partir. Si rien ne s'affiche, écrivez-nous directement à {EMAIL}.
                </motion.small>
              )}
            </AnimatePresence>
            {!envoye && <small>Vos informations servent uniquement à vous répondre. Elles ne sont ni conservées sur ce site, ni partagées.</small>}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Pied() {
  return (
    <footer className="pied">
      <div className="conteneur">
        <div className="pied-grille">
          <div>
            <a href="#haut" className="logo"><I.Logo /> DOMEA</a>
            <p>Le bon soin, au bon endroit, au juste prix. Hôtel de convalescence au pied de l'hôpital, pour les patients et leurs proches.</p>
          </div>
          <div>
            <h4>Découvrir</h4>
            <ul>{liens.slice(0, 4).map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul>
          </div>
          <div>
            <h4>Partenaires</h4>
            <ul>{liens.slice(4).map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}<li><a href="#contact">Contact</a></li></ul>
          </div>
        </div>
        <div className="mentions" id="mentions">
          <p>
            DOMEA est un projet d'hébergement temporaire non médicalisé, en préparation. Les soins y seront assurés par des professionnels de santé
            en coordination avec l'hôpital partenaire ; DOMEA n'est pas un établissement de santé. Les tarifs et chiffres présentés sont indicatifs
            et issus du prévisionnel du projet (scénario central). Les photos sont des visuels d’intention.
          </p>
          <p>© {new Date().getFullYear()} DOMEA · domea-services.com</p>
        </div>
      </div>
    </footer>
  )
}
