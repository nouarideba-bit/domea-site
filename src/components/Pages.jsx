import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { doux } from './Motion.jsx'
import Franchise from './Franchise.jsx'

// Informations de l'éditeur : ajouter le capital et le numéro RCS dès l'immatriculation de la société.
export const EDITEUR = {
  nom: 'DOMEA',
  statut: "société par actions simplifiée (SAS) en cours d'immatriculation",
  adresse: '58 rue de Ponthieu, 75008 Paris',
  directeur: 'le Président de DOMEA SAS',
  email: 'contact@domea-services.com',
}

const MISE_A_JOUR = '24 octobre 2026'

export const PAGES = {
  'devenir-franchise': {
    titre: 'Devenir franchisé',
    surtitre: 'Réseau DOMEA',
    chapo: "Ouvrez un hôtel de convalescence DOMEA au pied de l'hôpital de votre territoire, avec un concept, une méthode et un cadre déjà construits.",
    Contenu: Franchise,
    large: true,
  },
  'mentions-legales': { titre: 'Informations légales', Contenu: Mentions },
  'plan-du-site': { titre: 'Plan du site', Contenu: PlanDuSite },
  'donnees-personnelles': { titre: 'Données personnelles', Contenu: DonneesPersonnelles },
  cookies: { titre: 'Politique et gestion des cookies', Contenu: Cookies },
  accessibilite: { titre: 'Accessibilité : non conforme', Contenu: Accessibilite },
  'tarifs-et-conditions': { titre: 'Tarifs et conditions', Contenu: Tarifs },
  'ia-responsable': { titre: 'IA responsable', Contenu: IaResponsable },
  'signaler-un-contenu': { titre: 'Signaler un contenu', Contenu: Signaler },
}

const sections = [
  ['#concept', 'Le concept'],
  ['#sejours', 'Les séjours'],
  ['#parcours', 'Le parcours'],
  ['#proches', 'Les proches'],
  ['#etablissements', 'Pour les établissements'],
  ['#projet', 'Le projet'],
  ['#faq', 'Questions fréquentes'],
  ['#contact', 'Contact'],
]

// La page affichée suit l'ancre de l'adresse : #devenir-franchise, #mentions-legales, etc.
// Toute autre ancre ramène à la page d'accueil, à la section demandée.
export function usePage() {
  const lire = () => {
    const h = window.location.hash.slice(1)
    return PAGES[h] ? h : null
  }
  const [page, setPage] = useState(lire)
  useEffect(() => {
    const maj = () => setPage(lire())
    window.addEventListener('hashchange', maj)
    return () => window.removeEventListener('hashchange', maj)
  }, [])
  useEffect(() => {
    if (page) {
      window.scrollTo(0, 0)
      document.title = `${PAGES[page].titre} · DOMEA`
    } else {
      document.title = "DOMEA · L'art de se rétablir"
      const cible = window.location.hash && document.getElementById(window.location.hash.slice(1))
      if (cible) requestAnimationFrame(() => cible.scrollIntoView())
    }
  }, [page])
  return page
}

export function Page({ cle }) {
  const { titre, surtitre, chapo, Contenu, large } = PAGES[cle]
  return (
    <main className="page" key={cle}>
      <header className="page-tete">
        <motion.div className="conteneur" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: doux }}>
          <a href="#haut" className="page-retour">← Retour à l'accueil</a>
          <span className="surtitre">{surtitre || 'DOMEA · domea-services.com'}</span>
          <h1>{titre}</h1>
          {chapo ? <p className="chapo">{chapo}</p> : <p className="page-maj">Dernière mise à jour : {MISE_A_JOUR}</p>}
        </motion.div>
      </header>
      <motion.div className={`conteneur ${large ? '' : 'page-texte'}`}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: doux }}>
        <Contenu />
      </motion.div>
    </main>
  )
}

const Mail = () => <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
const Lien = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>

function Mentions() {
  return (
    <>
      <h2>Éditeur du site</h2>
      <p>
        Le site domea-services.com est édité par {EDITEUR.nom}, {EDITEUR.statut}, dont le siège est situé {EDITEUR.adresse}.
        Contact : <Mail />.
      </p>
      <p>Directeur de la publication : {EDITEUR.directeur}.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par GitHub, Inc. (service GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis ·{' '}
        <Lien href="https://github.com">github.com</Lien>.
      </p>
      <p>
        Le nom de domaine et la messagerie sont gérés par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France ·{' '}
        <Lien href="https://www.ovhcloud.com">ovhcloud.com</Lien>.
      </p>

      <h2>Nature du projet</h2>
      <p>
        DOMEA est un projet d'hébergement temporaire non médicalisé, actuellement en préparation. Aucune réservation n'est possible à ce stade.
        Les soins seront assurés par une HAD partenaire et les professionnels qu'elle coordonne : DOMEA n'est pas un établissement de santé et ne réalise aucun soin.
      </p>
      <p>
        Les informations publiées sur ce site sont générales et n'ont pas valeur de conseil médical. Les tarifs, chiffres et calendriers sont
        indicatifs et issus du prévisionnel du projet ; ils peuvent évoluer. Les photos sont des visuels d'intention.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du site (textes, visuels, logo, marque DOMEA, mise en page) est protégé par le droit de la propriété intellectuelle.
        Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable de l'éditeur est interdite.
      </p>

      <h2>Responsabilité et liens</h2>
      <p>
        L'éditeur s'efforce de fournir des informations exactes et à jour, sans pouvoir garantir l'absence d'erreur ou d'omission.
        Les liens vers des sites tiers sont fournis à titre d'information ; l'éditeur n'est pas responsable de leur contenu.
      </p>

      <h2>Droit applicable</h2>
      <p>Le présent site et ses informations légales sont régis par le droit français.</p>
    </>
  )
}

function PlanDuSite() {
  const pages = Object.entries(PAGES).filter(([cle]) => cle !== 'plan-du-site')
  return (
    <div className="plan">
      <div>
        <h2>Accueil</h2>
        <ul>{sections.map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul>
      </div>
      <div>
        <h2>Pages</h2>
        <ul>{pages.map(([cle, p]) => <li key={cle}><a href={`#${cle}`}>{p.titre}</a></li>)}</ul>
      </div>
    </div>
  )
}

function DonneesPersonnelles() {
  return (
    <>
      <p className="page-encadre">
        En résumé : ce site ne dépose aucun cookie, n'utilise aucun outil de mesure d'audience ni de publicité, et ne conserve aucune donnée.
        Seuls les messages que vous choisissez de nous envoyer par e-mail sont traités, uniquement pour vous répondre.
      </p>

      <h2>Responsable du traitement</h2>
      <p>{EDITEUR.nom} SAS, {EDITEUR.adresse} · <Mail />.</p>

      <h2>Données traitées</h2>
      <p>
        Les formulaires du site (contact, candidature franchise) ne transmettent rien à un serveur : ils préparent un e-mail dans votre propre
        messagerie, que vous décidez d'envoyer ou non. Si vous l'envoyez, nous recevons les informations que vous y avez saisies.
      </p>
      <p>
        Merci de ne pas nous transmettre d'informations sur votre santé par ce biais : elles ne sont pas nécessaires pour répondre à une demande
        d'information sur le projet.
      </p>

      <table className="page-tableau">
        <tbody>
          <tr><th>Finalités</th><td>Répondre à votre demande ; étudier une candidature à la franchise ou un partenariat ; si vous le souhaitez, vous informer de l'ouverture de DOMEA.</td></tr>
          <tr><th>Base légale</th><td>Notre intérêt légitime à répondre aux personnes qui nous écrivent (article 6.1.f du RGPD), ou des mesures précontractuelles prises à votre demande (article 6.1.b).</td></tr>
          <tr><th>Destinataires</th><td>L'équipe DOMEA uniquement. Les e-mails sont hébergés par OVH SAS, en France. Aucune donnée n'est vendue ni cédée.</td></tr>
          <tr><th>Durée de conservation</th><td>3 ans à compter de notre dernier échange, puis suppression.</td></tr>
        </tbody>
      </table>

      <h2>Hébergement et journaux techniques</h2>
      <p>
        Comme tout hébergeur, GitHub peut enregistrer l'adresse IP des visiteurs dans ses journaux techniques, à des fins de sécurité et de bon
        fonctionnement du service. GitHub, Inc. est établie aux États-Unis ; ces transferts sont encadrés par le cadre de protection des données
        UE–États-Unis (Data Privacy Framework) et les clauses contractuelles types de la Commission européenne. Voir la{' '}
        <Lien href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement">déclaration de confidentialité de GitHub</Lien>.
      </p>
      <p>Les polices de caractères sont hébergées avec le site : aucune requête n'est adressée à Google ou à un autre service tiers lors de votre visite.</p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur vos données, ainsi que
        du droit de définir des directives sur leur sort après votre décès. Pour les exercer, écrivez à <Mail /> : nous vous répondrons dans un
        délai d'un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL, 3 place de Fontenoy, TSA 80715,
        75334 Paris Cedex 07 · <Lien href="https://www.cnil.fr">cnil.fr</Lien>.
      </p>
    </>
  )
}

function Cookies() {
  return (
    <>
      <p className="page-encadre">Ce site n'utilise aucun cookie ni traceur. Il n'y a donc rien à accepter ni à refuser.</p>

      <h2>Politique des cookies</h2>
      <p>
        Un cookie est un petit fichier déposé sur votre appareil lors de la visite d'un site. DOMEA a fait le choix de n'en utiliser aucun :
        pas de mesure d'audience, pas de boutons de réseaux sociaux, pas de publicité, pas de vidéo intégrée depuis un service tiers.
        C'est pourquoi aucun bandeau de consentement ne vous est présenté.
      </p>

      <h2>Gestion des cookies</h2>
      <p>
        Aucun réglage n'est nécessaire sur ce site. Vous pouvez à tout moment supprimer ou bloquer les cookies de l'ensemble des sites depuis les
        paramètres de votre navigateur (Chrome, Safari, Firefox, Edge), ou consulter les conseils de la CNIL :{' '}
        <Lien href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur">maîtriser son navigateur</Lien>.
      </p>

      <h2>Évolution</h2>
      <p>
        Si DOMEA devait un jour utiliser un outil nécessitant des cookies, cette page serait mise à jour et votre accord serait demandé au préalable,
        avec la possibilité de refuser aussi simplement que d'accepter.
      </p>
    </>
  )
}

function Accessibilite() {
  return (
    <>
      <p>
        L'éditeur s'engage à rendre son site accessible, conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
        La présente déclaration s'applique au site domea-services.com.
      </p>

      <h2>État de conformité</h2>
      <p>
        Le site domea-services.com est <strong>non conforme</strong> avec le référentiel général d'amélioration de l'accessibilité (RGAA 4.1),
        car il n'a pas encore fait l'objet d'un audit de conformité.
      </p>

      <h2>Ce qui a été fait</h2>
      <ul>
        <li>contrastes de couleurs travaillés et textes de taille confortable ;</li>
        <li>navigation possible au clavier, structure de titres et zones de navigation balisées ;</li>
        <li>textes alternatifs sur les photos porteuses d'information ;</li>
        <li>animations réduites automatiquement si votre appareil le demande (« réduire les animations ») ;</li>
        <li>mise en page adaptée aux mobiles et au zoom.</li>
      </ul>

      <h2>Établissement de cette déclaration</h2>
      <p>
        Déclaration établie le {MISE_A_JOUR}. Technologies utilisées : HTML, CSS, JavaScript (React). Un audit RGAA est prévu avant l'ouverture
        du premier établissement.
      </p>

      <h2>Retour d'information et contact</h2>
      <p>
        Si vous n'arrivez pas à accéder à un contenu ou à un service, écrivez-nous à <Mail /> : nous vous orienterons vers une alternative
        accessible ou vous transmettrons le contenu sous une autre forme.
      </p>

      <h2>Voies de recours</h2>
      <p>
        Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu, que vous nous l'avez signalé et que vous n'avez pas
        obtenu de réponse satisfaisante, vous pouvez saisir le Défenseur des droits : par le{' '}
        <Lien href="https://formulaire.defenseurdesdroits.fr">formulaire en ligne</Lien>, auprès d'un délégué de votre région, ou par courrier
        gratuit : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07.
      </p>
    </>
  )
}

function Tarifs() {
  return (
    <>
      <p className="page-encadre">
        DOMEA est en préparation : aucune réservation, aucun paiement et aucun contrat ne sont possibles à ce jour. Les tarifs ci-dessous sont
        indicatifs et issus du prévisionnel du projet.
      </p>

      <h2>Tarifs indicatifs</h2>
      <table className="page-tableau">
        <tbody>
          <tr><th>Avant l'opération</th><td><strong>130 €</strong> la nuit · la veille d'une intervention, pour arriver reposé et à l'heure.</td></tr>
          <tr><th>Après l'opération</th><td><strong>340 € HT</strong> la nuit · hébergement, pension complète et services hôteliers, hors soins. Les soins sont assurés et facturés par l'HAD partenaire.</td></tr>
          <tr><th>Accompagnant</th><td><strong>110 €</strong> la nuit · pour rester tout près du patient pendant son séjour.</td></tr>
        </tbody>
      </table>

      <h2>Prise en charge</h2>
      <p>
        L'hébergement est réglé par le patient, avec le concours éventuel de sa mutuelle ou de son contrat d'assistance. Les soins sont pris en
        charge par l'Assurance Maladie via l'HAD partenaire, selon les règles habituelles. Des garanties dédiées sont en discussion avec les mutuelles.
        Les modalités définitives seront publiées avant l'ouverture.
      </p>

      <h2>Contrats</h2>
      <ul>
        <li><strong>Séjours</strong> : des conditions générales de vente seront publiées avant l'ouverture des réservations, avec le détail des prix, des modalités d'annulation et du droit de rétractation applicable.</li>
        <li><strong>Établissements de santé</strong> : chaque partenariat fera l'objet d'une convention précisant les critères d'admission, le partage des rôles entre l'hôtel et les soignants, et la conduite à tenir en cas d'urgence.</li>
        <li><strong>Franchise</strong> : voir la page <a href="#devenir-franchise">Devenir franchisé</a>.</li>
      </ul>
    </>
  )
}

function IaResponsable() {
  return (
    <>
      <p>DOMEA s'engage à utiliser l'intelligence artificielle avec prudence, transparence et sous contrôle humain.</p>

      <h2>Nos engagements</h2>
      <ul>
        <li><strong>Aucune décision médicale automatisée</strong> : l'admission, les soins et la surveillance relèvent toujours de professionnels de santé.</li>
        <li><strong>Pas de données de santé dans des outils d'IA grand public</strong> : les informations des patients ne sont jamais transmises à de tels services.</li>
        <li><strong>Un humain dans la boucle</strong> : tout contenu produit avec l'aide d'une IA est relu et validé par l'équipe avant publication.</li>
        <li><strong>Transparence</strong> : nous indiquons quand l'IA a contribué à un contenu ou à un service.</li>
        <li><strong>Conformité</strong> : nos usages suivent le règlement européen sur l'IA et le RGPD.</li>
      </ul>

      <h2>Sur ce site</h2>
      <p>
        Certains textes, la mise en page et le traitement de visuels de ce site ont été préparés avec l'aide d'outils d'IA générative, puis relus et
        validés par l'équipe DOMEA. Les photos sont des visuels d'intention et ne représentent pas un établissement existant. Le site ne comporte
        aucun agent conversationnel et ne réalise aucun traitement automatisé vous concernant.
      </p>

      <h2>Une question ?</h2>
      <p>Écrivez-nous à <Mail />.</p>
    </>
  )
}

function Signaler() {
  return (
    <>
      <p>
        Vous pensez qu'un contenu de ce site est illicite, inexact ou porte atteinte à vos droits ? Signalez-le-nous : nous l'examinerons rapidement
        et le retirerons ou le corrigerons si nécessaire.
      </p>

      <h2>Comment signaler</h2>
      <p>Écrivez à <Mail /> en précisant :</p>
      <ul>
        <li>l'adresse de la page et la description du contenu concerné ;</li>
        <li>les raisons pour lesquelles il devrait être retiré ou corrigé ;</li>
        <li>vos nom et coordonnées, pour que nous puissions vous répondre.</li>
      </ul>
      <p>
        Un accusé de réception vous sera adressé, puis notre décision motivée. Un signalement abusif présentant un contenu comme illicite en sachant
        cette information inexacte est passible de sanctions.
      </p>

      <h2>Contenus illicites graves</h2>
      <p>
        Pour un contenu illicite grave rencontré sur internet, vous pouvez aussi utiliser la plateforme officielle PHAROS :{' '}
        <Lien href="https://www.internet-signalement.gouv.fr">internet-signalement.gouv.fr</Lien>.
      </p>
    </>
  )
}
