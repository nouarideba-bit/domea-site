const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Coche = (p) => (<svg {...base} width={18} height={18} {...p}><path d="M5 12.5l4.2 4L19 7" /></svg>)
export const Lit = (p) => (<svg {...base} {...p}><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="2" /></svg>)
export const Coeur = (p) => (<svg {...base} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /><path d="M8.5 11h2l1-2 1.5 4 1-2h1.5" /></svg>)
export const Lien = (p) => (<svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>)
export const Lune = (p) => (<svg {...base} {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>)
export const Famille = (p) => (<svg {...base} {...p}><circle cx="8" cy="7" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 20a4 4 0 0 1 8 0" /></svg>)
export const Bouclier = (p) => (<svg {...base} {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>)
export const Mail = (p) => (<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6 8.5-6" /></svg>)
export const Lieu = (p) => (<svg {...base} {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>)
export const Fleche = (p) => (<svg {...base} width={18} height={18} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const Plus = (p) => (<svg {...base} width={18} height={18} {...p}><path d="M12 5v14M5 12h14" /></svg>)
export const Menu = (p) => (<svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>)
export const Croix = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)

export function Logo(props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <rect width="64" height="64" rx="16" fill="#22324d" />
      <path d="M18 44V20h12c8 0 14 5 14 12s-6 12-14 12z" fill="none" stroke="#f6f1ea" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="47" cy="17" r="5" fill="#9aab86" />
    </svg>
  )
}
