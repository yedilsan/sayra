import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.aacCard.deleteMany();
  await prisma.aacCategory.deleteMany();
  await prisma.exerciseSession.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.exerciseType.deleteMany();

  const food = await prisma.aacCategory.create({
    data: {
      icon: 'food',
      order: 1,
      nameRu: 'Еда',
      nameKz: 'Тамақ',
      nameJa: '食べ物',
      nameEn: 'Food',
      cards: {
        create: [
          {
            order: 1,
            imageUrl: 'https://picsum.photos/seed/water/200',
            textRu: 'Вода',
            textKz: 'Су',
            textJa: '水',
            textEn: 'Water',
          },
          {
            order: 2,
            imageUrl: 'https://picsum.photos/seed/bread/200',
            textRu: 'Хлеб',
            textKz: 'Нан',
            textJa: 'パン',
            textEn: 'Bread',
          },
          {
            order: 3,
            imageUrl: 'https://picsum.photos/seed/apple/200',
            textRu: 'Яблоко',
            textKz: 'Алма',
            textJa: 'りんご',
            textEn: 'Apple',
          },
        ],
      },
    },
  });

  const feelings = await prisma.aacCategory.create({
    data: {
      icon: 'feelings',
      order: 2,
      nameRu: 'Чувства',
      nameKz: 'Сезімдер',
      nameJa: '気持ち',
      nameEn: 'Feelings',
      cards: {
        create: [
          {
            order: 1,
            imageUrl: 'https://picsum.photos/seed/happy/200',
            textRu: 'Счастлив',
            textKz: 'Бақытты',
            textJa: '幸せ',
            textEn: 'Happy',
          },
          {
            order: 2,
            imageUrl: 'https://picsum.photos/seed/sad/200',
            textRu: 'Грустно',
            textKz: 'Мұңды',
            textJa: '悲しい',
            textEn: 'Sad',
          },
          {
            order: 3,
            imageUrl: 'https://picsum.photos/seed/tired/200',
            textRu: 'Устал',
            textKz: 'Шаршадым',
            textJa: '疲れた',
            textEn: 'Tired',
          },
        ],
      },
    },
  });

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

  console.log('Seeded AAC categories:', food.nameEn, feelings.nameEn);
  console.log('Seeded exercise types:', articulation.nameEn, breathing.nameEn);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
