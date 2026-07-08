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

  const articulation = await prisma.exerciseType.create({
    data: {
      slug: 'articulation',
      icon: 'mouth',
      nameRu: 'Артикуляция',
      nameKz: 'Артикуляция',
      nameJa: '構音',
      nameEn: 'Articulation',
      descriptionRu: 'Упражнения для тренировки артикуляционного аппарата',
      descriptionKz:
        'Артикуляциялық аппаратты жаттықтыруға арналған жаттығулар',
      descriptionJa: '構音器官を鍛える練習',
      descriptionEn: 'Exercises to train the articulation apparatus',
      exercises: {
        create: [
          {
            order: 1,
            durationSeconds: 30,
            titleRu: 'Улыбка',
            titleKz: 'Күлкі',
            titleJa: '笑顔',
            titleEn: 'Smile',
            descriptionRu: 'Растягиваем губы в улыбке',
            descriptionKz: 'Ерінді күлкіге созу',
            descriptionJa: '唇を横に広げて笑顔を作る',
            descriptionEn: 'Stretch the lips into a smile',
            instructionRu: 'Улыбнись и удерживай улыбку 5 секунд',
            instructionKz: 'Күл және 5 секунд ұстап тұр',
            instructionJa: '笑顔を作り5秒間キープする',
            instructionEn: 'Smile and hold it for 5 seconds',
          },
          {
            order: 2,
            durationSeconds: 30,
            titleRu: 'Трубочка',
            titleKz: 'Түтікше',
            titleJa: 'チューブ',
            titleEn: 'Tube',
            descriptionRu: 'Вытягиваем губы вперёд трубочкой',
            descriptionKz: 'Ерінді алға қарай түтікше етіп созу',
            descriptionJa: '唇を前に突き出してチューブの形にする',
            descriptionEn: 'Push the lips forward into a tube shape',
            instructionRu: 'Вытяни губы вперёд и удерживай 5 секунд',
            instructionKz: 'Ерінді алға қарай соз және 5 секунд ұста',
            instructionJa: '唇を前に突き出して5秒間キープする',
            instructionEn: 'Push your lips forward and hold for 5 seconds',
          },
          {
            order: 3,
            durationSeconds: 40,
            titleRu: 'Лошадка',
            titleKz: 'Ат',
            titleJa: '馬',
            titleEn: 'Horse',
            descriptionRu: 'Цокаем языком, как лошадка копытами',
            descriptionKz: 'Тілді ат тұяғы сияқты шақылдату',
            descriptionJa: '舌を鳴らして馬の蹄の音を真似る',
            descriptionEn: 'Click the tongue like a horse hoof',
            instructionRu: 'Пощёлкай языком 10 раз',
            instructionKz: 'Тілді 10 рет шақылдат',
            instructionJa: '舌を10回鳴らす',
            instructionEn: 'Click your tongue 10 times',
          },
        ],
      },
    },
  });

  const breathing = await prisma.exerciseType.create({
    data: {
      slug: 'breathing',
      icon: 'lungs',
      nameRu: 'Дыхание',
      nameKz: 'Тыныс алу',
      nameJa: '呼吸',
      nameEn: 'Breathing',
      descriptionRu: 'Упражнения для развития речевого дыхания',
      descriptionKz: 'Сөйлеу тынысын дамытуға арналған жаттығулар',
      descriptionJa: '話すための呼吸を鍛える練習',
      descriptionEn: 'Exercises to develop speech breathing',
      exercises: {
        create: [
          {
            order: 1,
            durationSeconds: 30,
            titleRu: 'Свеча',
            titleKz: 'Шам',
            titleJa: 'ろうそく',
            titleEn: 'Candle',
            descriptionRu: 'Плавный выдох, как будто задуваем свечу',
            descriptionKz: 'Шам сөндіргендей тегіс дем шығару',
            descriptionJa: 'ろうそくを吹き消すようにゆっくり息を吐く',
            descriptionEn: 'Exhale slowly as if blowing out a candle',
            instructionRu: 'Сделай вдох и медленно выдохни через рот',
            instructionKz: 'Дем ал және аузыңмен баяу дем шығар',
            instructionJa: '息を吸って口からゆっくり吐く',
            instructionEn: 'Inhale, then slowly exhale through the mouth',
          },
          {
            order: 2,
            durationSeconds: 30,
            titleRu: 'Мыльные пузыри',
            titleKz: 'Сабын көпіршіктері',
            titleJa: 'シャボン玉',
            titleEn: 'Soap Bubbles',
            descriptionRu: 'Долгий выдох для выдувания пузырей',
            descriptionKz: 'Көпіршіктер үрлеу үшін ұзақ дем шығару',
            descriptionJa: '長く息を吐いてシャボン玉を作る',
            descriptionEn: 'Long exhale to blow bubbles',
            instructionRu: 'Вдохни глубоко и подуй в трубочку',
            instructionKz: 'Терең дем ал және түтікшеге үрле',
            instructionJa: '深く息を吸ってストローに吹く',
            instructionEn: 'Take a deep breath and blow through a straw',
          },
          {
            order: 3,
            durationSeconds: 40,
            titleRu: 'Ветерок',
            titleKz: 'Жел',
            titleJa: 'そよ風',
            titleEn: 'Breeze',
            descriptionRu: 'Прерывистый выдох короткими порциями',
            descriptionKz: 'Қысқа үзінділермен үзік-үзік дем шығару',
            descriptionJa: '短く区切って息を吐く',
            descriptionEn: 'Short, intermittent exhales',
            instructionRu: 'Подуй короткими толчками 5 раз',
            instructionKz: 'Қысқа импульстармен 5 рет үрле',
            instructionJa: '短く5回息を吹く',
            instructionEn: 'Blow in short bursts 5 times',
          },
        ],
      },
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
  console.log('Seeded exercise types:', articulation.nameEn, breathing.nameEn);
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
