import { Atom, Banana, Dumbbell, Fish, Leaf, Magnet, Milk, Pill, Shield, Sun, Wheat, Apple } from 'lucide-react'

export const NUTRIENT_TONES = {
  protein: 'from-[#e5f6ec] to-[#d3eddf]',
  fiber: 'from-[#f8f1df] to-[#f3e4c4]',
  magnesium: 'from-[#e7eef8] to-[#d5e3f6]',
  'vitamin-b12': 'from-[#f8e9f2] to-[#f3d5e6]',
  'omega-3': 'from-[#e5f3f6] to-[#d3ebf1]',
  iron: 'from-[#f8ece6] to-[#f3ddd2]',
  calcium: 'from-[#f4f7f3] to-[#e7f0ea]',
  'vitamin-c': 'from-[#fff1e4] to-[#ffe0c4]',
  'vitamin-d': 'from-[#fff6df] to-[#ffe8b0]',
  potassium: 'from-[#fff4d8] to-[#ffe3a3]',
  zinc: 'from-[#eef2f4] to-[#dde6ea]',
  folate: 'from-[#eaf6ee] to-[#d7eedf]',
}

const ICONS = {
  protein: Dumbbell,
  fiber: Wheat,
  magnesium: Atom,
  'vitamin-b12': Pill,
  'omega-3': Fish,
  iron: Magnet,
  calcium: Milk,
  'vitamin-c': Apple,
  'vitamin-d': Sun,
  potassium: Banana,
  zinc: Shield,
  folate: Leaf,
}

export function NutrientMark({ slug, className = 'size-12' }) {
  const Icon = ICONS[slug] || Leaf
  return (
    <span className={`inline-flex items-center justify-center rounded-2xl bg-white/80 text-ink shadow-sm ring-1 ring-white ${className}`}>
      <Icon aria-hidden="true" size={22} />
    </span>
  )
}
