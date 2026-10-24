import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

const doux = [0.22, 1, 0.36, 1]

// Apparition au défilement : fondu + légère montée.
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: doux, delay }}
    >
      {children}
    </Comp>
  )
}

// Conteneur qui fait apparaître ses enfants <Item> l'un après l'autre.
export function Cascade({ children, className, as = 'div', ecart = 0.1 }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: ecart } } }}
    >
      {children}
    </Comp>
  )
}

export function Item({ children, className, as = 'div', ...rest }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      variants={{
        cache: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: doux } },
      }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

// Chiffre qui défile jusqu'à sa valeur quand il entre à l'écran.
export function Compteur({ valeur, decimales = 0, prefixe = '', suffixe = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-40px' })
  const reduit = useReducedMotion()
  const formate = (v) =>
    prefixe +
    v.toLocaleString('fr-FR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).replace(/\u202f/g, '\u00a0') +
    suffixe

  useEffect(() => {
    if (!visible || !ref.current) return
    if (reduit) {
      ref.current.textContent = formate(valeur)
      return
    }
    const controle = animate(0, valeur, {
      duration: 1.8,
      ease: doux,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formate(v)
      },
    })
    return () => controle.stop()
  }, [visible])

  return <span ref={ref}>{formate(0)}</span>
}

export { doux }

// Photo révélée au défilement : le cadre s'ouvre et l'image se recadre doucement.
export function Photo({ src, alt, className = '', position = 'center', delay = 0 }) {
  const chemin = `${import.meta.env.BASE_URL}photos/${src}`
  return (
    <motion.div
      className={`photo ${className}`}
      initial={{ clipPath: 'inset(12% 12% 12% 12% round 28px)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease: doux, delay }}
    >
      <motion.img
        src={chemin}
        alt={alt}
        loading="lazy"
        style={{ objectPosition: position }}
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.6, ease: doux, delay }}
      />
    </motion.div>
  )
}
