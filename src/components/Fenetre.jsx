import { motion } from 'framer-motion'

// Emblème « La Fenêtre » : de dos, une personne se repose face à une fenêtre en arche.
const traits = [
  { d: 'M48 220 V110 A52 52 0 0 1 152 110 V220', or: true, w: 1.8 },
  { d: 'M30 220 H170', or: true, w: 1.8 },
  { d: 'M100 58 V83 M48 140 H72 M128 140 H152', or: true, w: 0.9, o: 0.6 },
  { d: 'M134 84 A10 10 0 1 1 123 72 A7.5 7.5 0 1 0 134 84 Z', or: true, w: 1.4 },
  { d: 'M64 220 V176 Q64 166 72 164 V136 Q72 116 100 114 Q128 116 128 136 V164 Q136 166 136 176 V220', w: 1.6 },
  { d: 'M72 164 Q100 172 128 164', w: 1.2 },
  { d: 'M91 115 C88 104 93 95 101 94 C109 93 114 101 112 114', w: 1.6 },
  { d: 'M100 94 C99 87 105 83 110 86 C114 89 112 95 107 96', w: 1.6 },
  { d: 'M120 120 Q140 150 132 196 L124 200 Q130 156 112 128', or: true, w: 1.2 },
]

export default function Fenetre({ largeur = 120, trait = 'currentColor', or = '#c9ab7e', delai = 0, dessiner = true, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="24 50 152 176"
      width={largeur}
      height={(largeur * 176) / 152}
      role="img"
      aria-label="Emblème DOMEA : de dos, une personne se repose dans un fauteuil face à une fenêtre"
    >
      {traits.map((t, i) => (
        <motion.path
          key={i}
          d={t.d}
          fill="none"
          stroke={t.or ? or : trait}
          strokeWidth={t.w}
          opacity={t.o ?? 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={dessiner ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: delai + i * 0.12 }}
        />
      ))}
    </svg>
  )
}
