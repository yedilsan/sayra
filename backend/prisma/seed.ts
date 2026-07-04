import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Seeded AAC categories:', food.nameEn, feelings.nameEn);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
