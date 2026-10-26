/**
 * Home-style recipes. Nutrition is computed from curated USDA foods and gram amounts.
 * Cooking gain or loss is not applied, so totals are estimates from the raw ingredient weights.
 * Water used for dough or soup is not given a nutrient line: plain water is not in the catalog
 * and is not treated as a source of calories.
 */
import { FOODS_BY_ID } from './foods.js'

function step(en, fr, ar) {
  return { en, fr, ar }
}

function ingredient(foodKey, amount, household) {
  return {
    foodId: `curated:${foodKey}`,
    amount,
    unit: 'g',
    household: household || null,
  }
}

const RECIPE_DRAFTS = [
  {
    id: 'oatmeal-banana',
    meal: 'breakfast',
    servings: 1,
    minutes: 10,
    difficulty: 'easy',
    region: null,
    aliases: ['oatmeal', 'porridge', 'avoine', 'شوفان بالموز'],
    title: {
      en: 'Oatmeal with banana',
      fr: 'Porridge d’avoine et banane',
      ar: 'شوفان بالموز',
    },
    summary: {
      en: 'Dry oats stirred with milk and a medium banana. The oats are weighed dry, so the cooked bowl is an estimate.',
      fr: 'Des flocons secs mélangés au lait et à une banane moyenne. Les flocons sont pesés secs : le bol cuit reste une estimation.',
      ar: 'شوفان جاف مع الحليب وموزة متوسطة. الشوفان موزون وهو جاف، لذلك الطبق المطبوخ تقدير.',
    },
    steps: [
      step('Add the dry oats and milk to a small pot.', 'Mettez les flocons secs et le lait dans une petite casserole.', 'ضع الشوفان الجاف والحليب في قدر صغير.'),
      step('Warm gently for about 5 minutes, stirring, until thick.', 'Chauffez doucement environ 5 minutes en remuant, jusqu’à épaississement.', 'سخّن بهدوء نحو 5 دقائق مع التحريك حتى يتكاثف.'),
      step('Slice the banana on top and serve.', 'Coupez la banane dessus et servez.', 'قطّع الموز فوقه وقدّمه.'),
    ],
    ingredients: [
      ingredient('oats', 40),
      ingredient('banana', 118, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('milk', 122, { en: '1/2 cup', fr: '1/2 tasse', ar: 'نصف كوب' }),
    ],
  },
  {
    id: 'eggs-toast',
    meal: 'breakfast',
    servings: 1,
    servingsNote: true,
    minutes: 15,
    difficulty: 'easy',
    aliases: ['eggs', 'toast', 'oeufs', 'pain', 'بيض وتوست'],
    title: { en: 'Eggs and whole-grain toast', fr: 'Œufs et pain complet', ar: 'بيض وخبز القمح الكامل' },
    summary: {
      en: 'Two large hard-boiled eggs with two slices of whole-wheat bread.',
      fr: 'Deux gros œufs durs et deux tranches de pain complet.',
      ar: 'بيضتان كبيرتان مسلوقتان مع شريحتين من خبز القمح الكامل.',
    },
    steps: [
      step('Cover the eggs with water, boil, then simmer about 10 minutes.', 'Couvrez les œufs d’eau, portez à ébullition, puis laissez frémir environ 10 minutes.', 'غطّ البيض بالماء واتركه يغلي ثم على نار هادئة نحو 10 دقائق.'),
      step('Cool them in cold water and peel.', 'Refroidissez-les dans l’eau froide et écalez-les.', 'برّدها في ماء بارد ثم قشّرها.'),
      step('Toast the bread and serve the eggs beside it.', 'Faites griller le pain et servez les œufs à côté.', 'حمّص الخبز وقدّم البيض بجانبه.'),
    ],
    ingredients: [
      ingredient('egg-boiled', 100, { en: '2 large eggs', fr: '2 gros œufs', ar: 'بيضتان كبيرتان' }),
      ingredient('bread-whole-wheat', 64, { en: '2 slices', fr: '2 tranches', ar: 'شريحتان' }),
    ],
  },
  {
    id: 'yogurt-fruit-oats',
    meal: 'breakfast',
    servings: 1,
    minutes: 5,
    difficulty: 'easy',
    aliases: ['yogurt bowl', 'yaourt', 'زبادي'],
    title: { en: 'Yogurt with fruit and oats', fr: 'Yaourt, fruit et avoine', ar: 'زبادي بالفاكهة والشوفان' },
    summary: {
      en: 'A container of plain yogurt with strawberries and a spoon of dry oats.',
      fr: 'Un pot de yaourt nature, des fraises et une petite quantité de flocons secs.',
      ar: 'علبة زبادي سادة مع فراولة وقليل من الشوفان الجاف.',
    },
    steps: [
      step('Spoon the yogurt into a bowl.', 'Versez le yaourt dans un bol.', 'ضع الزبادي في وعاء.'),
      step('Add the oats and sliced strawberries.', 'Ajoutez les flocons et les fraises coupées.', 'أضف الشوفان والفراولة المقطعة.'),
      step('Eat it cold. No cooking is required.', 'Servez froid. Aucune cuisson n’est nécessaire.', 'يؤكل باردا بلا طهي.'),
    ],
    ingredients: [
      ingredient('yogurt', 170, { en: '1 container', fr: '1 pot', ar: 'علبة واحدة' }),
      ingredient('strawberry', 72, { en: '4 large berries', fr: '4 grosses fraises', ar: '4 حبات كبيرة' }),
      ingredient('oats', 30),
    ],
  },
  {
    id: 'tomato-omelet',
    meal: 'breakfast',
    servings: 1,
    minutes: 15,
    difficulty: 'easy',
    region: 'morocco',
    aliases: ['omelet', 'omelette', 'tomato', 'عجة', 'عجة الطماطم'],
    title: {
      en: 'Moroccan-style tomato omelet',
      fr: 'Omelette à la tomate',
      ar: 'عجة الطماطم',
    },
    summary: {
      en: 'Eggs cooked with tomato, onion, parsley, and olive oil. Spices such as cumin are not included in the numbers.',
      fr: 'Des œufs cuits avec tomate, oignon, persil et huile d’olive. Des épices comme le cumin ne sont pas comptées.',
      ar: 'بيض مطهو مع الطماطم والبصل والبقدونس وزيت الزيتون. توابل مثل الكمون غير محسوبة في الأرقام.',
    },
    steps: [
      step('Warm the olive oil and soften the onion for 3 minutes.', 'Chauffez l’huile et faites ramollir l’oignon 3 minutes.', 'سخّن زيت الزيتون وليّن البصل لمدة 3 دقائق.'),
      step('Add tomato and parsley and cook until the tomato softens.', 'Ajoutez la tomate et le persil jusqu’à ce que la tomate ramollisse.', 'أضف الطماطم والبقدونس حتى تلين الطماطم.'),
      step('Pour in the beaten eggs and a dash of salt. Fold when just set.', 'Versez les œufs battus et une pincée de sel. Pliez dès que c’est pris.', 'أضف البيض المخفوق ورشة ملح. اطوها عندما تتماسك.'),
    ],
    ingredients: [
      ingredient('egg-raw', 100, { en: '2 large eggs', fr: '2 gros œufs', ar: 'بيضتان كبيرتان' }),
      ingredient('tomato', 123, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('onion', 40),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('parsley', 3.8, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('salt', 0.4, { en: '1 dash', fr: '1 pincée', ar: 'رشة' }),
    ],
  },
  {
    id: 'fruit-smoothie',
    meal: 'breakfast',
    servings: 1,
    minutes: 5,
    difficulty: 'easy',
    aliases: ['smoothie', 'milkshake', 'حليب', 'سموذي'],
    title: { en: 'Milk and fruit smoothie', fr: 'Smoothie lait et fruits', ar: 'سموذي الحليب والفاكهة' },
    summary: {
      en: 'Whole milk blended with banana and strawberries. Blending does not change the ingredient weights used here.',
      fr: 'Du lait entier mixé avec banane et fraises. Le mixage ne change pas les poids utilisés ici.',
      ar: 'حليب كامل الدسم مخلوط مع الموز والفراولة. الخلط لا يغيّر الأوزان المستخدمة هنا.',
    },
    steps: [
      step('Add milk, banana, and strawberries to a blender.', 'Mettez le lait, la banane et les fraises dans un mixeur.', 'ضع الحليب والموز والفراولة في الخلاط.'),
      step('Blend until smooth.', 'Mixez jusqu’à obtenir une texture lisse.', 'اخلط حتى يصبح ناعما.'),
      step('Drink it the same day.', 'Buvez-le le jour même.', 'اشربه في اليوم نفسه.'),
    ],
    ingredients: [
      ingredient('milk', 244, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('banana', 118, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('strawberry', 54, { en: '3 large berries', fr: '3 grosses fraises', ar: '3 حبات كبيرة' }),
    ],
  },
  {
    id: 'baghrir',
    meal: 'breakfast',
    servings: 4,
    minutes: 30,
    difficulty: 'medium',
    region: 'morocco',
    aliases: ['baghrir', 'بغرير', 'mille trous'],
    title: { en: 'Baghrir-style semolina pancakes', fr: 'Baghrir à la semoule', ar: 'بغرير' },
    summary: {
      en: 'A home-style batch of four, made with semolina, a little flour, one egg, and a dash of salt. Water in the batter is not counted. This is an estimate, not a single official recipe.',
      fr: 'Four pour quatre personnes, avec semoule, un peu de farine, un œuf et une pincée de sel. L’eau de la pâte n’est pas comptée. C’est une estimation, pas une recette officielle unique.',
      ar: 'كمية منزلية لأربعة، من السميد وقليل من الدقيق وبيضة ورشة ملح. ماء العجين غير محسوب. هذا تقدير وليس وصفة رسمية واحدة.',
    },
    steps: [
      step('Whisk semolina, flour, egg, salt, and enough water to make a thin batter. Let it rest 15 minutes if you can.', 'Fouettez semoule, farine, œuf, sel et assez d’eau pour une pâte fluide. Laissez reposer 15 minutes si possible.', 'اخفق السميد والدقيق والبيض والملح مع ماء يكفي لعجينة سائلة. اتركها 15 دقيقة إن أمكن.'),
      step('Cook small rounds in a lightly oiled nonstick pan on medium-low heat until the top looks set.', 'Cuisez de petits cercles dans une poêle antiadhésive légèrement huilée, à feu doux, jusqu’à ce que le dessus prenne.', 'اطبخ أقراصا صغيرة في مقلاة غير لاصقة مدهونة قليلا على نار هادئة حتى يتماسك الوجه.'),
      step('Serve warm. A topping such as butter or honey is not included in the numbers.', 'Servez tiède. Un nappage comme le beurre ou le miel n’est pas inclus dans les chiffres.', 'قدّمه دافئا. إضافات مثل الزبدة أو العسل غير داخلة في الأرقام.'),
    ],
    ingredients: [
      ingredient('semolina', 150),
      ingredient('flour', 50),
      ingredient('egg-raw', 50, { en: '1 large egg', fr: '1 gros œuf', ar: 'بيضة كبيرة' }),
      ingredient('salt', 0.4, { en: '1 dash', fr: '1 pincée', ar: 'رشة' }),
    ],
  },
  {
    id: 'msemen',
    meal: 'breakfast',
    servings: 4,
    minutes: 35,
    difficulty: 'medium',
    region: 'morocco',
    aliases: ['msemen', 'msemmen', 'مسمن', 'rghaif'],
    title: { en: 'Olive-oil msemen', fr: 'Msemen à l’huile d’olive', ar: 'مسمن بزيت الزيتون' },
    summary: {
      en: 'Folded flatbreads for four, using white flour, olive oil, and salt. Water in the dough is not counted. Other fats would change the numbers.',
      fr: 'Galettes pliées pour quatre, avec farine blanche, huile d’olive et sel. L’eau de la pâte n’est pas comptée. Une autre matière grasse changerait les chiffres.',
      ar: 'خبز مسطح مطوي لأربعة، من الدقيق الأبيض وزيت الزيتون والملح. ماء العجين غير محسوب. دهون أخرى ستغيّر الأرقام.',
    },
    steps: [
      step('Mix flour, salt, and water into a soft dough. Rest it 10 minutes.', 'Mélangez farine, sel et eau en une pâte souple. Laissez reposer 10 minutes.', 'اخلط الدقيق والملح والماء حتى تصبح عجينة طرية. اتركها 10 دقائق.'),
      step('Divide into 4 pieces, spread each with olive oil, fold into a square.', 'Divisez en 4 pâtons, étalez l’huile, pliez en carré.', 'قسّمها إلى 4 قطع، ادهنها بالزيت، واطوِها مربعات.'),
      step('Cook both sides in a pan until spotted and cooked through.', 'Cuisez des deux côtés jusqu’à ce que ce soit cuit et tacheté.', 'اطبخ الوجهين في المقلاة حتى ينضج وتظهر البقع.'),
    ],
    ingredients: [
      ingredient('flour', 250, { en: '2 cups', fr: '2 tasses', ar: 'كوبان' }),
      ingredient('olive-oil', 40),
      ingredient('salt', 1.2),
    ],
  },
  {
    id: 'chicken-rice-veg',
    meal: 'lunch',
    servings: 1,
    minutes: 30,
    difficulty: 'easy',
    aliases: ['chicken rice', 'poulet riz', 'دجاج وأرز'],
    title: {
      en: 'Chicken, rice, and broccoli',
      fr: 'Poulet, riz et brocoli',
      ar: 'دجاج وأرز وبروكلي',
    },
    summary: {
      en: 'Roasted chicken breast with a cup of cooked rice and chopped broccoli. Uses cooked chicken and cooked rice records, plus a little olive oil.',
      fr: 'Blanc de poulet rôti, une tasse de riz cuit et du brocoli, avec un peu d’huile d’olive.',
      ar: 'صدر دجاج مشوي مع كوب أرز مطبوخ وبروكلي وقليل من زيت الزيتون.',
    },
    steps: [
      step('Warm the roasted chicken and cooked rice.', 'Réchauffez le poulet rôti et le riz cuit.', 'سخّن الدجاج المشوي والأرز المطبوخ.'),
      step('Steam or sauté the broccoli with the olive oil until tender.', 'Faites cuire le brocoli à la vapeur ou à l’huile jusqu’à ce qu’il soit tendre.', 'اطبخ البروكلي بالبخار أو بالزيت حتى يلين.'),
      step('Plate them together.', 'Dressez le tout dans une assiette.', 'ضع الجميع في طبق.'),
    ],
    ingredients: [
      ingredient('chicken-roasted', 120),
      ingredient('rice-cooked', 158, { en: '1 cup cooked', fr: '1 tasse cuite', ar: 'كوب مطبوخ' }),
      ingredient('broccoli', 91, { en: '1 cup chopped', fr: '1 tasse', ar: 'كوب مفروم' }),
      ingredient('olive-oil', 6.75, { en: '1/2 tablespoon', fr: '1/2 cuillère à soupe', ar: 'نصف ملعقة كبيرة' }),
    ],
  },
  {
    id: 'sardine-salad',
    meal: 'lunch',
    servings: 1,
    minutes: 15,
    difficulty: 'easy',
    aliases: ['sardine salad', 'salade de sardines', 'سلطة السردين'],
    title: { en: 'Sardine salad bowl', fr: 'Salade de sardines', ar: 'سلطة السردين' },
    summary: {
      en: 'One drained can of sardines with cucumber, tomato, onion, lemon, and olive oil.',
      fr: 'Une boîte de sardines égouttées, concombre, tomate, oignon, citron et huile d’olive.',
      ar: 'علبة سردين مصفّاة مع الخيار والطماطم والبصل والليمون وزيت الزيتون.',
    },
    steps: [
      step('Chop the cucumber, tomato, and onion.', 'Coupez le concombre, la tomate et l’oignon.', 'قطّع الخيار والطماطم والبصل.'),
      step('Add the drained sardines, lemon, and olive oil.', 'Ajoutez les sardines égouttées, le citron et l’huile.', 'أضف السردين المصفّى والليمون والزيت.'),
      step('Toss and eat. Bones in this USDA sardine entry are edible as recorded.', 'Mélangez et servez. Les arêtes de cette fiche USDA sont celles du produit égoutté avec os.', 'اخلط وقدّم. عظام هذا الصنف هي الموجودة في بيانات السردين المصفّى مع العظم.'),
    ],
    ingredients: [
      ingredient('sardines', 92, { en: '1 drained can', fr: '1 boîte égouttée', ar: 'علبة مصفّاة' }),
      ingredient('cucumber', 104, { en: '2 cups slices', fr: '2 tasses en tranches', ar: 'كوبان من الشرائح' }),
      ingredient('tomato', 123, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('onion', 30),
      ingredient('lemon', 29, { en: '1/2 fruit', fr: '1/2 fruit', ar: 'نصف حبة' }),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
    ],
  },
  {
    id: 'chickpea-salad',
    meal: 'lunch',
    servings: 2,
    minutes: 15,
    difficulty: 'easy',
    aliases: ['chickpea salad', 'salade de pois chiches', 'سلطة الحمص'],
    title: { en: 'Chickpea vegetable salad', fr: 'Salade de pois chiches', ar: 'سلطة الحمص والخضار' },
    summary: {
      en: 'Two servings of cooked chickpeas with tomato, cucumber, pepper, onion, parsley, lemon, and olive oil.',
      fr: 'Deux portions de pois chiches cuits avec tomate, concombre, poivron, oignon, persil, citron et huile d’olive.',
      ar: 'حصتان من الحمص المطبوخ مع الطماطم والخيار والفلفل والبصل والبقدونس والليمون وزيت الزيتون.',
    },
    steps: [
      step('Rinse the cooked chickpeas if they were salted in the pot; this record is boiled without salt.', 'Rincez les pois chiches s’ils ont été salés. Cette fiche est cuite sans sel.', 'اشطف الحمص إن كان مملحا. هذا الصنف مسلوق بدون ملح.'),
      step('Chop the vegetables and parsley.', 'Coupez les légumes et le persil.', 'قطّع الخضار والبقدونس.'),
      step('Mix with lemon and olive oil. Divide into two bowls.', 'Mélangez avec le citron et l’huile. Répartissez dans deux bols.', 'اخلط مع الليمون والزيت. قسّمها في وعاءين.'),
    ],
    ingredients: [
      ingredient('chickpeas-cooked', 164, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('tomato', 123, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('cucumber', 78),
      ingredient('bell-pepper', 74, { en: '1 small', fr: '1 petit', ar: 'حبة صغيرة' }),
      ingredient('onion', 40),
      ingredient('parsley', 7.6, { en: '2 tablespoons', fr: '2 cuillères à soupe', ar: 'ملعقتان كبيرتان' }),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('lemon', 29, { en: '1/2 fruit', fr: '1/2 fruit', ar: 'نصف حبة' }),
    ],
  },
  {
    id: 'tuna-sandwich',
    meal: 'lunch',
    servings: 1,
    minutes: 10,
    difficulty: 'easy',
    aliases: ['tuna sandwich', 'sandwich thon', 'ساندويتش التونة'],
    title: { en: 'Tuna sandwich', fr: 'Sandwich au thon', ar: 'ساندويتش التونة' },
    summary: {
      en: 'Half of a drained can of light tuna in water, with whole-wheat bread, tomato, and lettuce.',
      fr: 'La moitié d’une boîte de thon au naturel égoutté, pain complet, tomate et laitue.',
      ar: 'نصف علبة تونة مصفّاة بالماء، مع خبز القمح الكامل والطماطم والخس.',
    },
    steps: [
      step('Drain the tuna and use half a can for this sandwich.', 'Égouttez le thon et utilisez une demi-boîte.', 'صفّ التونة واستخدم نصف العلبة.'),
      step('Layer it with tomato and lettuce between the bread.', 'Disposez-le avec la tomate et la laitue entre le pain.', 'ضعها مع الطماطم والخس بين الخبز.'),
      step('Mayonnaise is not included.', 'La mayonnaise n’est pas incluse.', 'المايونيز غير داخل في الحساب.'),
    ],
    ingredients: [
      ingredient('tuna', 82.5, { en: '1/2 can', fr: '1/2 boîte', ar: 'نصف علبة' }),
      ingredient('bread-whole-wheat', 64, { en: '2 slices', fr: '2 tranches', ar: 'شريحتان' }),
      ingredient('tomato', 62),
      ingredient('lettuce', 36, { en: '1 cup shredded', fr: '1 tasse', ar: 'كوب مبشور' }),
    ],
  },
  {
    id: 'bissara',
    meal: 'lunch',
    servings: 2,
    minutes: 25,
    difficulty: 'easy',
    region: 'morocco',
    aliases: ['bissara', 'bessara', 'بيصارة', 'بصارة'],
    title: { en: 'Bissara-style fava soup', fr: 'Soupe de fèves type bissara', ar: 'بيصارة' },
    summary: {
      en: 'A simple two-serving soup of cooked fava beans, olive oil, garlic, onion, parsley, lemon, and salt. Cumin and chili are not in the numbers. Cooking water is not counted.',
      fr: 'Soupe simple pour deux, à base de fèves cuites, huile d’olive, ail, oignon, persil, citron et sel. Cumin et piment ne sont pas comptés. L’eau de cuisson non plus.',
      ar: 'حساء بسيط لشخصين من الفول المطبوخ وزيت الزيتون والثوم والبصل والبقدونس والليمون والملح. الكمون والفلفل غير محسوبَين، وكذلك ماء الطبخ.',
    },
    steps: [
      step('Warm the olive oil with onion and garlic.', 'Chauffez l’huile avec l’oignon et l’ail.', 'سخّن الزيت مع البصل والثوم.'),
      step('Add the cooked fava beans and a little water. Simmer and mash until creamy.', 'Ajoutez les fèves cuites et un peu d’eau. Laissez mijoter et écrasez jusqu’à obtenir une crème.', 'أضف الفول المطبوخ وقليلا من الماء. اتركه ينضج واهرسه حتى يصبح كريميا.'),
      step('Stir in parsley, lemon, and salt. Serve two bowls.', 'Ajoutez persil, citron et sel. Servez deux bols.', 'أضف البقدونس والليمون والملح. قدّم وعاءين.'),
    ],
    ingredients: [
      ingredient('fava-cooked', 340, { en: '2 cups', fr: '2 tasses', ar: 'كوبان' }),
      ingredient('olive-oil', 27, { en: '2 tablespoons', fr: '2 cuillères à soupe', ar: 'ملعقتان كبيرتان' }),
      ingredient('garlic', 9, { en: '3 cloves', fr: '3 gousses', ar: '3 فصوص' }),
      ingredient('onion', 70, { en: '1 small', fr: '1 petit', ar: 'حبة صغيرة' }),
      ingredient('parsley', 7.6, { en: '2 tablespoons', fr: '2 cuillères à soupe', ar: 'ملعقتان كبيرتان' }),
      ingredient('lemon', 29, { en: '1/2 fruit', fr: '1/2 fruit', ar: 'نصف حبة' }),
      ingredient('salt', 0.8),
    ],
  },
  {
    id: 'lentil-soup',
    meal: 'dinner',
    servings: 2,
    minutes: 30,
    difficulty: 'easy',
    aliases: ['lentil soup', 'soupe de lentilles', 'شوربة العدس'],
    title: { en: 'Lentil soup', fr: 'Soupe de lentilles', ar: 'شوربة العدس' },
    summary: {
      en: 'Two bowls of boiled lentils with carrot, onion, tomato, garlic, olive oil, and salt. Extra cooking water is not counted.',
      fr: 'Deux bols de lentilles cuites avec carotte, oignon, tomate, ail, huile d’olive et sel. L’eau de cuisson supplémentaire n’est pas comptée.',
      ar: 'وعاءان من العدس المسلوق مع الجزر والبصل والطماطم والثوم وزيت الزيتون والملح. ماء الطبخ الإضافي غير محسوب.',
    },
    steps: [
      step('Soften onion, carrot, and garlic in the olive oil.', 'Faites revenir oignon, carotte et ail dans l’huile.', 'ليّن البصل والجزر والثوم في الزيت.'),
      step('Add tomato, cooked lentils, salt, and a little water. Simmer 10 minutes.', 'Ajoutez tomate, lentilles cuites, sel et un peu d’eau. Laissez mijoter 10 minutes.', 'أضف الطماطم والعدس المطبوخ والملح وقليلا من الماء. اتركه 10 دقائق.'),
      step('Divide into two bowls.', 'Répartissez dans deux bols.', 'قسّمها في وعاءين.'),
    ],
    ingredients: [
      ingredient('lentils-cooked', 198, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('carrot', 122),
      ingredient('onion', 110, { en: '1 medium', fr: '1 moyen', ar: 'حبة متوسطة' }),
      ingredient('tomato', 182, { en: '1 large', fr: '1 grosse', ar: 'حبة كبيرة' }),
      ingredient('garlic', 6, { en: '2 cloves', fr: '2 gousses', ar: 'فصان' }),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('salt', 0.8),
    ],
  },
  {
    id: 'vegetable-omelet',
    meal: 'dinner',
    servings: 1,
    minutes: 15,
    difficulty: 'easy',
    aliases: ['omelet', 'omelette legumes', 'عجة الخضار'],
    title: { en: 'Vegetable omelet', fr: 'Omelette aux légumes', ar: 'عجة الخضار' },
    summary: {
      en: 'Two eggs with spinach, tomato, olive oil, and a dash of salt.',
      fr: 'Deux œufs avec épinards, tomate, huile d’olive et une pincée de sel.',
      ar: 'بيضتان مع السبانخ والطماطم وزيت الزيتون ورشة ملح.',
    },
    steps: [
      step('Wilt the spinach and tomato in the olive oil.', 'Faites tomber les épinards et la tomate dans l’huile.', 'أذب السبانخ والطماطم في الزيت.'),
      step('Add beaten eggs and a dash of salt.', 'Ajoutez les œufs battus et une pincée de sel.', 'أضف البيض المخفوق ورشة الملح.'),
      step('Cook until just set.', 'Cuisez jusqu’à ce que ce soit juste pris.', 'اطبخ حتى تتماسك فقط.'),
    ],
    ingredients: [
      ingredient('egg-raw', 100, { en: '2 large eggs', fr: '2 gros œufs', ar: 'بيضتان كبيرتان' }),
      ingredient('spinach', 60, { en: '2 cups', fr: '2 tasses', ar: 'كوبان' }),
      ingredient('tomato', 62),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('salt', 0.4, { en: '1 dash', fr: '1 pincée', ar: 'رشة' }),
    ],
  },
  {
    id: 'chicken-potatoes',
    meal: 'dinner',
    servings: 1,
    minutes: 40,
    difficulty: 'easy',
    aliases: ['chicken potatoes', 'poulet pommes de terre', 'دجاج وبطاطس'],
    title: { en: 'Chicken and roasted potato', fr: 'Poulet et pomme de terre au four', ar: 'دجاج وبطاطس مشوية' },
    summary: {
      en: 'Roasted chicken breast with one medium baked potato and a spoon of olive oil. The potato record is already baked.',
      fr: 'Blanc de poulet rôti, une pomme de terre moyenne au four et une cuillère d’huile d’olive. La fiche pomme de terre est déjà cuite.',
      ar: 'صدر دجاج مشوي مع بطاطس متوسطة مخبوزة وملعقة زيت زيتون. صنف البطاطس مخبوز مسبقا.',
    },
    steps: [
      step('Use chicken that is already roasted, or roast it until cooked through.', 'Utilisez du poulet déjà rôti, ou rôtissez-le jusqu’à cuisson complète.', 'استخدم دجاجا مشويا جاهزا، أو اشوه حتى ينضج تماما.'),
      step('Serve it with the baked potato.', 'Servez avec la pomme de terre au four.', 'قدّمه مع البطاطس المشوية.'),
      step('Drizzle the olive oil and add a dash of salt if you want.', 'Arrosez d’huile d’olive et ajoutez une pincée de sel si vous voulez.', 'رش زيت الزيتون وأضف رشة ملح إن رغبت.'),
    ],
    ingredients: [
      ingredient('chicken-roasted', 140),
      ingredient('potato-baked', 173, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
      ingredient('salt', 0.4, { en: '1 dash', fr: '1 pincée', ar: 'رشة' }),
    ],
  },
  {
    id: 'baked-salmon',
    meal: 'dinner',
    servings: 1,
    minutes: 25,
    difficulty: 'easy',
    aliases: ['salmon', 'saumon', 'سلمون'],
    title: { en: 'Cooked salmon with vegetables', fr: 'Saumon et légumes', ar: 'سلمون مع الخضار' },
    summary: {
      en: 'One cooked salmon fillet with broccoli, a medium carrot, and olive oil. The salmon record is already cooked with dry heat.',
      fr: 'Un filet de saumon cuit, du brocoli, une carotte moyenne et de l’huile d’olive. La fiche saumon est déjà cuite à chaleur sèche.',
      ar: 'قطعة سلمون مطبوخة مع البروكلي وجزرة متوسطة وزيت الزيتون. صنف السلمون مطبوخ بحرارة جافة.',
    },
    steps: [
      step('Heat the cooked salmon through, or cook a fillet until it flakes.', 'Réchauffez le saumon cuit, ou cuisez un filet jusqu’à ce qu’il se défasse.', 'سخّن السلمون المطبوخ، أو اطبخ القطعة حتى تتفكك.'),
      step('Cook the broccoli and carrot until tender with the olive oil.', 'Cuisez le brocoli et la carotte avec l’huile jusqu’à ce qu’ils soient tendres.', 'اطبخ البروكلي والجزر بالزيت حتى يلين.'),
      step('Serve on one plate.', 'Servez dans une assiette.', 'قدّم في طبق واحد.'),
    ],
    ingredients: [
      ingredient('salmon-cooked', 178, { en: '1 fillet', fr: '1 filet', ar: 'قطعة فيليه' }),
      ingredient('broccoli', 91, { en: '1 cup chopped', fr: '1 tasse', ar: 'كوب مفروم' }),
      ingredient('carrot', 61, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('olive-oil', 13.5, { en: '1 tablespoon', fr: '1 cuillère à soupe', ar: 'ملعقة كبيرة' }),
    ],
  },
  {
    id: 'rice-beans-salad',
    meal: 'dinner',
    servings: 1,
    minutes: 15,
    difficulty: 'easy',
    aliases: ['rice and beans', 'riz haricots', 'أرز وفاصوليا'],
    title: { en: 'Rice, beans, and salad', fr: 'Riz, haricots et salade', ar: 'أرز وفاصوليا وسلطة' },
    summary: {
      en: 'Cooked white rice, a cup of red kidney beans, and a small salad. Both rice and beans are already boiled without salt.',
      fr: 'Riz blanc cuit, une tasse de haricots rouges et une petite salade. Riz et haricots sont déjà cuits sans sel.',
      ar: 'أرز أبيض مطبوخ وكوب فاصوليا حمراء وسلطة صغيرة. الأرز والفاصوليا مسلوقان بدون ملح.',
    },
    steps: [
      step('Warm the rice and beans if you like.', 'Réchauffez le riz et les haricots si vous voulez.', 'سخّن الأرز والفاصوليا إن رغبت.'),
      step('Toss lettuce, tomato, and cucumber with the olive oil.', 'Mélangez laitue, tomate et concombre avec l’huile.', 'اخلط الخس والطماطم والخيار مع الزيت.'),
      step('Serve the beans and rice beside the salad.', 'Servez haricots et riz à côté de la salade.', 'قدّم الفاصوليا والأرز بجانب السلطة.'),
    ],
    ingredients: [
      ingredient('rice-cooked', 158, { en: '1 cup cooked', fr: '1 tasse cuite', ar: 'كوب مطبوخ' }),
      ingredient('kidney-beans', 177, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('lettuce', 36, { en: '1 cup shredded', fr: '1 tasse', ar: 'كوب مبشور' }),
      ingredient('tomato', 91),
      ingredient('cucumber', 52, { en: '1 cup slices', fr: '1 tasse en tranches', ar: 'كوب شرائح' }),
      ingredient('olive-oil', 6.75, { en: '1/2 tablespoon', fr: '1/2 cuillère à soupe', ar: 'نصف ملعقة كبيرة' }),
    ],
  },
  {
    id: 'harira',
    meal: 'dinner',
    servings: 4,
    minutes: 40,
    difficulty: 'medium',
    region: 'morocco',
    aliases: ['harira', 'حريرة', 'hrira'],
    title: { en: 'Vegetarian harira-style soup', fr: 'Soupe type harira sans viande', ar: 'حريرة بدون لحم' },
    summary: {
      en: 'A four-serving lentil and chickpea soup with tomato, onion, parsley, lemon, garlic, olive oil, and salt. It does not include meat, flour thickening, or cilantro, so it is a simpler estimate of harira, not a restaurant bowl.',
      fr: 'Soupe pour quatre, lentilles et pois chiches, tomate, oignon, persil, citron, ail, huile d’olive et sel. Sans viande, sans farine et sans coriandre : une estimation plus simple, pas un bol de restaurant.',
      ar: 'حساء لأربعة من العدس والحمص والطماطم والبصل والبقدونس والليمون والثوم وزيت الزيتون والملح. بلا لحم ولا دقيق ولا كزبرة: تقدير أبسط وليس وعاء مطعم.',
    },
    steps: [
      step('Soften onion and garlic in the olive oil.', 'Faites revenir oignon et ail dans l’huile.', 'ليّن البصل والثوم في الزيت.'),
      step('Add tomato, cooked lentils, cooked chickpeas, salt, and water to loosen the soup. Simmer 15 minutes.', 'Ajoutez tomate, lentilles cuites, pois chiches cuits, sel et de l’eau pour détendre la soupe. Laissez mijoter 15 minutes.', 'أضف الطماطم والعدس المطبوخ والحمص المطبوخ والملح وماء لتخفيف الحساء. اتركه 15 دقيقة.'),
      step('Stir in parsley and lemon. Ladle four bowls.', 'Ajoutez persil et citron. Servez quatre bols.', 'أضف البقدونس والليمون. اسكب أربعة أوعية.'),
    ],
    ingredients: [
      ingredient('lentils-cooked', 198, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('chickpeas-cooked', 164, { en: '1 cup', fr: '1 tasse', ar: 'كوب' }),
      ingredient('tomato', 246, { en: '2 medium', fr: '2 moyennes', ar: 'حبتان متوسطتان' }),
      ingredient('onion', 110, { en: '1 medium', fr: '1 moyen', ar: 'حبة متوسطة' }),
      ingredient('parsley', 15.2),
      ingredient('garlic', 6, { en: '2 cloves', fr: '2 gousses', ar: 'فصان' }),
      ingredient('olive-oil', 27, { en: '2 tablespoons', fr: '2 cuillères à soupe', ar: 'ملعقتان كبيرتان' }),
      ingredient('lemon', 58, { en: '1 fruit', fr: '1 fruit', ar: 'حبة' }),
      ingredient('salt', 1.2),
    ],
  },
  {
    id: 'apple-almonds',
    meal: 'snack',
    servings: 1,
    minutes: 2,
    difficulty: 'easy',
    aliases: ['apple almonds', 'pomme amandes', 'تفاح ولوز'],
    title: { en: 'Apple and almonds', fr: 'Pomme et amandes', ar: 'تفاح ولوز' },
    summary: {
      en: 'A medium apple with one ounce of almonds.',
      fr: 'Une pomme moyenne et une once d’amandes.',
      ar: 'تفاحة متوسطة مع أونصة من اللوز.',
    },
    steps: [
      step('Wash the apple.', 'Lavez la pomme.', 'اغسل التفاحة.'),
      step('Eat it with the almonds.', 'Mangez-la avec les amandes.', 'كلها مع اللوز.'),
    ],
    ingredients: [
      ingredient('apple', 182, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('almonds', 28.35, { en: '1 ounce', fr: '1 once', ar: 'أونصة' }),
    ],
  },
  {
    id: 'yogurt-berries',
    meal: 'snack',
    servings: 1,
    minutes: 3,
    difficulty: 'easy',
    aliases: ['yogurt berries', 'yaourt myrtilles', 'زبادي وتوت'],
    title: { en: 'Yogurt and blueberries', fr: 'Yaourt et myrtilles', ar: 'زبادي وتوت أزرق' },
    summary: {
      en: 'Plain yogurt with half a cup of blueberries.',
      fr: 'Yaourt nature et une demi-tasse de myrtilles.',
      ar: 'زبادي سادة مع نصف كوب من التوت الأزرق.',
    },
    steps: [
      step('Add the yogurt to a bowl.', 'Mettez le yaourt dans un bol.', 'ضع الزبادي في وعاء.'),
      step('Stir in the blueberries.', 'Ajoutez les myrtilles.', 'أضف التوت.'),
    ],
    ingredients: [
      ingredient('yogurt', 170, { en: '1 container', fr: '1 pot', ar: 'علبة' }),
      ingredient('blueberries', 74, { en: '1/2 cup', fr: '1/2 tasse', ar: 'نصف كوب' }),
    ],
  },
  {
    id: 'banana-peanut',
    meal: 'snack',
    servings: 1,
    minutes: 2,
    difficulty: 'easy',
    aliases: ['banana peanut', 'banane cacahuete', 'موز وزبدة فول'],
    title: { en: 'Banana and peanut butter', fr: 'Banane et beurre de cacahuète', ar: 'موز وزبدة الفول السوداني' },
    summary: {
      en: 'A medium banana with half a tablespoon of unsalted peanut butter.',
      fr: 'Une banane moyenne et une demi-cuillère de beurre de cacahuète sans sel.',
      ar: 'موزة متوسطة مع نصف ملعقة من زبدة الفول السوداني غير المملحة.',
    },
    steps: [
      step('Peel the banana.', 'Épluchez la banane.', 'قشّر الموز.'),
      step('Serve it with the peanut butter.', 'Servez avec le beurre de cacahuète.', 'قدّمه مع زبدة الفول السوداني.'),
    ],
    ingredients: [
      ingredient('banana', 118, { en: '1 medium', fr: '1 moyenne', ar: 'حبة متوسطة' }),
      ingredient('peanut-butter', 16, { en: '1/2 tablespoon', fr: '1/2 cuillère à soupe', ar: 'نصف ملعقة كبيرة' }),
    ],
  },
  {
    id: 'carrot-hummus',
    meal: 'snack',
    servings: 1,
    minutes: 5,
    difficulty: 'easy',
    aliases: ['carrots hummus', 'carottes houmous', 'جزر وحمص'],
    title: { en: 'Carrot sticks and hummus', fr: 'Carottes et houmous', ar: 'جزر وحمص بالطحينة' },
    summary: {
      en: 'Raw carrot with two tablespoons of commercial hummus. Hummus usually contains sesame.',
      fr: 'Carotte crue et deux cuillères de houmous du commerce. Le houmous contient en général du sésame.',
      ar: 'جزر نيء مع ملعقتين من الحمص التجاري. الحمص يحتوي عادة على السمسم.',
    },
    steps: [
      step('Cut the carrot into sticks.', 'Coupez la carotte en bâtonnets.', 'قطّع الجزر أعوادا.'),
      step('Serve with the hummus.', 'Servez avec le houmous.', 'قدّمه مع الحمص.'),
    ],
    ingredients: [
      ingredient('carrot', 122),
      ingredient('hummus', 30, { en: '2 tablespoons', fr: '2 cuillères à soupe', ar: 'ملعقتان كبيرتان' }),
    ],
  },
  {
    id: 'egg-orange',
    meal: 'snack',
    servings: 1,
    minutes: 12,
    difficulty: 'easy',
    aliases: ['boiled egg', 'oeuf dur', 'بيض وبرتقال'],
    title: { en: 'Hard-boiled egg and orange', fr: 'Œuf dur et orange', ar: 'بيض مسلوق وبرتقال' },
    summary: {
      en: 'One large hard-boiled egg and one orange.',
      fr: 'Un gros œuf dur et une orange.',
      ar: 'بيضة كبيرة مسلوقة وبرتقالة.',
    },
    steps: [
      step('Boil the egg for about 10 minutes, cool, and peel. Or use one that is already hard-boiled.', 'Faites bouillir l’œuf environ 10 minutes, refroidissez et écalez. Ou utilisez un œuf déjà dur.', 'اسلق البيضة نحو 10 دقائق ثم برّدها وقشّرها. أو استخدم بيضة مسلوقة جاهزة.'),
      step('Peel the orange and eat them together.', 'Épluchez l’orange et mangez les deux ensemble.', 'قشّر البرتقال وكلهما معا.'),
    ],
    ingredients: [
      ingredient('egg-boiled', 50, { en: '1 large egg', fr: '1 gros œuf', ar: 'بيضة كبيرة' }),
      ingredient('orange', 131, { en: '1 fruit', fr: '1 fruit', ar: 'حبة' }),
    ],
  },
]

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

export const RECIPES = RECIPE_DRAFTS.map((recipe) => {
  const foods = recipe.ingredients.map((item) => FOODS_BY_ID[item.foodId])
  if (foods.some((food) => !food)) {
    throw new Error(`Recipe ${recipe.id} references a missing food`)
  }
  const tags = unique(foods.flatMap((food) => food.tags))
  const allergens = unique(foods.flatMap((food) => food.allergens))
  const vegetarian = foods.every((food) => !food.tags.includes('meat') && !food.tags.includes('fish'))
  return { ...recipe, tags, allergens, vegetarian, estimated: true }
})

export const RECIPES_BY_ID = Object.fromEntries(RECIPES.map((recipe) => [recipe.id, recipe]))

export function getRecipe(id) {
  return RECIPES_BY_ID[id] || null
}

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']
