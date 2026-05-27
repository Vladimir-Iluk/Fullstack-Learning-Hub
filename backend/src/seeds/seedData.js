/**
 * ═══════════════════════════════════════════════════════
 * Database Seeder — Initial Course Data
 * Content Strategist: Realistic mock data for 8+ courses
 * ═══════════════════════════════════════════════════════
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectMongoDB } from '../config/mongodb.js';
import Course from '../models/Course.js';

const courses = [
  {
    title: 'React Advanced Patterns',
    description: 'Вивчіть просунуті патерни React: Compound Components, Render Props, HOC та кастомні хуки. Цей курс охоплює все, що потрібно для побудови масштабованих React-додатків.',
    short_description: 'Просунуті патерни React для масштабованих додатків',
    instructor_name: 'Олексій Шевченко',
    category: 'frontend',
    difficulty: 'advanced',
    price: 1299,
    original_price: 1999,
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    tags: ['react', 'hooks', 'patterns', 'typescript'],
    is_featured: true,
    rating: 4.8,
    reviews_count: 234,
    students_count: 1420,
    total_duration_hours: 28,
    modules: [
      {
        title: 'Вступ до патернів',
        order: 1,
        lectures: [
          { title: 'Чому патерни важливі', duration_minutes: 15, is_free: true, order: 1 },
          { title: 'Compound Components', duration_minutes: 45, order: 2 },
        ],
      },
      {
        title: 'Render Props & HOC',
        order: 2,
        lectures: [
          { title: 'Render Props патерн', duration_minutes: 40, order: 1 },
          { title: 'Higher-Order Components', duration_minutes: 35, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'Node.js & Express Masterclass',
    description: 'Повний курс з Node.js та Express.js. Від основ до побудови production-ready REST API з аутентифікацією, валідацією та обробкою помилок.',
    short_description: 'Побудуйте production-ready REST API з нуля',
    instructor_name: 'Марія Коваленко',
    category: 'backend',
    difficulty: 'intermediate',
    price: 999,
    original_price: 1499,
    thumbnail_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    tags: ['node.js', 'express', 'rest-api', 'mongodb'],
    is_featured: true,
    rating: 4.7,
    reviews_count: 189,
    students_count: 2100,
    total_duration_hours: 35,
    modules: [
      {
        title: 'Основи Node.js',
        order: 1,
        lectures: [
          { title: 'Event Loop та асинхронність', duration_minutes: 30, is_free: true, order: 1 },
          { title: 'Модульна система', duration_minutes: 25, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'TypeScript для React розробників',
    description: 'Навчіться використовувати TypeScript у React-проєктах. Типізація пропсів, хуків, контексту та інтеграція з популярними бібліотеками.',
    short_description: 'TypeScript + React = надійний код',
    instructor_name: 'Дмитро Бондаренко',
    category: 'frontend',
    difficulty: 'intermediate',
    price: 799,
    original_price: 1299,
    thumbnail_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    tags: ['typescript', 'react', 'generics', 'types'],
    rating: 4.9,
    reviews_count: 312,
    students_count: 1850,
    total_duration_hours: 22,
    modules: [
      {
        title: 'TypeScript Основи',
        order: 1,
        lectures: [
          { title: 'Типи та інтерфейси', duration_minutes: 35, is_free: true, order: 1 },
          { title: 'Generics', duration_minutes: 40, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'Docker & Kubernetes для розробників',
    description: 'Практичний курс з контейнеризації та оркестрації. Навчіться створювати Docker-образи, писати docker-compose та деплоїти у Kubernetes.',
    short_description: 'Контейнеризація від нуля до production',
    instructor_name: 'Андрій Мельник',
    category: 'devops',
    difficulty: 'intermediate',
    price: 1499,
    original_price: 2299,
    thumbnail_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
    tags: ['docker', 'kubernetes', 'devops', 'ci-cd'],
    is_featured: true,
    rating: 4.6,
    reviews_count: 156,
    students_count: 980,
    total_duration_hours: 30,
    modules: [
      {
        title: 'Docker Fundamentals',
        order: 1,
        lectures: [
          { title: 'Що таке контейнери?', duration_minutes: 20, is_free: true, order: 1 },
          { title: 'Dockerfile та образи', duration_minutes: 45, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'Fullstack JavaScript: від ідеї до деплою',
    description: 'Комплексний курс з побудови повноцінного веб-додатку: React фронтенд, Node.js бекенд, PostgreSQL + MongoDB, аутентифікація та деплой.',
    short_description: 'Побудуйте повноцінний додаток від А до Я',
    instructor_name: 'Олексій Шевченко',
    category: 'fullstack',
    difficulty: 'advanced',
    price: 1999,
    original_price: 2999,
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    tags: ['fullstack', 'react', 'node.js', 'postgresql', 'mongodb'],
    is_featured: true,
    rating: 4.9,
    reviews_count: 445,
    students_count: 3200,
    total_duration_hours: 60,
    modules: [
      {
        title: 'Планування проєкту',
        order: 1,
        lectures: [
          { title: 'Архітектура додатку', duration_minutes: 25, is_free: true, order: 1 },
          { title: 'Дизайн бази даних', duration_minutes: 30, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'MongoDB & Mongoose: від основ до агрегацій',
    description: 'Глибоке занурення у MongoDB: CRUD операції, індекси, агрегаційний пайплайн, схеми Mongoose та оптимізація запитів.',
    short_description: 'Станьте експертом MongoDB',
    instructor_name: 'Марія Коваленко',
    category: 'backend',
    difficulty: 'beginner',
    price: 699,
    original_price: 999,
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
    tags: ['mongodb', 'mongoose', 'nosql', 'aggregation'],
    rating: 4.5,
    reviews_count: 198,
    students_count: 1560,
    total_duration_hours: 18,
    modules: [
      {
        title: 'Основи MongoDB',
        order: 1,
        lectures: [
          { title: 'Встановлення та перші кроки', duration_minutes: 20, is_free: true, order: 1 },
          { title: 'CRUD операції', duration_minutes: 35, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'React Native: мобільна розробка',
    description: 'Створюйте крос-платформні мобільні додатки з React Native. Navigation, state management, нативні модулі та публікація у App Store та Google Play.',
    short_description: 'Мобільні додатки на React Native',
    instructor_name: 'Дмитро Бондаренко',
    category: 'mobile',
    difficulty: 'intermediate',
    price: 1199,
    original_price: 1799,
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    tags: ['react-native', 'mobile', 'ios', 'android'],
    rating: 4.4,
    reviews_count: 142,
    students_count: 870,
    total_duration_hours: 25,
    modules: [
      {
        title: 'Початок роботи',
        order: 1,
        lectures: [
          { title: 'Налаштування середовища', duration_minutes: 30, is_free: true, order: 1 },
        ],
      },
    ],
  },
  {
    title: 'UI/UX Design для розробників',
    description: 'Навчіться основам дизайну інтерфейсів: колірні палітри, типографіка, сітки, доступність та прототипування у Figma.',
    short_description: 'Дизайн інтерфейсів без Figma-фобії',
    instructor_name: 'Анна Литвиненко',
    category: 'design',
    difficulty: 'beginner',
    price: 599,
    original_price: 899,
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    tags: ['ui', 'ux', 'figma', 'design-system'],
    rating: 4.7,
    reviews_count: 267,
    students_count: 2040,
    total_duration_hours: 15,
    modules: [
      {
        title: 'Основи візуального дизайну',
        order: 1,
        lectures: [
          { title: 'Кольори та контраст', duration_minutes: 20, is_free: true, order: 1 },
          { title: 'Типографіка', duration_minutes: 25, order: 2 },
        ],
      },
    ],
  },
  {
    title: 'Python для Data Science',
    description: 'Вступ до аналізу даних з Python. Pandas, NumPy, візуалізація з Matplotlib та Seaborn, основи машинного навчання з scikit-learn.',
    short_description: 'Аналіз даних та ML з Python',
    instructor_name: 'Ірина Ткачук',
    category: 'data-science',
    difficulty: 'beginner',
    price: 899,
    original_price: 1399,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: ['python', 'data-science', 'pandas', 'machine-learning'],
    rating: 4.6,
    reviews_count: 321,
    students_count: 2780,
    total_duration_hours: 32,
    modules: [
      {
        title: 'Python Basics',
        order: 1,
        lectures: [
          { title: 'Змінні та типи даних', duration_minutes: 25, is_free: true, order: 1 },
        ],
      },
    ],
  },
];

const seedCourses = async () => {
  try {
    await connectMongoDB();

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Existing courses cleared');

    // Insert seed data
    const created = [];
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      created.push(course);
    }
    console.log(`✅ ${created.length} courses seeded successfully!`);

    created.forEach((course) => {
      console.log(`   📚 ${course.title} — ${course.price} ${course.currency}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedCourses();
