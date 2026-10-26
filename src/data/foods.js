/**
 * Curated starter catalog.
 * Numbers come from USDA FoodData Central SR Legacy (public domain), per 100 g.
 * A missing nutrient id stays null ("not reported"). A stored 0 is a reported zero.
 * PUFA 18:3 is shown as ALA only when USDA nutrient 1404 is present.
 * Nutrient 1270 (18:3, type unspecified) is kept separate and is never renamed ALA.
 */
import raw from './nutrientValues.json'
import { NUTRIENT_KEYS } from '../lib/nutrition/units.js'

function nutrientsFor(key) {
  const source = raw[key]?.nutrients
  if (!source) throw new Error(`Missing USDA nutrients for ${key}`)
  const ala = source.omega3AlaG == null ? null : source.omega3AlaG
  const nutrients = {}
  for (const nutrientKey of NUTRIENT_KEYS) {
    if (nutrientKey === 'pufa183UnspecifiedG') {
      nutrients[nutrientKey] = ala == null ? (source.pufa183G == null ? null : source.pufa183G) : null
      continue
    }
    const value = source[nutrientKey]
    nutrients[nutrientKey] = value == null ? null : value
  }
  return nutrients
}

function grams(amount, en, fr, ar) {
  return { amount, unit: 'g', label: { en, fr, ar } }
}

function entry(partial) {
  const record = raw[partial.key]
  const nutrientsPerReference = nutrientsFor(partial.key)
  const hasMacros = ['energyKcal', 'proteinG', 'carbohydrateG', 'fatG'].every(
    (nutrientKey) => nutrientsPerReference[nutrientKey] != null,
  )
  return {
    kind: 'whole',
    tags: [],
    allergens: [],
    servings: [],
    ...partial,
    id: `curated:${partial.key}`,
    source: 'usda',
    sourceRecordId: String(record.fdcId),
    sourceUrl: `https://fdc.nal.usda.gov/food-details/${record.fdcId}/nutrients`,
    sourceName: 'USDA FoodData Central SR Legacy',
    referenceAmount: 100,
    referenceUnit: 'g',
    nutrientsPerReference,
    dataCompleteness: hasMacros ? 'partial' : 'incomplete',
  }
}

export const FOODS = [
  entry({
    key: 'banana',
    names: { en: 'Banana', fr: 'Banane', ar: 'موز' },
    aliases: ['banana', 'bananas', 'banane', 'موز'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw banana, edible portion.',
      fr: 'Banane crue, partie comestible.',
      ar: 'موز نيء، الجزء الصالح للأكل.',
    },
    servings: [grams(118, '1 medium (118 g)', '1 moyenne (118 g)', 'حبة متوسطة (118 غ)')],
  }),
  entry({
    key: 'apple',
    names: { en: 'Apple', fr: 'Pomme', ar: 'تفاح' },
    aliases: ['apple', 'apples', 'pomme', 'تفاح', 'تفاحة'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw apple with skin.',
      fr: 'Pomme crue avec la peau.',
      ar: 'تفاح نيء بالقشر.',
    },
    servings: [grams(182, '1 medium (182 g)', '1 moyenne (182 g)', 'حبة متوسطة (182 غ)')],
  }),
  entry({
    key: 'orange',
    names: { en: 'Orange', fr: 'Orange', ar: 'برتقال' },
    aliases: ['orange', 'oranges', 'برتقال', 'برتقالة'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw orange, all commercial varieties.',
      fr: 'Orange crue, variétés commerciales.',
      ar: 'برتقال نيء من الأصناف التجارية.',
    },
    servings: [grams(131, '1 fruit (131 g)', '1 fruit (131 g)', 'حبة (131 غ)')],
  }),
  entry({
    key: 'strawberry',
    names: { en: 'Strawberries', fr: 'Fraises', ar: 'فراولة' },
    aliases: ['strawberry', 'strawberries', 'fraise', 'fraises', 'فراولة'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw strawberries.',
      fr: 'Fraises crues.',
      ar: 'فراولة نيئة.',
    },
    servings: [grams(18, '1 large (18 g)', '1 grosse (18 g)', 'حبة كبيرة (18 غ)')],
  }),
  entry({
    key: 'blueberries',
    names: { en: 'Blueberries', fr: 'Myrtilles', ar: 'توت أزرق' },
    aliases: ['blueberry', 'blueberries', 'myrtille', 'myrtilles', 'توت', 'توت ازرق'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw blueberries.',
      fr: 'Myrtilles crues.',
      ar: 'توت أزرق نيء.',
    },
    servings: [grams(148, '1 cup (148 g)', '1 tasse (148 g)', 'كوب (148 غ)')],
  }),
  entry({
    key: 'dates',
    names: { en: 'Dates', fr: 'Dattes', ar: 'تمر' },
    aliases: ['dates', 'date', 'dattes', 'datte', 'deglet', 'تمر'],
    category: 'fruit',
    preparation: 'dried',
    description: {
      en: 'Deglet Noor dates.',
      fr: 'Dattes Deglet Noor.',
      ar: 'تمر دقلة نور.',
    },
  }),
  entry({
    key: 'lemon',
    names: { en: 'Lemon', fr: 'Citron', ar: 'ليمون' },
    aliases: ['lemon', 'lemons', 'citron', 'ليمون'],
    category: 'fruit',
    preparation: 'raw',
    description: {
      en: 'Raw lemon without peel.',
      fr: 'Citron cru sans le zeste.',
      ar: 'ليمون نيء بدون قشر.',
    },
    servings: [grams(58, '1 fruit (58 g)', '1 fruit (58 g)', 'حبة (58 غ)')],
  }),
  entry({
    key: 'tomato',
    names: { en: 'Tomato', fr: 'Tomate', ar: 'طماطم' },
    aliases: ['tomato', 'tomatoes', 'tomate', 'طماطم', 'طماطة'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw red ripe tomato.',
      fr: 'Tomate rouge mûre, crue.',
      ar: 'طماطم حمراء ناضجة نيئة.',
    },
    servings: [grams(123, '1 medium (123 g)', '1 moyenne (123 g)', 'حبة متوسطة (123 غ)')],
  }),
  entry({
    key: 'cucumber',
    names: { en: 'Cucumber', fr: 'Concombre', ar: 'خيار' },
    aliases: ['cucumber', 'concombre', 'خيار'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw cucumber with peel.',
      fr: 'Concombre cru avec la peau.',
      ar: 'خيار نيء بالقشر.',
    },
    servings: [grams(52, '1 cup slices (52 g)', '1 tasse en tranches (52 g)', 'كوب شرائح (52 غ)')],
  }),
  entry({
    key: 'spinach',
    names: { en: 'Spinach', fr: 'Épinards', ar: 'سبانخ' },
    aliases: ['spinach', 'epinards', 'épinards', 'سبانخ'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw spinach.',
      fr: 'Épinards crus.',
      ar: 'سبانخ نيئة.',
    },
    servings: [grams(30, '1 cup (30 g)', '1 tasse (30 g)', 'كوب (30 غ)')],
  }),
  entry({
    key: 'broccoli',
    names: { en: 'Broccoli', fr: 'Brocoli', ar: 'بروكلي' },
    aliases: ['broccoli', 'brocoli', 'بروكلي'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw broccoli.',
      fr: 'Brocoli cru.',
      ar: 'بروكلي نيء.',
    },
    servings: [grams(91, '1 cup chopped (91 g)', '1 tasse coupée (91 g)', 'كوب مفروم (91 غ)')],
  }),
  entry({
    key: 'carrot',
    names: { en: 'Carrot', fr: 'Carotte', ar: 'جزر' },
    aliases: ['carrot', 'carrots', 'carotte', 'carottes', 'جزر'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw carrot.',
      fr: 'Carotte crue.',
      ar: 'جزر نيء.',
    },
    servings: [grams(61, '1 medium (61 g)', '1 moyenne (61 g)', 'حبة متوسطة (61 غ)')],
  }),
  entry({
    key: 'bell-pepper',
    names: { en: 'Red bell pepper', fr: 'Poivron rouge', ar: 'فلفل أحمر' },
    aliases: ['pepper', 'bell pepper', 'poivron', 'فلفل', 'فلفل احمر'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw sweet red pepper.',
      fr: 'Poivron rouge doux, cru.',
      ar: 'فلفل أحمر حلو نيء.',
    },
    servings: [grams(74, '1 small (74 g)', '1 petit (74 g)', 'حبة صغيرة (74 غ)')],
  }),
  entry({
    key: 'lettuce',
    names: { en: 'Green leaf lettuce', fr: 'Laitue', ar: 'خس' },
    aliases: ['lettuce', 'laitue', 'salade', 'خس'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw green leaf lettuce.',
      fr: 'Laitue frisée crue.',
      ar: 'خس أخضر نيء.',
    },
    servings: [grams(36, '1 cup shredded (36 g)', '1 tasse émincée (36 g)', 'كوب مبشور (36 غ)')],
  }),
  entry({
    key: 'onion',
    names: { en: 'Onion', fr: 'Oignon', ar: 'بصل' },
    aliases: ['onion', 'onions', 'oignon', 'بصل'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw onion.',
      fr: 'Oignon cru.',
      ar: 'بصل نيء.',
    },
    servings: [grams(110, '1 medium (110 g)', '1 moyen (110 g)', 'حبة متوسطة (110 غ)')],
  }),
  entry({
    key: 'garlic',
    names: { en: 'Garlic', fr: 'Ail', ar: 'ثوم' },
    aliases: ['garlic', 'ail', 'ثوم'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Raw garlic.',
      fr: 'Ail cru.',
      ar: 'ثوم نيء.',
    },
    servings: [grams(3, '1 clove (3 g)', '1 gousse (3 g)', 'فص (3 غ)')],
  }),
  entry({
    key: 'parsley',
    names: { en: 'Parsley', fr: 'Persil', ar: 'بقدونس' },
    aliases: ['parsley', 'persil', 'بقدونس'],
    category: 'vegetable',
    preparation: 'raw',
    description: {
      en: 'Fresh parsley.',
      fr: 'Persil frais.',
      ar: 'بقدونس طازج.',
    },
    servings: [grams(3.8, '1 tablespoon (3.8 g)', '1 cuillère à soupe (3,8 g)', 'ملعقة كبيرة (3.8 غ)')],
  }),
  entry({
    key: 'potato-baked',
    names: { en: 'Baked potato', fr: 'Pomme de terre au four', ar: 'بطاطس مشوية' },
    aliases: ['potato', 'potatoes', 'pomme de terre', 'patate', 'بطاطس', 'بطاطا'],
    category: 'vegetable',
    preparation: 'baked',
    description: {
      en: 'Potato baked with flesh and skin, no salt added. This is not a raw potato.',
      fr: 'Pomme de terre cuite au four, chair et peau, sans sel. Ce n’est pas une pomme de terre crue.',
      ar: 'بطاطس مخبوزة بالقشر واللب، بدون ملح. هذه ليست بطاطس نيئة.',
    },
    servings: [grams(173, '1 medium (173 g)', '1 moyenne (173 g)', 'حبة متوسطة (173 غ)')],
  }),
  entry({
    key: 'sweet-potato',
    names: { en: 'Baked sweet potato', fr: 'Patate douce au four', ar: 'بطاطا حلوة مشوية' },
    aliases: ['sweet potato', 'patate douce', 'بطاطا حلوه', 'بطاطا حلوة'],
    category: 'vegetable',
    preparation: 'baked',
    description: {
      en: 'Sweet potato baked in skin, flesh only, no salt.',
      fr: 'Patate douce cuite en chemise, chair seule, sans sel.',
      ar: 'بطاطا حلوة مخبوزة بالقشر، اللب فقط، بدون ملح.',
    },
    servings: [grams(180, '1 large (180 g)', '1 grosse (180 g)', 'حبة كبيرة (180 غ)')],
  }),
  entry({
    key: 'egg-raw',
    names: { en: 'Egg, raw', fr: 'Œuf cru', ar: 'بيض نيء' },
    aliases: ['egg', 'eggs', 'oeuf', 'œuf', 'oeufs', 'بيض', 'بيضة'],
    category: 'egg',
    preparation: 'raw',
    tags: ['egg'],
    allergens: ['egg'],
    description: {
      en: 'Whole raw fresh egg. Not interchangeable with a hard-boiled egg.',
      fr: 'Œuf entier cru. À ne pas confondre avec un œuf dur.',
      ar: 'بيضة كاملة نيئة. لا تعادل بيضة مسلوقة.',
    },
    servings: [grams(50, '1 large (50 g)', '1 gros (50 g)', 'بيضة كبيرة (50 غ)')],
  }),
  entry({
    key: 'egg-boiled',
    names: { en: 'Hard-boiled egg', fr: 'Œuf dur', ar: 'بيض مسلوق' },
    aliases: ['boiled egg', 'hard boiled', 'oeuf dur', 'œuf dur', 'بيض مسلوق'],
    category: 'egg',
    preparation: 'hard-boiled',
    tags: ['egg'],
    allergens: ['egg'],
    description: {
      en: 'Whole hard-boiled egg. Cooking changes the weight and the nutrients versus a raw egg.',
      fr: 'Œuf entier cuit dur. La cuisson change le poids et les nutriments par rapport à l’œuf cru.',
      ar: 'بيضة كاملة مسلوقة. السلق يغيّر الوزن والقيم مقارنة بالبيض النيء.',
    },
    servings: [grams(50, '1 large (50 g)', '1 gros (50 g)', 'بيضة كبيرة (50 غ)')],
  }),
  entry({
    key: 'milk',
    names: { en: 'Whole milk', fr: 'Lait entier', ar: 'حليب كامل الدسم' },
    aliases: ['milk', 'whole milk', 'lait', 'حليب'],
    category: 'dairy',
    preparation: 'pasteurized',
    tags: ['dairy'],
    allergens: ['milk'],
    kind: 'whole',
    description: {
      en: 'Whole milk, 3.25% milkfat, with added vitamin D. USDA reports this per 100 g, not per 100 mL.',
      fr: 'Lait entier à 3,25 % de matière grasse, enrichi en vitamine D. L’USDA le donne pour 100 g, pas pour 100 mL.',
      ar: 'حليب كامل الدسم 3.25% مع فيتامين د مضاف. البيانات لكل 100 غ وليس لكل 100 مل.',
    },
    servings: [grams(244, '1 cup (244 g)', '1 tasse (244 g)', 'كوب (244 غ)')],
  }),
  entry({
    key: 'yogurt',
    names: { en: 'Plain whole-milk yogurt', fr: 'Yaourt nature entier', ar: 'زبادي كامل الدسم' },
    aliases: ['yogurt', 'yoghurt', 'yaourt', 'yogourt', 'ياغورت', 'زبادي', 'ياوورت'],
    category: 'dairy',
    preparation: 'cultured',
    tags: ['dairy'],
    allergens: ['milk'],
    description: {
      en: 'Plain yogurt made from whole milk, unsweetened.',
      fr: 'Yaourt nature au lait entier, non sucré.',
      ar: 'زبادي سادة من حليب كامل الدسم، غير محلى.',
    },
    servings: [grams(170, '1 container (170 g)', '1 pot (170 g)', 'علبة (170 غ)')],
  }),
  entry({
    key: 'chicken-raw',
    names: { en: 'Chicken breast, raw', fr: 'Blanc de poulet cru', ar: 'صدر دجاج نيء' },
    aliases: ['chicken raw', 'poulet cru', 'دجاج نيء'],
    category: 'poultry',
    preparation: 'raw',
    tags: ['meat'],
    description: {
      en: 'Raw skinless boneless chicken breast. Do not use these numbers for roasted chicken.',
      fr: 'Blanc de poulet cru, sans peau et sans os. Ces chiffres ne valent pas pour le poulet rôti.',
      ar: 'صدر دجاج نيء بدون جلد ولا عظم. لا تستخدم هذه الأرقام للدجاج المشوي.',
    },
  }),
  entry({
    key: 'chicken-roasted',
    names: { en: 'Roasted chicken breast', fr: 'Blanc de poulet rôti', ar: 'صدر دجاج مشوي' },
    aliases: ['chicken', 'poulet', 'دجاج', 'roasted chicken'],
    category: 'poultry',
    preparation: 'roasted',
    tags: ['meat'],
    description: {
      en: 'Roasted chicken breast, meat only. This is a cooked food, not raw chicken.',
      fr: 'Blanc de poulet rôti, viande seule. Aliment cuit, distinct du poulet cru.',
      ar: 'صدر دجاج مشوي، اللحم فقط. غذاء مطبوخ وليس دجاجا نيئا.',
    },
  }),
  entry({
    key: 'sardines',
    names: { en: 'Sardines', fr: 'Sardines', ar: 'سردين' },
    aliases: ['sardine', 'sardines', 'سردين'],
    category: 'fish',
    preparation: 'canned-in-oil-drained',
    tags: ['fish'],
    allergens: ['fish'],
    kind: 'packaged',
    description: {
      en: 'Atlantic sardines canned in oil, drained solids with bone. A label can differ from this generic entry.',
      fr: 'Sardines de l’Atlantique à l’huile, égouttées, avec les arêtes. Une marque peut différer de cette fiche générique.',
      ar: 'سردين أطلسي معلب بالزيت، مصفّى، مع العظم. منتج معيّن قد يختلف عن هذا الصنف العام.',
    },
    servings: [grams(92, '1 can, drained (92 g)', '1 boîte égouttée (92 g)', 'علبة مصفّاة (92 غ)')],
  }),
  entry({
    key: 'salmon-cooked',
    names: { en: 'Cooked salmon', fr: 'Saumon cuit', ar: 'سلمون مطبوخ' },
    aliases: ['salmon', 'saumon', 'سلمون'],
    category: 'fish',
    preparation: 'cooked-dry-heat',
    tags: ['fish'],
    allergens: ['fish'],
    description: {
      en: 'Farmed Atlantic salmon, cooked with dry heat.',
      fr: 'Saumon de l’Atlantique d’élevage, cuit à chaleur sèche.',
      ar: 'سلمون أطلسي مستزرع، مطبوخ بحرارة جافة.',
    },
    servings: [grams(178, '1 fillet (178 g)', '1 filet (178 g)', 'قطعة فيليه (178 غ)')],
  }),
  entry({
    key: 'tuna',
    names: { en: 'Canned tuna', fr: 'Thon en conserve', ar: 'تونة معلبة' },
    aliases: ['tuna', 'thon', 'تونة', 'تونا'],
    category: 'fish',
    preparation: 'canned-in-water-drained',
    tags: ['fish'],
    allergens: ['fish'],
    kind: 'packaged',
    description: {
      en: 'Light tuna canned in water, drained solids.',
      fr: 'Thon clair au naturel, égoutté.',
      ar: 'تونة خفيفة معلبة بالماء، بعد التصفية.',
    },
    servings: [grams(165, '1 can (165 g)', '1 boîte (165 g)', 'علبة (165 غ)')],
  }),
  entry({
    key: 'lentils-cooked',
    names: { en: 'Cooked lentils', fr: 'Lentilles cuites', ar: 'عدس مطبوخ' },
    aliases: ['lentil', 'lentils', 'lentille', 'lentilles', 'عدس'],
    category: 'legume',
    preparation: 'boiled',
    description: {
      en: 'Mature lentils boiled without salt. Not raw lentils.',
      fr: 'Lentilles mûres cuites à l’eau sans sel. Pas des lentilles crues.',
      ar: 'عدس ناضج مسلوق بدون ملح. ليس عدسا نيئا.',
    },
    servings: [grams(198, '1 cup (198 g)', '1 tasse (198 g)', 'كوب (198 غ)')],
  }),
  entry({
    key: 'chickpeas-cooked',
    names: { en: 'Cooked chickpeas', fr: 'Pois chiches cuits', ar: 'حمص مطبوخ' },
    aliases: ['chickpea', 'chickpeas', 'pois chiche', 'pois chiches', 'حمص'],
    category: 'legume',
    preparation: 'boiled',
    description: {
      en: 'Mature chickpeas boiled without salt. This is the bean, not hummus.',
      fr: 'Pois chiches mûrs cuits à l’eau sans sel. Il s’agit des graines, pas du houmous.',
      ar: 'حمص ناضج مسلوق بدون ملح. هذه الحبوب وليست حمصا بالطحينة.',
    },
    servings: [grams(164, '1 cup (164 g)', '1 tasse (164 g)', 'كوب (164 غ)')],
  }),
  entry({
    key: 'fava-cooked',
    names: { en: 'Cooked fava beans', fr: 'Fèves cuites', ar: 'فول مطبوخ' },
    aliases: ['fava', 'broad beans', 'feve', 'fève', 'fèves', 'فول', 'بيصارة'],
    category: 'legume',
    preparation: 'boiled',
    description: {
      en: 'Mature fava beans boiled without salt. A bowl of bissara is a separate recipe.',
      fr: 'Fèves mûres cuites à l’eau sans sel. Un bol de bissara est une recette à part.',
      ar: 'فول ناضج مسلوق بدون ملح. طبق البيصارة وصفة منفصلة.',
    },
    servings: [grams(170, '1 cup (170 g)', '1 tasse (170 g)', 'كوب (170 غ)')],
  }),
  entry({
    key: 'kidney-beans',
    names: { en: 'Cooked red kidney beans', fr: 'Haricots rouges cuits', ar: 'فاصوليا حمراء مطبوخة' },
    aliases: ['kidney beans', 'haricots rouges', 'فاصوليا حمراء', 'لوبيا'],
    category: 'legume',
    preparation: 'boiled',
    description: {
      en: 'Red kidney beans boiled without salt.',
      fr: 'Haricots rouges cuits à l’eau sans sel.',
      ar: 'فاصوليا حمراء مسلوقة بدون ملح.',
    },
    servings: [grams(177, '1 cup (177 g)', '1 tasse (177 g)', 'كوب (177 غ)')],
  }),
  entry({
    key: 'white-beans',
    names: { en: 'Cooked white beans', fr: 'Haricots blancs cuits', ar: 'فاصوليا بيضاء مطبوخة' },
    aliases: ['white beans', 'haricots blancs', 'فاصوليا بيضاء'],
    category: 'legume',
    preparation: 'boiled',
    description: {
      en: 'White beans boiled without salt.',
      fr: 'Haricots blancs cuits à l’eau sans sel.',
      ar: 'فاصوليا بيضاء مسلوقة بدون ملح.',
    },
    servings: [grams(179, '1 cup (179 g)', '1 tasse (179 g)', 'كوب (179 غ)')],
  }),
  entry({
    key: 'hummus',
    names: { en: 'Hummus', fr: 'Houmous', ar: 'حمص بالطحينة' },
    aliases: ['hummus', 'houmous', 'hommos', 'حمصية', 'حمص بالطحينة'],
    category: 'prepared',
    preparation: 'commercial-composite',
    tags: ['sesame'],
    allergens: ['sesame'],
    kind: 'prepared',
    description: {
      en: 'Commercial hummus composite. It usually contains tahini (sesame). A specific brand label can differ, and this is not a lab test of your tub.',
      fr: 'Houmous du commerce. Il contient en général du tahini (sésame). L’étiquette d’une marque peut différer.',
      ar: 'حمص تجاري جاهز. يحتوي عادة على الطحينة (سمسم). ملصق علامة معينة قد يختلف.',
    },
    servings: [grams(30, '2 tablespoons (30 g)', '2 cuillères à soupe (30 g)', 'ملعقتان كبيرتان (30 غ)')],
  }),
  entry({
    key: 'oats',
    names: { en: 'Dry oats', fr: 'Flocons d’avoine secs', ar: 'شوفان جاف' },
    aliases: ['oats', 'oatmeal', 'avoine', 'flocons', 'شوفان'],
    category: 'grain',
    preparation: 'dry',
    description: {
      en: 'Regular or quick oats, dry and not fortified. Cooked porridge weighs more because of water.',
      fr: 'Flocons d’avoine secs, non enrichis. La bouillie cuite pèse plus à cause de l’eau.',
      ar: 'شوفان عادي أو سريع، جاف وغير مدعّم. الشوفان المطبوخ أثقل بسبب الماء.',
    },
  }),
  entry({
    key: 'rice-cooked',
    names: { en: 'Cooked white rice', fr: 'Riz blanc cuit', ar: 'أرز أبيض مطبوخ' },
    aliases: ['rice', 'riz', 'أرز'],
    category: 'grain',
    preparation: 'cooked',
    description: {
      en: 'Long-grain white rice, unenriched, cooked without salt. Not raw rice.',
      fr: 'Riz blanc à grain long, non enrichi, cuit sans sel. Pas du riz cru.',
      ar: 'أرز أبيض طويل الحبة، غير مدعّم، مطبوخ بدون ملح. ليس أرزا نيئا.',
    },
    servings: [grams(158, '1 cup (158 g)', '1 tasse (158 g)', 'كوب (158 غ)')],
  }),
  entry({
    key: 'bread-whole-wheat',
    names: { en: 'Whole-wheat bread', fr: 'Pain complet', ar: 'خبز القمح الكامل' },
    aliases: ['bread', 'pain', 'خبز', 'whole wheat'],
    category: 'grain',
    preparation: 'baked',
    tags: ['gluten'],
    allergens: ['gluten'],
    kind: 'packaged',
    description: {
      en: 'Commercially prepared whole-wheat bread.',
      fr: 'Pain complet du commerce.',
      ar: 'خبز قمح كامل تجاري.',
    },
    servings: [grams(32, '1 slice (32 g)', '1 tranche (32 g)', 'شريحة (32 غ)')],
  }),
  entry({
    key: 'flour',
    names: { en: 'White flour', fr: 'Farine blanche', ar: 'دقيق أبيض' },
    aliases: ['flour', 'farine', 'دقيق'],
    category: 'grain',
    preparation: 'dry',
    tags: ['gluten'],
    allergens: ['gluten'],
    description: {
      en: 'Unenriched all-purpose white wheat flour.',
      fr: 'Farine de blé blanche tout usage, non enrichie.',
      ar: 'دقيق قمح أبيض متعدد الاستعمالات، غير مدعّم.',
    },
    servings: [grams(125, '1 cup (125 g)', '1 tasse (125 g)', 'كوب (125 غ)')],
  }),
  entry({
    key: 'semolina',
    names: { en: 'Semolina', fr: 'Semoule', ar: 'سميد' },
    aliases: ['semolina', 'semoule', 'سميد'],
    category: 'grain',
    preparation: 'dry',
    tags: ['gluten'],
    allergens: ['gluten'],
    description: {
      en: 'Unenriched semolina.',
      fr: 'Semoule non enrichie.',
      ar: 'سميد غير مدعّم.',
    },
    servings: [grams(167, '1 cup (167 g)', '1 tasse (167 g)', 'كوب (167 غ)')],
  }),
  entry({
    key: 'couscous-cooked',
    names: { en: 'Cooked couscous', fr: 'Couscous cuit', ar: 'كسكس مطبوخ' },
    aliases: ['couscous', 'كسكس', 'كسكسي'],
    category: 'grain',
    preparation: 'cooked',
    tags: ['gluten'],
    allergens: ['gluten'],
    description: {
      en: 'Cooked couscous. This entry is the grain, not a full couscous stew.',
      fr: 'Couscous cuit. Cette fiche décrit la graine, pas un plat complet.',
      ar: 'كسكس مطبوخ. هذا الصنف للحبوب وليس لطبق كسكس كامل.',
    },
  }),
  entry({
    key: 'olive-oil',
    names: { en: 'Olive oil', fr: 'Huile d’olive', ar: 'زيت الزيتون' },
    aliases: ['olive oil', 'huile d olive', 'huile dolive', 'زيت الزيتون', 'زيت'],
    category: 'fat',
    preparation: 'oil',
    description: {
      en: 'Olive oil. USDA reports it per 100 g. One tablespoon in this dataset is 13.5 g.',
      fr: 'Huile d’olive. L’USDA la donne pour 100 g. Une cuillère à soupe ici pèse 13,5 g.',
      ar: 'زيت الزيتون. البيانات لكل 100 غ. الملعقة الكبيرة في هذه البيانات 13.5 غ.',
    },
    servings: [grams(13.5, '1 tablespoon (13.5 g)', '1 cuillère à soupe (13,5 g)', 'ملعقة كبيرة (13.5 غ)')],
  }),
  entry({
    key: 'canola-oil',
    names: { en: 'Canola oil', fr: 'Huile de colza', ar: 'زيت الكانولا' },
    aliases: ['canola', 'rapeseed', 'colza', 'كانولا'],
    category: 'fat',
    preparation: 'oil',
    description: {
      en: 'Canola oil. USDA reports alpha-linolenic acid (ALA) separately for this oil.',
      fr: 'Huile de colza. L’USDA indique l’acide alpha-linolénique (ALA) pour cette huile.',
      ar: 'زيت الكانولا. تذكر البيانات حمض ألفا-لينولينيك (ALA) لهذا الزيت.',
    },
    servings: [grams(14, '1 tablespoon (14 g)', '1 cuillère à soupe (14 g)', 'ملعقة كبيرة (14 غ)')],
  }),
  entry({
    key: 'almonds',
    names: { en: 'Almonds', fr: 'Amandes', ar: 'لوز' },
    aliases: ['almond', 'almonds', 'amande', 'amandes', 'لوز'],
    category: 'nut',
    preparation: 'dry',
    tags: ['tree-nut'],
    allergens: ['tree-nut'],
    description: {
      en: 'Almonds.',
      fr: 'Amandes.',
      ar: 'لوز.',
    },
    servings: [grams(28.35, '1 ounce (28 g)', '1 once (28 g)', 'أونصة (28 غ)')],
  }),
  entry({
    key: 'walnut',
    names: { en: 'Walnuts', fr: 'Noix', ar: 'جوز' },
    aliases: ['walnut', 'walnuts', 'noix', 'جوز'],
    category: 'nut',
    preparation: 'dry',
    tags: ['tree-nut'],
    allergens: ['tree-nut'],
    description: {
      en: 'English walnuts. USDA reports 9.08 g of PUFA 18:3 per 100 g for this food, without the specific ALA nutrient name, so that fat is not labeled ALA here.',
      fr: 'Noix. L’USDA indique 9,08 g d’AGPI 18:3 pour 100 g, sans le nom précis ALA. Cette graisse n’est donc pas étiquetée ALA ici.',
      ar: 'جوز. تذكر البيانات 9.08 غ من الدهون المتعددة غير المشبعة 18:3 لكل 100 غ دون تسميتها ALA، لذلك لا نسمّيها ALA هنا.',
    },
    servings: [grams(28.35, '1 ounce, about 14 halves (28 g)', '1 once, environ 14 cerneaux (28 g)', 'أونصة، نحو 14 نصف حبة (28 غ)')],
  }),
  entry({
    key: 'peanut-butter',
    names: { en: 'Peanut butter', fr: 'Beurre de cacahuète', ar: 'زبدة الفول السوداني' },
    aliases: ['peanut butter', 'peanutbutter', 'beurre de cacahuete', 'cacahuete', 'زبدة الفول السوداني', 'فول سوداني'],
    category: 'nut',
    preparation: 'ground',
    tags: ['peanut'],
    allergens: ['peanut'],
    kind: 'packaged',
    description: {
      en: 'Smooth peanut butter without salt. Peanut is a legume, tracked here as a peanut allergen.',
      fr: 'Beurre de cacahuète crémeux sans sel. La cacahuète est une légumineuse, signalée ici comme allergène.',
      ar: 'زبدة فول سوداني ناعمة بدون ملح. الفول السوداني بقول، ويُذكر هنا كمسبّب للحساسية.',
    },
    servings: [grams(32, '1 tablespoon (32 g)', '1 cuillère à soupe (32 g)', 'ملعقة كبيرة (32 غ)')],
  }),
  entry({
    key: 'chia',
    names: { en: 'Chia seeds', fr: 'Graines de chia', ar: 'بذور الشيا' },
    aliases: ['chia', 'شيا'],
    category: 'seed',
    preparation: 'dried',
    description: {
      en: 'Dried chia seeds. USDA reports ALA for this food.',
      fr: 'Graines de chia séchées. L’USDA indique l’ALA pour cet aliment.',
      ar: 'بذور شيا مجففة. تذكر البيانات حمض ALA لهذا الغذاء.',
    },
    servings: [grams(28.35, '1 ounce (28 g)', '1 once (28 g)', 'أونصة (28 غ)')],
  }),
  entry({
    key: 'flaxseed',
    names: { en: 'Flaxseed', fr: 'Graines de lin', ar: 'بذور الكتان' },
    aliases: ['flax', 'flaxseed', 'lin', 'كتان'],
    category: 'seed',
    preparation: 'dried',
    description: {
      en: 'Flaxseed. USDA reports 22.813 g of PUFA 18:3 per 100 g without the specific ALA name, so it is not labeled ALA here.',
      fr: 'Graines de lin. L’USDA indique 22,813 g d’AGPI 18:3 pour 100 g sans le nom ALA, donc ce n’est pas étiqueté ALA ici.',
      ar: 'بذور الكتان. تذكر البيانات 22.813 غ من دهون 18:3 لكل 100 غ دون اسم ALA، لذلك لا نسمّيها ALA هنا.',
    },
  }),
  entry({
    key: 'salt',
    names: { en: 'Table salt', fr: 'Sel de table', ar: 'ملح الطعام' },
    aliases: ['salt', 'sel', 'ملح'],
    category: 'seasoning',
    preparation: 'dry',
    description: {
      en: 'Table salt. Energy is a reported zero. Sodium is very high, so recipes use a small gram amount.',
      fr: 'Sel de table. L’énergie est un zéro déclaré. Le sodium est très élevé : les recettes n’en utilisent qu’une petite quantité.',
      ar: 'ملح الطعام. الطاقة صفر مبلغ عنه. الصوديوم مرتفع جدا، لذلك تستخدم الوصفات كمية صغيرة بالغرام.',
    },
    servings: [grams(0.4, '1 dash (0.4 g)', '1 pincée (0,4 g)', 'رشة (0.4 غ)')],
  }),
]

export const FOODS_BY_ID = Object.fromEntries(FOODS.map((food) => [food.id, food]))

export function getFood(id) {
  return FOODS_BY_ID[id] || null
}
