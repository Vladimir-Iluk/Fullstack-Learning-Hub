import React from 'react';
import { motion } from 'framer-motion';
import './PlansPage.css';

const plans = [
  {
    id: 'free',
    name: 'Фріплан',
    price: 'Безкоштовно',
    description: 'Поточний план. Доступ до базових безкоштовних матеріалів.',
    features: ['Обмежений доступ до курсів', 'Спільнота', 'Базова підтримка'],
    buttonText: 'Поточний план',
    isPopular: false,
    btnClass: 'btn-outline',
  },
  {
    id: 'basic',
    name: 'Базовий план',
    price: '$10',
    period: '/міс',
    description: 'Ідеально для початківців, які хочуть більше практичних завдань.',
    features: ['Повний доступ до 5 курсів', 'Сертифікати про завершення', 'Пріоритетна підтримка', 'Доступ до коду проєктів'],
    buttonText: 'Оформити Базовий',
    isPopular: true,
    btnClass: 'btn-primary',
  },
  {
    id: 'premium',
    name: 'Преміум',
    price: '$100',
    period: '/рік',
    description: 'Все включено. Найкращий вибір для справжніх професіоналів.',
    features: ['Безлімітний доступ до всіх курсів', 'Менторські сесії 1-на-1', 'Перевірка домашніх завдань', 'Доступ до закритих вебінарів', 'Допомога з працевлаштуванням'],
    buttonText: 'Оформити Преміум',
    isPopular: false,
    btnClass: 'btn-secondary',
  },
];

const PlansPage: React.FC = () => {
  return (
    <motion.div
      className="plans-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="plans-header container">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Оберіть свій план навчання
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Інвестуйте у своє майбутнє. Доступ до найкращих матеріалів за вигідною ціною.
        </motion.p>
      </div>

      <div className="plans-container container">
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`plan-card glass-card ${plan.isPopular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              {plan.isPopular && <div className="popular-badge">Найпопулярніший</div>}
              
              <div className="plan-card-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  {plan.period && <span className="period">{plan.period}</span>}
                </div>
                <p className="plan-desc">{plan.description}</p>
              </div>

              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="plan-action">
                <button className={`btn ${plan.btnClass} w-full`}>
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlansPage;
