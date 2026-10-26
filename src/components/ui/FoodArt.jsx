const SCENES = {
  fruit: { back: '#F8E7D6', a: '#F4B183', b: '#E07A5F', c: '#4F9C75' },
  bowl: { back: '#EAF5ED', a: '#F4B183', b: '#173E35', c: '#4F9C75' },
  fish: { back: '#E5F1F4', a: '#4F9C75', b: '#173E35', c: '#F4B183' },
  grain: { back: '#F6F0DE', a: '#E0C07A', b: '#173E35', c: '#4F9C75' },
  egg: { back: '#F7F3EA', a: '#F4E7C8', b: '#E07A5F', c: '#173E35' },
  soup: { back: '#F8EFE4', a: '#C96B4A', b: '#173E35', c: '#4F9C75' },
  plate: { back: '#EAF5ED', a: '#FFFFFF', b: '#4F9C75', c: '#F4B183' },
  jar: { back: '#F3EEE4', a: '#FFFFFF', b: '#4F9C75', c: '#F4B183' },
}

export function FoodArt({ scene = 'bowl', label }) {
  const tone = SCENES[scene] || SCENES.bowl
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label={label}>
      <rect width="320" height="200" fill={tone.back} />
      <ellipse cx="160" cy="168" rx="108" ry="16" fill="#173E35" opacity="0.08" />
      {scene === 'fish' ? (
        <path d="M70 110c40-36 90-36 130 0-40 28-90 28-130 0z" fill={tone.a} />
      ) : null}
      {scene === 'fruit' ? <circle cx="128" cy="104" r="42" fill={tone.a} /> : null}
      {scene === 'fruit' ? <circle cx="188" cy="112" r="34" fill={tone.b} /> : null}
      {scene === 'egg' ? <ellipse cx="160" cy="112" rx="46" ry="58" fill={tone.a} /> : null}
      {scene === 'egg' ? <circle cx="160" cy="108" r="18" fill={tone.b} /> : null}
      {scene !== 'fish' && scene !== 'fruit' && scene !== 'egg' ? (
        <path d="M78 126h164c-8 28-40 42-82 42s-74-14-82-42z" fill={tone.a} />
      ) : null}
      <circle cx="214" cy="58" r="16" fill={tone.c} />
      <path d="M214 42c8 8 10 18 4 28" fill="none" stroke={tone.b} strokeWidth="4" />
    </svg>
  )
}

export function sceneForFood(food) {
  if (!food) return 'bowl'
  if (food.category === 'fish') return 'fish'
  if (food.category === 'fruit') return 'fruit'
  if (food.category === 'egg') return 'egg'
  if (food.category === 'grain') return 'grain'
  if (food.category === 'dairy' || food.kind === 'prepared') return 'jar'
  return 'plate'
}

export function sceneForRecipe(recipe) {
  if (!recipe) return 'bowl'
  if (recipe.meal === 'snack') return 'fruit'
  if (recipe.id.includes('soup') || recipe.id === 'bissara' || recipe.id === 'harira') return 'soup'
  if (recipe.meal === 'breakfast') return 'bowl'
  return 'plate'
}
