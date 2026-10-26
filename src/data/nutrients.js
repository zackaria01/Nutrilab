/**
 * Beginner explanations for the Nutrient Explorer.
 * Wording is educational, not a diagnosis or a treatment claim.
 * Food lists are built from the catalog at runtime and sorted by the USDA amount per 100 g.
 */

export const NUTRIENTS = [
  {
    slug: 'protein',
    nutrientKeys: ['proteinG'],
    unit: 'g',
    icon: 'protein',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/list-all/',
    name: { en: 'Protein', fr: 'Protéines', ar: 'البروتين' },
    summary: {
      en: 'Helps build and repair your body.',
      fr: 'Aide à construire et à réparer le corps.',
      ar: 'يساعد على بناء الجسم وإصلاحه.',
    },
    about: {
      en: 'Protein is a part of muscles, skin, and many other tissues. Foods such as eggs, yogurt, beans, fish, and chicken provide it. People need different amounts depending on age, body size, and what they do during the day. This page does not tell you whether your intake is enough.',
      fr: 'Les protéines entrent dans les muscles, la peau et beaucoup d’autres tissus. Les œufs, le yaourt, les légumes secs, le poisson et le poulet en apportent. Les besoins changent avec l’âge, la taille du corps et l’activité. Cette page ne dit pas si vous en mangez assez.',
      ar: 'البروتين جزء من العضلات والجلد وأنسجة كثيرة أخرى. البيض والزبادي والبقول والسمك والدجاج توفره. تختلف الحاجة حسب العمر وحجم الجسم وما تفعله خلال اليوم. هذه الصفحة لا تحكم إن كانت الكمية كافية لك.',
    },
  },
  {
    slug: 'fiber',
    nutrientKeys: ['fiberG'],
    unit: 'g',
    icon: 'fiber',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/list-all/',
    name: { en: 'Dietary fiber', fr: 'Fibres alimentaires', ar: 'الألياف الغذائية' },
    summary: {
      en: 'A part of plant foods that most people could use more of.',
      fr: 'Une partie des aliments végétaux, souvent peu présente dans l’assiette.',
      ar: 'جزء من الأطعمة النباتية، وكثير من الناس يأكلون منه قليلا.',
    },
    about: {
      en: 'Fiber comes from plants, including beans, oats, fruit, and vegetables. It is not digested like starch or sugar. Eating fiber-rich foods with meals is a common way to build a more filling plate. Needs vary, and this app does not set a personal target.',
      fr: 'Les fibres viennent des végétaux : légumes secs, avoine, fruits et légumes. Elles ne se digèrent pas comme l’amidon ou le sucre. Les ajouter aux repas rend souvent l’assiette plus rassasiante. Les besoins varient, et l’application ne fixe pas d’objectif personnel.',
      ar: 'الألياف تأتي من النباتات مثل البقول والشوفان والفواكه والخضار. لا تُهضم مثل النشا أو السكر. إضافتها إلى الوجبات طريقة شائعة لطبق أكثر إشباعا. تختلف الحاجة، والتطبيق لا يحدد هدفا شخصيا.',
    },
  },
  {
    slug: 'magnesium',
    nutrientKeys: ['magnesiumMg'],
    unit: 'mg',
    icon: 'magnesium',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Magnesium-Consumer/',
    name: { en: 'Magnesium', fr: 'Magnésium', ar: 'المغنيسيوم' },
    summary: {
      en: 'A mineral used by muscles and nerves. The unit is mg, not the symbol Mg.',
      fr: 'Un minéral utilisé par les muscles et les nerfs. L’unité est mg, pas le symbole Mg.',
      ar: 'معدن تستخدمه العضلات والأعصاب. الوحدة هي mg وليست رمز العنصر Mg.',
    },
    about: {
      en: 'Magnesium is found in seeds, nuts, beans, and leafy greens. It helps the body use energy from food and supports muscle and nerve function. How much a person needs depends on age and other factors. A food list is not a test for deficiency.',
      fr: 'Le magnésium se trouve dans les graines, les noix, les légumes secs et les feuilles vertes. Il aide le corps à utiliser l’énergie des aliments et participe au fonctionnement des muscles et des nerfs. Les besoins dépendent de l’âge et d’autres facteurs. Une liste d’aliments n’est pas un test de carence.',
      ar: 'يوجد المغنيسيوم في البذور والمكسرات والبقول والخضار الورقية. يساعد الجسم على استخدام طاقة الطعام ويدعم عمل العضلات والأعصاب. تختلف الكمية المناسبة حسب العمر وعوامل أخرى. قائمة الأطعمة ليست فحصا لنقص.',
    },
  },
  {
    slug: 'vitamin-b12',
    nutrientKeys: ['b12Ug'],
    unit: 'µg',
    icon: 'b12',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/',
    name: { en: 'Vitamin B12', fr: 'Vitamine B12', ar: 'فيتامين ب12' },
    summary: {
      en: 'A vitamin found mainly in animal foods.',
      fr: 'Une vitamine présente surtout dans les aliments d’origine animale.',
      ar: 'فيتامين يوجد أساسا في الأطعمة الحيوانية.',
    },
    about: {
      en: 'Vitamin B12 helps the body make red blood cells and keep nerves working. In this catalog it shows up in fish, eggs, milk, and yogurt. Plant foods here do not provide it unless a label says they are fortified, and these generic entries are not fortified claims. This is not a diagnosis of low B12.',
      fr: 'La vitamine B12 aide à fabriquer les globules rouges et au fonctionnement des nerfs. Dans ce catalogue, elle apparaît dans le poisson, les œufs, le lait et le yaourt. Les végétaux de la liste n’en apportent pas, sauf aliment enrichi, ce que ces fiches génériques ne prétendent pas. Ce n’est pas un diagnostic.',
      ar: 'يساعد فيتامين ب12 الجسم على صنع خلايا الدم الحمراء وعلى عمل الأعصاب. في هذا الدليل يظهر في السمك والبيض والحليب والزبادي. الأطعمة النباتية هنا لا توفره إلا إذا كان الملصق يقول إنها مدعّمة، وهذه الأصناف العامة ليست ادعاء تدعيم. هذا ليس تشخيصا.',
    },
  },
  {
    slug: 'omega-3',
    nutrientKeys: ['omega3AlaG', 'omega3EpaG', 'omega3DhaG'],
    separateKey: 'pufa183UnspecifiedG',
    unit: 'g',
    icon: 'omega3',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/',
    name: { en: 'Omega-3 fatty acids', fr: 'Acides gras oméga-3', ar: 'أحماض أوميغا-3' },
    summary: {
      en: 'A family of fats. ALA, EPA, and DHA are named only when USDA names them.',
      fr: 'Une famille de graisses. ALA, EPA et DHA ne sont nommés que si l’USDA les nomme.',
      ar: 'عائلة من الدهون. لا نسمّي ALA أو EPA أو DHA إلا إذا سمّتها البيانات.',
    },
    about: {
      en: 'Omega-3 fats include ALA from some plant foods and EPA and DHA, which show up here in fish. They are not all the same substance, so this app never adds them into one invented “omega-3 total” when a part is missing. Walnuts and flaxseed have a related fat that USDA lists only as PUFA 18:3, so they appear in a separate note.',
      fr: 'Les oméga-3 comprennent l’ALA de certains végétaux, ainsi que l’EPA et le DHA, présents ici dans le poisson. Ce ne sont pas la même substance : l’application n’invente pas un total quand une partie manque. Les noix et le lin ont une graisse proche, indiquée seulement comme AGPI 18:3, donc elles figurent à part.',
      ar: 'تشمل أوميغا-3 حمض ALA من بعض النباتات، وEPA وDHA اللذين يظهران هنا في السمك. ليست المادة نفسها، لذلك لا يخترع التطبيق مجموعا واحدا إذا غاب جزء. الجوز وبذور الكتان فيها دهن قريب تذكره البيانات فقط كدهون 18:3، لذلك تظهران في ملاحظة منفصلة.',
    },
  },
  {
    slug: 'iron',
    nutrientKeys: ['ironMg'],
    unit: 'mg',
    icon: 'iron',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Iron-Consumer/',
    name: { en: 'Iron', fr: 'Fer', ar: 'الحديد' },
    summary: {
      en: 'A mineral the body uses to carry oxygen in the blood.',
      fr: 'Un minéral que le corps utilise pour transporter l’oxygène dans le sang.',
      ar: 'معدن يستخدمه الجسم لنقل الأكسجين في الدم.',
    },
    about: {
      en: 'Iron is found in foods such as lentils, spinach, sardines, and seeds. The body does not absorb every kind of iron in the same way. Amounts needed vary by age and other circumstances. This list does not say whether someone has low iron.',
      fr: 'Le fer se trouve par exemple dans les lentilles, les épinards, les sardines et les graines. Le corps n’absorbe pas toutes les formes de fer de la même façon. Les besoins varient selon l’âge et d’autres situations. Cette liste ne dit pas si une personne manque de fer.',
      ar: 'يوجد الحديد في أطعمة مثل العدس والسبانخ والسردين والبذور. الجسم لا يمتص كل أنواع الحديد بالطريقة نفسها. تختلف الكمية المناسبة حسب العمر وظروف أخرى. هذه القائمة لا تقول إن شخصا يعاني نقص الحديد.',
    },
  },
  {
    slug: 'calcium',
    nutrientKeys: ['calciumMg'],
    unit: 'mg',
    icon: 'calcium',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Calcium-Consumer/',
    name: { en: 'Calcium', fr: 'Calcium', ar: 'الكالسيوم' },
    summary: {
      en: 'A mineral used in bones and teeth.',
      fr: 'Un minéral utilisé dans les os et les dents.',
      ar: 'معدن يُستخدم في العظام والأسنان.',
    },
    about: {
      en: 'Calcium is widely known for bones and teeth. Milk, yogurt, and small fish eaten with their bones, such as the sardines in this catalog, contain it. Needs change with age. A food ranking is not a bone-health test.',
      fr: 'Le calcium est connu pour les os et les dents. Le lait, le yaourt et les petits poissons consommés avec les arêtes, comme les sardines de ce catalogue, en contiennent. Les besoins changent avec l’âge. Un classement d’aliments n’est pas un examen des os.',
      ar: 'يُعرف الكالسيوم بدوره في العظام والأسنان. الحليب والزبادي والأسماك الصغيرة التي تؤكل بعظمها، مثل السردين في هذا الدليل، تحتويه. تتغير الحاجة مع العمر. ترتيب الأطعمة ليس فحصا لصحة العظام.',
    },
  },
  {
    slug: 'vitamin-c',
    nutrientKeys: ['vitaminCMg'],
    unit: 'mg',
    icon: 'vitaminC',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/VitaminC-Consumer/',
    name: { en: 'Vitamin C', fr: 'Vitamine C', ar: 'فيتامين ج' },
    summary: {
      en: 'A vitamin found in many fruits and vegetables.',
      fr: 'Une vitamine présente dans beaucoup de fruits et de légumes.',
      ar: 'فيتامين يوجد في كثير من الفواكه والخضار.',
    },
    about: {
      en: 'Vitamin C is found in foods such as peppers, broccoli, strawberries, and citrus. It is one of the nutrients people talk about with fruit and vegetables. Cooking and storage can change how much remains in a meal. This page does not prescribe a dose.',
      fr: 'La vitamine C se trouve dans le poivron, le brocoli, les fraises et les agrumes. La cuisson et la conservation peuvent changer la quantité qui reste dans un repas. Cette page ne prescrit pas de dose.',
      ar: 'يوجد فيتامين ج في الفلفل والبروكلي والفراولة والحمضيات. الطهي والتخزين قد يغيّران الكمية المتبقية في الوجبة. هذه الصفحة لا توصي بجرعة.',
    },
  },
  {
    slug: 'vitamin-d',
    nutrientKeys: ['vitaminDUg'],
    unit: 'µg',
    icon: 'vitaminD',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/VitaminD-Consumer/',
    name: { en: 'Vitamin D', fr: 'Vitamine D', ar: 'فيتامين د' },
    summary: {
      en: 'A vitamin found in a smaller set of foods, sometimes added to milk.',
      fr: 'Une vitamine présente dans peu d’aliments, parfois ajoutée au lait.',
      ar: 'فيتامين يوجد في مجموعة أصغر من الأطعمة، ويُضاف أحيانا إلى الحليب.',
    },
    about: {
      en: 'Vitamin D helps the body use calcium. Fatty fish and fortified milk are common food sources in this catalog. Sunlight also affects vitamin D status, which a food list cannot measure. Amounts are shown in micrograms (µg), not as a personal prescription.',
      fr: 'La vitamine D aide le corps à utiliser le calcium. Les poissons gras et le lait enrichi sont des sources fréquentes dans ce catalogue. Le soleil influence aussi le statut en vitamine D, ce qu’une liste d’aliments ne mesure pas. Les quantités sont en microgrammes (µg), pas une ordonnance.',
      ar: 'يساعد فيتامين د الجسم على استخدام الكالسيوم. الأسماك الدهنية والحليب المدعّم مصادر شائعة في هذا الدليل. ضوء الشمس يؤثر أيضا، وقائمة الطعام لا تقيس ذلك. الكميات بالميكروغرام (µg) وليست وصفة شخصية.',
    },
  },
  {
    slug: 'potassium',
    nutrientKeys: ['potassiumMg'],
    unit: 'mg',
    icon: 'potassium',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Potassium-Consumer/',
    name: { en: 'Potassium', fr: 'Potassium', ar: 'البوتاسيوم' },
    summary: {
      en: 'A mineral found in many everyday foods, including beans, potatoes, and fruit.',
      fr: 'Un minéral présent dans beaucoup d’aliments du quotidien, dont les légumes secs, les pommes de terre et les fruits.',
      ar: 'معدن يوجد في أطعمة يومية كثيرة، منها البقول والبطاطس والفواكه.',
    },
    about: {
      en: 'Potassium is found across the food supply, especially in beans, potatoes, greens, and fruit such as bananas. It is one of the minerals the body uses in fluid balance and muscle function. People with some medical conditions are sometimes told to watch potassium; this app does not give that advice.',
      fr: 'Le potassium est répandu, surtout dans les légumes secs, les pommes de terre, les feuilles vertes et des fruits comme la banane. Le corps l’utilise notamment pour l’équilibre des fluides et les muscles. Certaines situations médicales demandent d’y faire attention : cette application ne donne pas ce conseil.',
      ar: 'البوتاسيوم منتشر، خاصة في البقول والبطاطس والخضار الورقية وفواكه مثل الموز. يستخدمه الجسم في توازن السوائل وعمل العضلات. بعض الحالات الطبية تتطلب الانتباه إليه، وهذا التطبيق لا يقدّم تلك النصيحة.',
    },
  },
  {
    slug: 'zinc',
    nutrientKeys: ['zincMg'],
    unit: 'mg',
    icon: 'zinc',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Zinc-Consumer/',
    name: { en: 'Zinc', fr: 'Zinc', ar: 'الزنك' },
    summary: {
      en: 'A mineral used in growth, taste, and the immune system.',
      fr: 'Un minéral utilisé pour la croissance, le goût et le système immunitaire.',
      ar: 'معدن يُستخدم في النمو والتذوق والجهاز المناعي.',
    },
    about: {
      en: 'Zinc is found in foods such as meat, seeds, nuts, and dairy. It has roles in growth and in how the immune system works. Eating a food that contains zinc does not treat an illness. Needs vary by age and other factors.',
      fr: 'Le zinc se trouve dans la viande, les graines, les noix et les produits laitiers. Il participe à la croissance et au fonctionnement du système immunitaire. Manger un aliment qui en contient ne soigne pas une maladie. Les besoins varient.',
      ar: 'يوجد الزنك في اللحوم والبذور والمكسرات ومنتجات الألبان. له دور في النمو وفي عمل الجهاز المناعي. أكل طعام يحتويه لا يعالج مرضا. تختلف الحاجة حسب العمر وعوامل أخرى.',
    },
  },
  {
    slug: 'folate',
    nutrientKeys: ['folateUg'],
    unit: 'µg',
    icon: 'folate',
    sourceUrl: 'https://ods.od.nih.gov/factsheets/Folate-Consumer/',
    name: { en: 'Folate (vitamin B9)', fr: 'Folate (vitamine B9)', ar: 'الفولات (فيتامين ب9)' },
    summary: {
      en: 'A B vitamin found in greens, beans, and some other foods.',
      fr: 'Une vitamine B présente dans les feuilles vertes, les légumes secs et d’autres aliments.',
      ar: 'فيتامين من مجموعة ب يوجد في الخضار الورقية والبقول وأطعمة أخرى.',
    },
    about: {
      en: 'Folate helps the body make new cells. Spinach, lentils, and beans are examples in this catalog. The numbers here are total folate in micrograms when USDA reported that field. They are not the same thing as a prescription for folic acid supplements.',
      fr: 'Le folate aide le corps à fabriquer de nouvelles cellules. Les épinards, les lentilles et les haricots en sont des exemples ici. Les chiffres sont le folate total en microgrammes quand l’USDA a publié ce champ. Ce n’est pas une ordonnance d’acide folique.',
      ar: 'يساعد الفولات الجسم على صنع خلايا جديدة. السبانخ والعدس والفاصوليا أمثلة في هذا الدليل. الأرقام هي الفولات الكلي بالميكروغرام عندما نشرته البيانات. ليست وصفة لمكمّل حمض الفوليك.',
    },
  },
]

export const NUTRIENTS_BY_SLUG = Object.fromEntries(NUTRIENTS.map((item) => [item.slug, item]))
