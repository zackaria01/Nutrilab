/** Short educational notes. Rotates by calendar day so the dashboard is stable on refresh. */
export const TIPS = [
  {
    id: 'basis',
    source: 'USDA FoodData Central',
    sourceUrl: 'https://fdc.nal.usda.gov/',
    text: {
      en: 'A calorie number always belongs to an amount. Check whether you are looking at 100 g or the portion on your plate.',
      fr: 'Un nombre de calories appartient toujours à une quantité. Vérifiez s’il s’agit de 100 g ou de la portion dans l’assiette.',
      ar: 'رقم السعرات يرتبط دائما بكمية. تحقق هل تنظر إلى 100 غ أو إلى الحصة في طبقك.',
    },
  },
  {
    id: 'missing',
    source: 'NutriLab editorial note',
    sourceUrl: 'https://fdc.nal.usda.gov/faq/',
    text: {
      en: 'If a vitamin is not in the database, NutriLab says “not reported.” It does not turn a blank into zero.',
      fr: 'Si une vitamine n’est pas dans la base, NutriLab affiche « non renseigné ». Un vide n’est pas transformé en zéro.',
      ar: 'إذا لم يكن فيتامين موجودا في البيانات، يعرض NutriLab «غير متوفر». الفراغ لا يتحول إلى صفر.',
    },
  },
  {
    id: 'bmi',
    source: 'CDC adult BMI',
    sourceUrl: 'https://www.cdc.gov/bmi/adult-calculator/',
    text: {
      en: 'BMI is a screening measure for adults. It does not diagnose health or name a target weight.',
      fr: 'L’IMC est un repère de dépistage pour les adultes. Il ne diagnostique pas la santé et ne fixe pas un poids cible.',
      ar: 'مؤشر كتلة الجسم أداة فرز للبالغين. لا يشخّص الصحة ولا يحدد وزنا مستهدفا.',
    },
  },
  {
    id: 'plates',
    source: 'NutriLab editorial note',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/list-all/',
    text: {
      en: 'A useful plate often mixes a protein food, a grain or starchy food, and vegetables. You do not need special products to start.',
      fr: 'Une assiette utile mélange souvent un aliment protéiné, une céréale ou un féculent, et des légumes. Pas besoin de produits spéciaux pour commencer.',
      ar: 'الطبق المفيد غالبا يجمع غذاء بروتينيا وحبوبا أو نشويات وخضارا. لا تحتاج منتجات خاصة لتبدأ.',
    },
  },
  {
    id: 'cooked',
    source: 'USDA FoodData Central',
    sourceUrl: 'https://fdc.nal.usda.gov/faq/',
    text: {
      en: 'Raw chicken and roasted chicken are different records. Cooking changes weight, so the numbers should not be swapped.',
      fr: 'Le poulet cru et le poulet rôti sont deux fiches différentes. La cuisson change le poids : il ne faut pas échanger les chiffres.',
      ar: 'الدجاج النيء والدجاج المشوي سجلان مختلفان. الطبخ يغيّر الوزن، لذلك لا ينبغي تبديل الأرقام.',
    },
  },
]

export function tipForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date - start) / 86400000)
  return TIPS[day % TIPS.length]
}
