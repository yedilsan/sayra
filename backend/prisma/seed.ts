import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await argon2.hash('admin123', {
    type: argon2.argon2id,
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sayra.com' },
    update: {},
    create: {
      email: 'admin@sayra.com',
      passwordHash: adminPasswordHash,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.aacCard.deleteMany();
  await prisma.aacCategory.deleteMany();
  await prisma.exerciseSession.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.exerciseType.deleteMany();
  await prisma.specialist.deleteMany();

  const aacCategories = [
    {
      order: 1,
      imageUrl: 'https://picsum.photos/seed/people-category/200',
      nameEn: 'People',
      nameRu: 'Люди',
      nameKz: 'Адамдар',
      nameJa: '人',
    },
    {
      order: 2,
      imageUrl: 'https://picsum.photos/seed/food-drinks-category/200',
      nameEn: 'Food and drinks',
      nameRu: 'Еда и напитки',
      nameKz: 'Тамақ пен сусын',
      nameJa: '食べ物と飲み物',
    },
    {
      order: 3,
      imageUrl: 'https://picsum.photos/seed/animals-category/200',
      nameEn: 'Animals',
      nameRu: 'Животные',
      nameKz: 'Жануарлар',
      nameJa: 'どうぶつ',
    },
    {
      order: 4,
      imageUrl: 'https://picsum.photos/seed/body-category/200',
      nameEn: 'Body',
      nameRu: 'Тело',
      nameKz: 'Дене',
      nameJa: 'からだ',
    },
    {
      order: 5,
      imageUrl: 'https://picsum.photos/seed/clothes-category/200',
      nameEn: 'Clothes',
      nameRu: 'Одежда',
      nameKz: 'Киім',
      nameJa: 'ふく',
    },
    {
      order: 6,
      imageUrl: 'https://picsum.photos/seed/toys-objects-category/200',
      nameEn: 'Toys/objects',
      nameRu: 'Игрушки/предметы',
      nameKz: 'Ойыншықтар/заттар',
      nameJa: 'おもちゃ・もの',
    },
    {
      order: 7,
      imageUrl: 'https://picsum.photos/seed/house-category/200',
      nameEn: 'House',
      nameRu: 'Дом',
      nameKz: 'Үй',
      nameJa: 'いえ',
    },
    {
      order: 8,
      imageUrl: 'https://picsum.photos/seed/place-category/200',
      nameEn: 'Place/where',
      nameRu: 'Место/куда',
      nameKz: 'Орын/қайда',
      nameJa: 'ばしょ・どこ',
    },
    {
      order: 9,
      imageUrl: 'https://picsum.photos/seed/actions-category/200',
      nameEn: 'Actions',
      nameRu: 'Действия',
      nameKz: 'Әрекеттер',
      nameJa: 'どうさ',
    },
    {
      order: 10,
      imageUrl: 'https://picsum.photos/seed/feelings-category/200',
      nameEn: 'Feelings',
      nameRu: 'Чувства',
      nameKz: 'Сезімдер',
      nameJa: '気持ち',
    },
    {
      order: 11,
      imageUrl: 'https://picsum.photos/seed/weather-nature-category/200',
      nameEn: 'Weather/nature',
      nameRu: 'Погода/природа',
      nameKz: 'Ауа-райы/табиғат',
      nameJa: 'てんき・しぜん',
    },
    {
      order: 12,
      imageUrl: 'https://picsum.photos/seed/transport-category/200',
      nameEn: 'Transport',
      nameRu: 'Транспорт',
      nameKz: 'Көлік',
      nameJa: 'のりもの',
    },
    {
      order: 13,
      imageUrl: 'https://picsum.photos/seed/colors-category/200',
      nameEn: 'Colors',
      nameRu: 'Цвета',
      nameKz: 'Түстер',
      nameJa: 'いろ',
    },
    {
      order: 14,
      imageUrl: 'https://picsum.photos/seed/numbers-category/200',
      nameEn: 'Numbers',
      nameRu: 'Числа',
      nameKz: 'Сандар',
      nameJa: 'かず',
    },
    {
      order: 15,
      imageUrl: 'https://picsum.photos/seed/time-category/200',
      nameEn: 'Time',
      nameRu: 'Время',
      nameKz: 'Уақыт',
      nameJa: 'じかん',
    },
  ];

  await prisma.aacCategory.createMany({ data: aacCategories });

  // ─────────────────────────────────────────────────────────
  // 1. Articulation
  // ─────────────────────────────────────────────────────────
  const articulationExercises = [
    {
      order: 1,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/articulation-fence/400',
      titleRu: 'Заборчик',
      titleKz: 'Қоршау',
      titleJa: '柵',
      titleEn: 'Fence',
      descriptionRu:
        'Улыбаемся так, чтобы верхние и нижние зубы были видны, как заборчик.',
      descriptionKz:
        'Жоғарғы және төменгі тістер қоршау сияқты көрінетіндей етіп күлеміз.',
      descriptionJa: '上下の歯が柵のように見えるように笑う練習です。',
      descriptionEn:
        'Smile wide so the upper and lower teeth show like a little fence.',
      instructionRu: 'Улыбнись, покажи зубки и удерживай улыбку 5 секунд.',
      instructionKz: 'Күліп, тістеріңді көрсет және 5 секунд ұста.',
      instructionJa: '笑って歯を見せ、5秒間キープしよう。',
      instructionEn: 'Smile, show your teeth, and hold for 5 seconds.',
    },
    {
      order: 2,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/articulation-tube/400',
      titleRu: 'Трубочка',
      titleKz: 'Түтікше',
      titleJa: 'チューブ',
      titleEn: 'Tube',
      descriptionRu:
        'Вытягиваем губы вперёд трубочкой, чтобы укрепить мышцы губ.',
      descriptionKz:
        'Ерін бұлшықеттерін нығайту үшін ерінді алға қарай түтікше етіп созамыз.',
      descriptionJa:
        '唇の筋肉を鍛えるために、唇を前に突き出してチューブの形を作ります。',
      descriptionEn:
        'Push the lips forward into a tube shape to strengthen the lip muscles.',
      instructionRu: 'Вытяни губы вперёд трубочкой и удерживай 5 секунд.',
      instructionKz: 'Ерінді алға қарай түтікше етіп соз да 5 секунд ұста.',
      instructionJa: '唇を前に突き出して5秒間キープしよう。',
      instructionEn: 'Push your lips forward like a tube and hold for 5 seconds.',
    },
    {
      order: 3,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/articulation-clock/400',
      titleRu: 'Часики',
      titleKz: 'Сағат',
      titleJa: '時計',
      titleEn: 'Clock',
      descriptionRu:
        'Язык двигается влево-вправо, как стрелка часов, тренируя подвижность языка.',
      descriptionKz:
        'Тілдің қозғалғыштығын жаттықтыру үшін тіл сағат тілі сияқты солға-оңға қозғалады.',
      descriptionJa:
        '舌の動きを鍛えるために、時計の針のように舌を左右に動かします。',
      descriptionEn:
        'The tongue moves left and right like a clock hand to train tongue mobility.',
      instructionRu: 'Открой рот и подвигай языком влево-вправо 10 раз.',
      instructionKz: 'Аузыңды аш да, тіліңді солға-оңға 10 рет қозғал.',
      instructionJa: '口を開けて、舌を時計の針のように左右に10回動かそう。',
      instructionEn: 'Open your mouth and move your tongue left and right 10 times.',
    },
    {
      order: 4,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/articulation-horse/400',
      titleRu: 'Лошадка',
      titleKz: 'Ат',
      titleJa: '馬',
      titleEn: 'Horse',
      descriptionRu:
        'Цокаем языком, подражая цокоту копыт лошадки.',
      descriptionKz:
        'Аттың тұяғының дыбысын елестетіп, тілмен шақылдатамыз.',
      descriptionJa: '馬のひづめの音をまねて舌を鳴らす練習です。',
      descriptionEn:
        'Click the tongue to imitate the sound of a horse’s hooves.',
      instructionRu: 'Пощёлкай языком, как лошадка копытами, 10 раз.',
      instructionKz: 'Ат тұяғы сияқты тіліңмен 10 рет шақылдат.',
      instructionJa: '馬のひづめのように舌を10回鳴らそう。',
      instructionEn: "Click your tongue like a horse's hooves, 10 times.",
    },
    {
      order: 5,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/articulation-snake/400',
      titleRu: 'Змейка',
      titleKz: 'Жылан',
      titleJa: '蛇',
      titleEn: 'Snake',
      descriptionRu:
        'Язык высовывается узким и острым, как жало змейки.',
      descriptionKz:
        'Тіл жыланның тілі сияқты жіңішке әрі үшкір болып шығады.',
      descriptionJa: '蛇の舌のように舌を細くとがらせて突き出す練習です。',
      descriptionEn:
        "The tongue sticks out narrow and pointed like a snake's tongue.",
      instructionRu: 'Высунь узкий острый язык вперёд и удерживай 5 секунд.',
      instructionKz: 'Жіңішке әрі үшкір тіліңді алға шығар да 5 секунд ұста.',
      instructionJa: '舌を細くとがらせて前に出し、5秒間キープしよう。',
      instructionEn: 'Stick out a narrow, pointy tongue and hold for 5 seconds.',
    },
    {
      order: 6,
      durationSeconds: 40,
      mediaUrl: 'https://picsum.photos/seed/articulation-mushroom/400',
      titleRu: 'Грибок',
      titleKz: 'Саңырауқұлақ',
      titleJa: 'きのこ',
      titleEn: 'Mushroom',
      descriptionRu:
        'Прижимаем язык к нёбу и широко открываем рот, как шляпку грибка на ножке.',
      descriptionKz:
        'Тілді таңдайға жабыстырып, ауызды кең ашамыз, саңырауқұлақ пішінін жасаймыз.',
      descriptionJa:
        '舌を上あごに押し付けて口を大きく開け、きのこの形を作ります。',
      descriptionEn:
        'Press the tongue to the roof of the mouth and open wide, forming a mushroom shape.',
      instructionRu: 'Прижми язык к нёбу, широко открой рот и удерживай 5 секунд.',
      instructionKz: 'Тіліңді таңдайыңа жабыстыр да ауызыңды кең аш, 5 секунд ұста.',
      instructionJa: '舌を上あごに付けて口を大きく開き、5秒間キープしよう。',
      instructionEn:
        'Press your tongue to the roof of your mouth, open wide, and hold for 5 seconds.',
    },
    {
      order: 7,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/articulation-hamster-hungry/400',
      titleRu: 'Голодный хомячок',
      titleKz: 'Аш аламан',
      titleJa: 'お腹が空いたハムスター',
      titleEn: 'Hungry Hamster',
      descriptionRu:
        'Втягиваем щёки внутрь, как голодный хомячок без запасов.',
      descriptionKz:
        'Аш аламан сияқты ұрттарды ішке тартамыз.',
      descriptionJa: 'お腹が空いたハムスターのように頬を内側にすぼめます。',
      descriptionEn:
        'Suck the cheeks inward like a hungry hamster with no food stored.',
      instructionRu: 'Втяни щёки внутрь и удерживай 5 секунд.',
      instructionKz: 'Ұрттарыңды ішке тарт да 5 секунд ұста.',
      instructionJa: '頬を内側に吸い込んで5秒間キープしよう。',
      instructionEn: 'Suck your cheeks in and hold for 5 seconds.',
    },
    {
      order: 8,
      durationSeconds: 40,
      mediaUrl: 'https://picsum.photos/seed/articulation-hamster-nuts/400',
      titleRu: 'Хомячок с орехами',
      titleKz: 'Жаңғақты аламан',
      titleJa: '木の実を持つハムスター',
      titleEn: 'Hamster with Nuts',
      descriptionRu:
        'Надуваем щёки по очереди, как хомячок, набивший их орешками.',
      descriptionKz:
        'Жаңғақ толтырған аламан сияқты ұрттарды кезек-кезек үрлейміз.',
      descriptionJa:
        '木の実をほおばったハムスターのように、頬を片方ずつふくらませます。',
      descriptionEn:
        'Puff out the cheeks one at a time, like a hamster stuffed with nuts.',
      instructionRu: 'Надуй одну щёку, потом другую, повтори 5 раз.',
      instructionKz: 'Бір ұртты, содан кейін екінші ұртты үрле, 5 рет қайтала.',
      instructionJa: '片方の頬をふくらませ、次にもう片方をふくらませよう。5回繰り返そう。',
      instructionEn: 'Puff one cheek, then the other, and repeat 5 times.',
    },
    {
      order: 9,
      durationSeconds: 40,
      mediaUrl: 'https://picsum.photos/seed/articulation-balloon/400',
      titleRu: 'Шарик',
      titleKz: 'Шар',
      titleJa: '風船',
      titleEn: 'Balloon',
      descriptionRu:
        'Надуваем обе щёки полностью, как воздушный шарик, и медленно выпускаем воздух.',
      descriptionKz:
        'Ауа шары сияқты екі ұртты толық үрлеп, ауаны баяу шығарамыз.',
      descriptionJa:
        '風船のように両方の頬を大きくふくらませ、ゆっくり空気を出します。',
      descriptionEn:
        'Puff both cheeks out fully like a balloon, then slowly release the air.',
      instructionRu: 'Надуй обе щёки, задержи на 3 секунды и медленно выпусти воздух.',
      instructionKz: 'Екі ұртты үрле, 3 секунд ұста да ауаны баяу шығар.',
      instructionJa: '両頬をふくらませて3秒キープし、ゆっくり空気を出そう。',
      instructionEn: 'Puff both cheeks, hold for 3 seconds, then slowly let the air out.',
    },
    {
      order: 10,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/articulation-swing/400',
      titleRu: 'Качели',
      titleKz: 'Теңселме',
      titleJa: 'ブランコ',
      titleEn: 'Swing',
      descriptionRu:
        'Язык качается, как качели, касаясь то верхних, то нижних зубов.',
      descriptionKz:
        'Тіл теңселме сияқты кезек-кезек жоғарғы және төменгі тістерге тиеді.',
      descriptionJa: '舌がブランコのように上下の歯に交互に触れます。',
      descriptionEn:
        'The tongue swings like a swing, touching the upper then lower teeth.',
      instructionRu:
        'Коснись языком верхних зубов, потом нижних, повтори 10 раз, как качели.',
      instructionKz:
        'Тіліңмен жоғарғы тістерге, содан кейін төменгі тістерге тиіп, теңселме сияқты 10 рет қайтала.',
      instructionJa: '舌で上の歯、次に下の歯に触れ、ブランコのように10回繰り返そう。',
      instructionEn:
        'Touch your tongue to the upper teeth, then the lower teeth, like a swing — repeat 10 times.',
    },
  ];

  const articulation = await prisma.exerciseType.create({
    data: {
      slug: 'articulation',
      icon: 'mouth',
      nameRu: 'Артикуляция',
      nameKz: 'Артикуляция',
      nameJa: '構音',
      nameEn: 'Articulation',
      descriptionRu:
        'Упражнения для языка, губ и щёк — подготовка мышц речевого аппарата',
      descriptionKz:
        'Тіл, ерін және ұрт үшін жаттығулар — сөйлеу аппараты бұлшықеттерін дайындау',
      descriptionJa: '舌、唇、頬を鍛える練習 — 発話器官の準備',
      descriptionEn:
        'Tongue, lip, and cheek exercises — preparing the speech apparatus muscles',
      exercises: { create: articulationExercises },
    },
  });

  // ─────────────────────────────────────────────────────────
  // 2. Breathing
  // ─────────────────────────────────────────────────────────
  const breathingExercises = [
    {
      order: 1,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/breathing-candle/400',
      titleRu: 'Задуй свечку',
      titleKz: 'Шамды сөндір',
      titleJa: 'ろうそくを消そう',
      titleEn: 'Blow Out the Candle',
      descriptionRu:
        'Плавный сильный выдох, чтобы задуть воображаемую свечу.',
      descriptionKz:
        'Елестетілген шамды сөндіру үшін тегіс әрі күшті дем шығару.',
      descriptionJa: '想像のろうそくを消すために、強く息を吐く練習です。',
      descriptionEn: 'A smooth, strong exhale to blow out an imaginary candle.',
      instructionRu: 'Сделай вдох носом и резко подуй, будто задуваешь свечу.',
      instructionKz: 'Мұрныңмен дем ал да, шамды сөндіргендей кенеттен үрле.',
      instructionJa: '鼻から息を吸って、ろうそくを消すように勢いよく吹こう。',
      instructionEn: 'Breathe in through your nose, then blow out sharply like blowing out a candle.',
    },
    {
      order: 2,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/breathing-bubbles/400',
      titleRu: 'Мыльные пузыри',
      titleKz: 'Сабын көпіршіктері',
      titleJa: 'シャボン玉',
      titleEn: 'Soap Bubbles',
      descriptionRu: 'Долгий плавный выдох для выдувания мыльных пузырей.',
      descriptionKz: 'Сабын көпіршіктерін үрлеу үшін ұзақ әрі тегіс дем шығару.',
      descriptionJa: 'シャボン玉を作るために、長くゆっくりと息を吐く練習です。',
      descriptionEn: 'A long, steady exhale to blow soap bubbles.',
      instructionRu: 'Вдохни глубоко и медленно выдыхай через трубочку, надувая пузыри.',
      instructionKz: 'Терең дем ал да, түтікше арқылы баяу үрлеп, көпіршік шығар.',
      instructionJa: '深く息を吸って、ストローでゆっくり吹いてシャボン玉を作ろう。',
      instructionEn: 'Take a deep breath and blow slowly through a straw to make bubbles.',
    },
    {
      order: 3,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/breathing-flower/400',
      titleRu: 'Понюхай цветок',
      titleKz: 'Гүлді иіскеп көр',
      titleJa: '花の匂いを嗅ごう',
      titleEn: 'Smell the Flower',
      descriptionRu: 'Глубокий вдох носом, как будто нюхаем душистый цветок.',
      descriptionKz: 'Хош иісті гүлді иіскегендей мұрынмен терең дем алу.',
      descriptionJa: '香りのよい花の匂いを嗅ぐように、鼻から深く息を吸う練習です。',
      descriptionEn: 'A deep inhale through the nose, as if smelling a fragrant flower.',
      instructionRu: 'Медленно вдохни носом, как будто нюхаешь цветок, и выдохни ртом.',
      instructionKz: 'Гүлді иіскегендей мұрныңмен баяу дем ал да, аузыңмен дем шығар.',
      instructionJa: '花の匂いを嗅ぐように鼻からゆっくり息を吸い、口から吐こう。',
      instructionEn: 'Breathe in slowly through your nose like smelling a flower, then breathe out through your mouth.',
    },
    {
      order: 4,
      durationSeconds: 30,
      mediaUrl: 'https://picsum.photos/seed/breathing-breeze/400',
      titleRu: 'Ветерок',
      titleKz: 'Жел',
      titleJa: 'そよ風',
      titleEn: 'Breeze',
      descriptionRu: 'Лёгкий прерывистый выдох, похожий на дуновение ветерка.',
      descriptionKz: 'Желдің есуіне ұқсас жеңіл әрі үзік-үзік дем шығару.',
      descriptionJa: 'そよ風のように軽く途切れながら息を吐く練習です。',
      descriptionEn: 'A light, intermittent exhale like the blowing of a breeze.',
      instructionRu: 'Подуй короткими лёгкими толчками 5 раз, как ветерок.',
      instructionKz: 'Жел сияқты жеңіл әрі қысқа импульстармен 5 рет үрле.',
      instructionJa: 'そよ風のように短く軽く5回息を吹こう。',
      instructionEn: 'Blow in short, gentle puffs 5 times, like a breeze.',
    },
    {
      order: 5,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/breathing-leaves/400',
      titleRu: 'Листопад',
      titleKz: 'Жапырақ құлау',
      titleJa: '落ち葉',
      titleEn: 'Falling Leaves',
      descriptionRu: 'Спокойный длинный выдох, как будто сдуваем листья с ладони.',
      descriptionKz: 'Алақаннан жапырақтарды үрлегендей тыныш әрі ұзақ дем шығару.',
      descriptionJa: '手のひらの葉っぱを吹き飛ばすように、静かに長く息を吐く練習です。',
      descriptionEn: 'A calm, long exhale, as if blowing leaves off your palm.',
      instructionRu: 'Положи листочек на ладонь и плавно сдуй его одним выдохом.',
      instructionKz: 'Алақаныңа жапырақ қой да, оны бір рет тегіс дем шығарып ұш.',
      instructionJa: '手のひらに葉っぱをのせて、一息でそっと吹き飛ばそう。',
      instructionEn: 'Put a paper leaf on your palm and blow it off gently in one breath.',
    },
    {
      order: 6,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/breathing-snowflake/400',
      titleRu: 'Снежинка',
      titleKz: 'Қар ұшқыны',
      titleJa: '雪',
      titleEn: 'Snowflake',
      descriptionRu:
        'Мягкий, лёгкий выдох, чтобы снежинка полетела вверх и не упала.',
      descriptionKz:
        'Қар ұшқынын жерге түсірмей ұшыру үшін жұмсақ әрі жеңіл дем шығару.',
      descriptionJa: '雪の結晶が舞い上がるように、やさしく軽い息を吐く練習です。',
      descriptionEn: 'A soft, light exhale to keep a snowflake floating up in the air.',
      instructionRu: 'Положи снежинку на ладонь и легонько подуй на неё вверх.',
      instructionKz: 'Алақаныңа қар ұшқынын қой да, оны жоғары қарай жеңіл үрле.',
      instructionJa: '手のひらに雪の結晶をのせて、上にふわっと吹こう。',
      instructionEn: 'Put a paper snowflake on your palm and blow it gently upward.',
    },
    {
      order: 7,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/breathing-boat/400',
      titleRu: 'Кораблик',
      titleKz: 'Кеме',
      titleJa: '船',
      titleEn: 'Boat',
      descriptionRu: 'Ровный длительный выдох, чтобы кораблик поплыл по воде.',
      descriptionKz: 'Кеме судың бетімен жүзу үшін тегіс әрі ұзақ дем шығару.',
      descriptionJa: '船が水の上を進むように、なめらかに長く息を吐く練習です。',
      descriptionEn: 'A smooth, sustained exhale to make a paper boat sail across the water.',
      instructionRu: 'Подуй на бумажный кораблик в тазике с водой, чтобы он поплыл.',
      instructionKz: 'Су құйылған тегешке қағаз кеме қой да, ол жүзу үшін үрле.',
      instructionJa: '水を張ったたらいに紙の船を浮かべて、進むように吹こう。',
      instructionEn: 'Blow on a paper boat floating in a bowl of water to make it sail.',
    },
    {
      order: 8,
      durationSeconds: 40,
      mediaUrl: 'https://picsum.photos/seed/breathing-football/400',
      titleRu: 'Футбол',
      titleKz: 'Футбол',
      titleJa: 'サッカー',
      titleEn: 'Football',
      descriptionRu: 'Сильный, направленный выдох, чтобы забить гол ватному мячику.',
      descriptionKz: 'Мақта добын қақпаға енгізу үшін күшті әрі бағытталған дем шығару.',
      descriptionJa: '綿のボールをゴールに入れるように、強く狙って息を吐く練習です。',
      descriptionEn: 'A strong, aimed exhale to blow a cotton ball into a goal.',
      instructionRu: 'Подуй сильно на ватный шарик, чтобы закатить его в ворота.',
      instructionKz: 'Мақта шарын қақпаға енгізу үшін оған күшті үрле.',
      instructionJa: '綿の玉に強く息を吹きかけてゴールに入れよう。',
      instructionEn: 'Blow hard on a cotton ball to push it into the goal.',
    },
    {
      order: 9,
      durationSeconds: 40,
      mediaUrl: 'https://picsum.photos/seed/breathing-storm/400',
      titleRu: 'Шторм',
      titleKz: 'Дауыл',
      titleJa: '嵐',
      titleEn: 'Storm',
      descriptionRu:
        'Мощный длинный выдох, поднимающий волны в стакане с водой через трубочку.',
      descriptionKz:
        'Түтікше арқылы стакандағы суда толқын тудыратын күшті әрі ұзақ дем шығару.',
      descriptionJa: 'コップの水にストローで強く息を吹き込んで波を立てる練習です。',
      descriptionEn: 'A powerful, sustained exhale that makes waves in a cup of water through a straw.',
      instructionRu: 'Подуй сильно в трубочку, опущенную в стакан с водой, чтобы поднялись волны.',
      instructionKz: 'Суы бар стакандағы түтікшеге күшті үрлеп, толқын тудыр.',
      instructionJa: '水の入ったコップにストローを入れて、強く吹いて波を作ろう。',
      instructionEn: 'Blow hard through a straw into a cup of water to make waves.',
    },
    {
      order: 10,
      durationSeconds: 35,
      mediaUrl: 'https://picsum.photos/seed/breathing-dragon/400',
      titleRu: 'Дракон',
      titleKz: 'Айдаһар',
      titleJa: 'ドラゴン',
      titleEn: 'Dragon',
      descriptionRu: 'Резкий сильный выдох через рот, как будто дракон выдыхает огонь.',
      descriptionKz: 'Айдаһар от шығарғандай аузымен кенеттен әрі күшті дем шығару.',
      descriptionJa: 'ドラゴンが炎を吐くように、口から勢いよく息を吐く練習です。',
      descriptionEn: 'A sharp, strong exhale through the mouth, like a dragon breathing fire.',
      instructionRu: 'Вдохни глубоко и резко выдохни ртом, как дракон, выдыхающий огонь.',
      instructionKz: 'Терең дем ал да, от шығарған айдаһардай аузыңмен кенеттен дем шығар.',
      instructionJa: '深く息を吸って、炎を吐くドラゴンのように口から勢いよく吐こう。',
      instructionEn: 'Take a deep breath and blow out sharply through your mouth, like a fire-breathing dragon.',
    },
  ];

  const breathing = await prisma.exerciseType.create({
    data: {
      slug: 'breathing',
      icon: 'lungs',
      nameRu: 'Дыхание',
      nameKz: 'Тыныс алу',
      nameJa: '呼吸',
      nameEn: 'Breathing',
      descriptionRu: 'Развитие речевого дыхания и силы выдоха',
      descriptionKz: 'Сөйлеу тынысын және дем шығару күшін дамыту',
      descriptionJa: '話すための呼吸と息の強さを鍛える',
      descriptionEn: 'Developing speech breathing and exhale strength',
      exercises: { create: breathingExercises },
    },
  });

  // ─────────────────────────────────────────────────────────
  // 3. Listen and Point
  // ─────────────────────────────────────────────────────────
  const listenAndPointExercises = [
    {
      order: 1,
      question: {
        ru: 'Где кошка?',
        kz: 'Мысық қайда?',
        ja: '猫はどこ？',
        en: 'Where is the cat?',
      },
      options: [
        { seed: 'point-cat', ru: 'Кошка', kz: 'Мысық', ja: '猫', en: 'Cat', isCorrect: true },
        { seed: 'point-dog', ru: 'Собака', kz: 'Ит', ja: '犬', en: 'Dog', isCorrect: false },
        { seed: 'point-bird', ru: 'Птица', kz: 'Құс', ja: '鳥', en: 'Bird', isCorrect: false },
      ],
    },
    {
      order: 2,
      question: {
        ru: 'Где мама?',
        kz: 'Анасы қайда?',
        ja: 'ママはどこ？',
        en: 'Where is mom?',
      },
      options: [
        { seed: 'point-mom', ru: 'Мама', kz: 'Анасы', ja: 'ママ', en: 'Mom', isCorrect: true },
        { seed: 'point-dad', ru: 'Папа', kz: 'Әкесі', ja: 'パパ', en: 'Dad', isCorrect: false },
        { seed: 'point-grandma', ru: 'Бабушка', kz: 'Әжесі', ja: 'おばあちゃん', en: 'Grandma', isCorrect: false },
      ],
    },
    {
      order: 3,
      question: {
        ru: 'Где яблоко?',
        kz: 'Алма қайда?',
        ja: 'りんごはどこ？',
        en: 'Where is the apple?',
      },
      options: [
        { seed: 'point-apple', ru: 'Яблоко', kz: 'Алма', ja: 'りんご', en: 'Apple', isCorrect: true },
        { seed: 'point-banana', ru: 'Банан', kz: 'Банан', ja: 'バナナ', en: 'Banana', isCorrect: false },
        { seed: 'point-orange', ru: 'Апельсин', kz: 'Апельсин', ja: 'オレンジ', en: 'Orange', isCorrect: false },
      ],
    },
    {
      order: 4,
      question: {
        ru: 'Где машина?',
        kz: 'Машина қайда?',
        ja: '車はどこ？',
        en: 'Where is the car?',
      },
      options: [
        { seed: 'point-car', ru: 'Машина', kz: 'Машина', ja: '車', en: 'Car', isCorrect: true },
        { seed: 'point-plane', ru: 'Самолёт', kz: 'Ұшақ', ja: '飛行機', en: 'Plane', isCorrect: false },
        { seed: 'point-train', ru: 'Поезд', kz: 'Пойыз', ja: '電車', en: 'Train', isCorrect: false },
      ],
    },
    {
      order: 5,
      question: {
        ru: 'Где красный цвет?',
        kz: 'Қызыл түс қайда?',
        ja: '赤色はどこ？',
        en: 'Where is the red color?',
      },
      options: [
        { seed: 'point-red', ru: 'Красный', kz: 'Қызыл', ja: '赤', en: 'Red', isCorrect: true },
        { seed: 'point-blue', ru: 'Синий', kz: 'Көк', ja: '青', en: 'Blue', isCorrect: false },
        { seed: 'point-yellow', ru: 'Жёлтый', kz: 'Сары', ja: '黄色', en: 'Yellow', isCorrect: false },
      ],
    },
    {
      order: 6,
      question: {
        ru: 'Где собака?',
        kz: 'Ит қайда?',
        ja: '犬はどこ？',
        en: 'Where is the dog?',
      },
      options: [
        { seed: 'point-dog-2', ru: 'Собака', kz: 'Ит', ja: '犬', en: 'Dog', isCorrect: true },
        { seed: 'point-cat-2', ru: 'Кошка', kz: 'Мысық', ja: '猫', en: 'Cat', isCorrect: false },
        { seed: 'point-rabbit', ru: 'Заяц', kz: 'Қоян', ja: 'うさぎ', en: 'Rabbit', isCorrect: false },
      ],
    },
    {
      order: 7,
      question: {
        ru: 'Где стул?',
        kz: 'Орындық қайда?',
        ja: '椅子はどこ？',
        en: 'Where is the chair?',
      },
      options: [
        { seed: 'point-chair', ru: 'Стул', kz: 'Орындық', ja: '椅子', en: 'Chair', isCorrect: true },
        { seed: 'point-table', ru: 'Стол', kz: 'Үстел', ja: '机', en: 'Table', isCorrect: false },
        { seed: 'point-bed', ru: 'Кровать', kz: 'Төсек', ja: 'ベッド', en: 'Bed', isCorrect: false },
      ],
    },
    {
      order: 8,
      question: {
        ru: 'Где солнце?',
        kz: 'Күн қайда?',
        ja: '太陽はどこ？',
        en: 'Where is the sun?',
      },
      options: [
        { seed: 'point-sun', ru: 'Солнце', kz: 'Күн', ja: '太陽', en: 'Sun', isCorrect: true },
        { seed: 'point-moon', ru: 'Луна', kz: 'Ай', ja: '月', en: 'Moon', isCorrect: false },
        { seed: 'point-star', ru: 'Звезда', kz: 'Жұлдыз', ja: '星', en: 'Star', isCorrect: false },
      ],
    },
    {
      order: 9,
      question: {
        ru: 'Где рука?',
        kz: 'Қол қайда?',
        ja: '手はどこ？',
        en: 'Where is the hand?',
      },
      options: [
        { seed: 'point-hand', ru: 'Рука', kz: 'Қол', ja: '手', en: 'Hand', isCorrect: true },
        { seed: 'point-leg', ru: 'Нога', kz: 'Аяқ', ja: '足', en: 'Leg', isCorrect: false },
        { seed: 'point-head', ru: 'Голова', kz: 'Бас', ja: '頭', en: 'Head', isCorrect: false },
      ],
    },
    {
      order: 10,
      question: {
        ru: 'Где большой мяч?',
        kz: 'Үлкен доп қайда?',
        ja: '大きいボールはどこ？',
        en: 'Where is the big ball?',
      },
      options: [
        { seed: 'point-ball-big', ru: 'Большой мяч', kz: 'Үлкен доп', ja: '大きいボール', en: 'Big ball', isCorrect: true },
        { seed: 'point-ball-small', ru: 'Маленький мяч', kz: 'Кіші доп', ja: '小さいボール', en: 'Small ball', isCorrect: false },
        { seed: 'point-cube', ru: 'Кубик', kz: 'Текше', ja: '積み木', en: 'Block', isCorrect: false },
      ],
    },
  ].map((item) => ({
    order: item.order,
    difficulty: 1,
    titleRu: item.question.ru,
    titleKz: item.question.kz,
    titleJa: item.question.ja,
    titleEn: item.question.en,
    instructionRu: item.question.ru,
    instructionKz: item.question.kz,
    instructionJa: item.question.ja,
    instructionEn: item.question.en,
    optionImages: item.options.map((option) => ({
      imageUrl: `https://picsum.photos/seed/${option.seed}/300`,
      isCorrect: option.isCorrect,
      labelRu: option.ru,
      labelKz: option.kz,
      labelJa: option.ja,
      labelEn: option.en,
    })),
  }));

  const listenAndPoint = await prisma.exerciseType.create({
    data: {
      slug: 'listen-and-point',
      icon: 'ear',
      nameRu: 'Слушай и покажи',
      nameKz: 'Тыңда және көрсет',
      nameJa: '聞いて指さそう',
      nameEn: 'Listen and Point',
      descriptionRu:
        'Аудирование — ребёнок слышит слово и выбирает правильную картинку',
      descriptionKz:
        'Тыңдап түсіну — бала сөзді естіп дұрыс суретті таңдайды',
      descriptionJa: '聴解 — 子供が言葉を聞いて正しい絵を選ぶ',
      descriptionEn:
        'Listening comprehension — the child hears a word and picks the right picture',
      exercises: { create: listenAndPointExercises },
    },
  });

  // ─────────────────────────────────────────────────────────
  // 4. Phrases / Tongue Twisters
  // ─────────────────────────────────────────────────────────
  const repeatInstruction = {
    ru: 'Повтори эту фразу медленно, а затем быстрее.',
    kz: 'Осы фразаны алдымен баяу, содан кейін жылдамырақ қайтала.',
    ja: 'このフレーズをゆっくり、それから少し速く繰り返してみよう。',
    en: 'Repeat this phrase slowly, then faster.',
  };

  const phrases = [
    {
      ru: 'Мама мыла раму. Мыла Мила маму.',
      kz: 'Екі ақ шымшық, үш ақ шымшық, төрт ақ шымшық, бес ақ шымшық.',
      ja: '生麦生米生卵（なまむぎ なまごめ なまたまご）',
      en: 'Peter Piper picked a peck of pickled peppers',
    },
    {
      ru: 'У ежа — ежата, у ужа — ужата.',
      kz: 'Пеш үстінде бес мысық, пеш ішінде бес мысық. Бес күзетші, бес пысық.',
      ja: 'すもももももももものうち',
      en: 'She sells seashells by the seashore',
    },
    {
      ru: 'Карл у Клары украл кораллы, а Клара у Карла украла кларнет.',
      kz: 'Ұшып кетті үш құс, ұшып келді ұшқыш.',
      ja: 'レモンもメロンも、ペロンと食べた',
      en: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    },
    {
      ru: 'Шла Саша по шоссе и сосала сушку.',
      kz: 'Есет атам ет асатар, ет асатса, бес асатар.',
      ja: '隣の客はよく柿食う客だ',
      en: 'Betty bought a bit of butter, but the butter Betty bought was bitter',
    },
    {
      ru: 'Ткёт ткач ткани на платки Тане.',
      kz: 'Аппақ, аппақ, бәрі аппақ, ақ қар аппақ, мақта да аппақ.',
      ja: 'どじょうにょろにょろ三にょろにょろ、合わせてにょろにょろ六にょろにょろ',
      en: 'Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair',
    },
    {
      ru: 'На дворе трава, на траве дрова. Не руби дрова на траве двора!',
      kz: 'Шеше, кеше неше сынды кесе?',
      ja: '赤巻き紙、青巻き紙、黄巻き紙',
      en: 'A big black bug bit a big black bear',
    },
    {
      ru: 'Купила бабуся бусы Марусе, на рынке бабуся бусы купила.',
      kz: 'Құнан қойды мал қайтарар болар ма?',
      ja: 'この子猫の子',
      en: 'Red lorry, yellow lorry',
    },
    {
      ru: 'Бобры храбры, для бобрят добры. Бобры храбры, идут в боры.',
      kz: 'Қызыл ара, қызыл ара, ызыңдап ұш, бізді арала.',
      ja: '坊主が屏風に上手に坊主の絵を描いた',
      en: 'I scream, you scream, we all scream for ice cream',
    },
    {
      ru: 'Ехал Грека через реку, видит Грека — в реке рак. Сунул Грека руку в реку, рак за руку Греку — цап!',
      kz: 'Ол аралда да марал, бұл аралда да марал. Жағалай орман, қара мал.',
      ja: 'バスガス爆発',
      en: 'Toy boat, toy boat, toy boat',
    },
    {
      ru: 'Из-под топота копыт пыль по полю летит.',
      kz: 'Торта қойдым, орта қойдым, жорта қойдым.',
      ja: '蛙ぴょこぴょこ三ぴょこぴょこ、合わせてぴょこぴょこ六ぴょこぴょこ',
      en: 'Unique New York, unique New York, unique New York',
    },
  ].map((phrase, index) => ({
    order: index + 1,
    durationSeconds: 30,
    difficulty: 2,
    titleRu: phrase.ru,
    titleKz: phrase.kz,
    titleJa: phrase.ja,
    titleEn: phrase.en,
    descriptionRu: phrase.ru,
    descriptionKz: phrase.kz,
    descriptionJa: phrase.ja,
    descriptionEn: phrase.en,
    instructionRu: repeatInstruction.ru,
    instructionKz: repeatInstruction.kz,
    instructionJa: repeatInstruction.ja,
    instructionEn: repeatInstruction.en,
  }));

  const phrasesType = await prisma.exerciseType.create({
    data: {
      slug: 'phrases',
      icon: 'quote',
      nameRu: 'Скороговорки',
      nameKz: 'Жаңылтпаштар',
      nameJa: '早口言葉',
      nameEn: 'Tongue Twisters',
      descriptionRu:
        'Короткие фразы и скороговорки для тренировки связной речи',
      descriptionKz:
        'Байланысты сөйлеуді дамытуға арналған қысқа сөйлемдер мен жаңылтпаштар',
      descriptionJa: 'つながった話し方を鍛える短いフレーズと早口言葉',
      descriptionEn:
        'Short phrases and tongue twisters to train connected speech',
      exercises: { create: phrases },
    },
  });

  // ─────────────────────────────────────────────────────────
  // 5. Rhythm and Syllables
  // ─────────────────────────────────────────────────────────
  const rhythmDescription = {
    ru: 'Учимся делить слово на слоги и прохлопывать его ритм.',
    kz: 'Сөзді буындарға бөліп, оның ырғағын шапалақтауды үйренеміз.',
    ja: '言葉を音節に分けて、そのリズムを手拍子で練習します。',
    en: 'Practice breaking a word into syllables and clapping its rhythm.',
  };

  const rhythmWords = [
    { ru: 'ма-ма', kz: 'а-на', ja: 'マ-マ', en: 'ma-ma', claps: 2 },
    { ru: 'па-па', kz: 'а-та', ja: 'パ-パ', en: 'pa-pa', claps: 2 },
    { ru: 'ля-ля-ля', kz: 'ла-ла-ла', ja: 'ラ-ラ-ラ', en: 'la-la-la', claps: 3 },
    { ru: 'ло-то', kz: 'қа-ла', ja: 'ね-こ', en: 'ca-t', claps: 2 },
    { ru: 'ма-ши-на', kz: 'ба-ла-лар', ja: 'さ-く-ら', en: 'ba-na-na', claps: 3 },
    { ru: 'ку-би-ки', kz: 'ме-ке-ме', ja: 'り-ん-ご', en: 'e-le-phant', claps: 3 },
    { ru: 'че-ре-па-ха', kz: 'ба-ла-пан-дар', ja: 'と-ま-と-す', en: 'wa-ter-mel-on', claps: 4 },
    { ru: 'то-то-то-то', kz: 'то-то-то-то', ja: 'ト-ト-ト-ト', en: 'to-to-to-to', claps: 4 },
    { ru: 'ры-ба', kz: 'ба-ла', ja: 'い-ぬ', en: 'dog-gy', claps: 2 },
    { ru: 'со-ба-ка', kz: 'үй-рек-тер', ja: 'く-る-ま', en: 'um-brel-la', claps: 3 },
  ];

  const rhythmSyllables = rhythmWords.map((word, index) => ({
    order: index + 1,
    durationSeconds: 20,
    difficulty: 1,
    titleRu: word.ru,
    titleKz: word.kz,
    titleJa: word.ja,
    titleEn: word.en,
    descriptionRu: rhythmDescription.ru,
    descriptionKz: rhythmDescription.kz,
    descriptionJa: rhythmDescription.ja,
    descriptionEn: rhythmDescription.en,
    instructionRu: `Прохлопай слово по слогам: ${word.ru} (${word.claps} хлопка).`,
    instructionKz: `Сөзді буындап шапалақта: ${word.kz} (${word.claps} рет шапалақ).`,
    instructionJa: `言葉を音節ごとに手を叩いてみよう: ${word.ja} (${word.claps}回手を叩く)。`,
    instructionEn: `Clap the word by syllables: ${word.en} (${word.claps} claps).`,
  }));

  const rhythmSyllablesType = await prisma.exerciseType.create({
    data: {
      slug: 'rhythm-syllables',
      icon: 'music',
      nameRu: 'Ритм и слоги',
      nameKz: 'Ырғақ пен буын',
      nameJa: 'リズムと音節',
      nameEn: 'Rhythm and Syllables',
      descriptionRu:
        'Слоговая структура слова — прохлопать или произнести по слогам',
      descriptionKz:
        'Сөздің буын құрылымы — буынды шапалақтап немесе айтып жаттығу',
      descriptionJa:
        '単語の音節構造 — 手を叩いたり音節ごとに発音したりする練習',
      descriptionEn:
        'Word syllable structure — clapping or saying syllables one by one',
      exercises: { create: rhythmSyllables },
    },
  });

  const anna = await prisma.specialist.create({
    data: {
      name: 'Анна Ковалёва',
      photoUrl: 'https://picsum.photos/seed/anna/200',
      bio: 'Логопед-дефектолог с 8-летним опытом работы с детьми дошкольного возраста.',
      address: 'ул. Абая, 12',
      city: 'Алматы',
      phone: '+7 701 111 2233',
      specializations: ['Speech therapist', 'Articulation'],
      lat: 43.238293,
      lng: 76.945465,
    },
  });

  const daniyar = await prisma.specialist.create({
    data: {
      name: 'Данияр Сериков',
      photoUrl: 'https://picsum.photos/seed/daniyar/200',
      bio: 'Специалист по коррекции речевого дыхания и заикания.',
      address: 'пр. Туран, 45',
      city: 'Астана',
      phone: '+7 701 444 5566',
      specializations: ['Speech therapist', 'Breathing therapy'],
      lat: 51.128207,
      lng: 71.430411,
    },
  });

  console.log('Seeded admin user:', admin.email);
  console.log(
    'Seeded AAC categories:',
    aacCategories.map((category) => category.nameEn).join(', '),
  );
  console.log(
    'Seeded exercise types:',
    [
      articulation.nameEn,
      breathing.nameEn,
      listenAndPoint.nameEn,
      phrasesType.nameEn,
      rhythmSyllablesType.nameEn,
    ].join(', '),
  );
  console.log('Seeded specialists:', anna.name, daniyar.name);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
