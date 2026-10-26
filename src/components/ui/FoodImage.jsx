import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import credits from '../../data/imageCredits.json'
import { FoodArt, sceneForFood } from './FoodArt.jsx'

export function creditForFood(food) {
  if (!food) return null
  if (food.imageUrl) {
    return {
      src: food.imageUrl,
      author: food.imageAttribution || '',
      license: food.imageLicense || '',
      page: food.imagePage || '',
    }
  }
  const key = food.key || String(food.id || '').replace(/^curated:/, '')
  return credits.foods[key] || null
}

export function creditForRecipe(recipeOrId) {
  const id = typeof recipeOrId === 'string' ? recipeOrId : recipeOrId?.id
  return (id && credits.recipes[id]) || null
}

export function FoodImage({ alt, src, scene = 'plate', eager = false }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="absolute inset-0">
        <FoodArt scene={scene} label={alt} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export function FoodPhoto({ food, alt, eager = false }) {
  const credit = creditForFood(food)
  return <FoodImage alt={alt} src={credit?.src} scene={sceneForFood(food)} eager={eager} />
}

export function RecipePhoto({ recipe, alt, eager = false }) {
  const credit = creditForRecipe(recipe)
  return <FoodImage alt={alt} src={credit?.src} scene="plate" eager={eager} />
}

export function PhotoCredit({ credit }) {
  const { t } = useTranslation()
  if (!credit?.author && !credit?.page) return null
  return (
    <p className="text-[11px] leading-4 text-muted">
      <span>{t('visual.photo')}</span>
      {' '}
      {credit.page ? (
        <a className="underline" href={credit.page}>{credit.author || credit.license}</a>
      ) : (
        <span>{credit.author}</span>
      )}
      {credit.license ? <span> · <bdi dir="ltr">{credit.license}</bdi></span> : null}
    </p>
  )
}
