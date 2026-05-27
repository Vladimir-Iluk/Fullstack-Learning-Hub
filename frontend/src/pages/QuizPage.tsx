/**
 * ═══════════════════════════════════════════════════════
 * Page: Quiz — Interactive Knowledge Test
 * Topic #9: React State та робота з подіями
 * ═══════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'Що таке Virtual DOM у React?',
    options: [
      'Реальний DOM-елемент у браузері',
      'Легковісна копія реального DOM у пам\'яті',
      'CSS-фреймворк для стилізації',
      'Плагін для Node.js',
    ],
    correctIndex: 1,
    explanation: 'Virtual DOM — це JavaScript-об\'єкт, який є копією реального DOM. React використовує його для оптимізації оновлень UI через diffing algorithm.',
  },
  {
    id: 2,
    question: 'Яку команду використовує React Router v6 замість useHistory?',
    options: ['useRouter', 'useNavigation', 'useNavigate', 'useRedirect'],
    correctIndex: 2,
    explanation: 'У React Router v6 хук useHistory замінено на useNavigate. Він повертає функцію navigate() замість об\'єкта history.',
  },
  {
    id: 3,
    question: 'Який хук React замінює Redux для локального стейт-менеджменту?',
    options: ['useState', 'useReducer + useContext', 'useEffect', 'useMemo'],
    correctIndex: 1,
    explanation: 'Комбінація useReducer + useContext дозволяє створити глобальний стейт-менеджмент без зовнішніх бібліотек типу Redux.',
  },
  {
    id: 4,
    question: 'Для чого використовується React.memo?',
    options: [
      'Для кешування API-запитів',
      'Для запобігання непотрібним перерендерам компонента',
      'Для збереження стану між навігаціями',
      'Для асинхронного завантаження компонентів',
    ],
    correctIndex: 1,
    explanation: 'React.memo — це HOC (Higher-Order Component), який мемоїзує результат рендерингу компонента і перерендерює його лише при зміні пропсів.',
  },
  {
    id: 5,
    question: 'Яка структура бекенду використовує окремі папки для models, controllers, routes?',
    options: ['Singleton', 'Observer', 'MVC (Model-View-Controller)', 'Factory'],
    correctIndex: 2,
    explanation: 'MVC (Model-View-Controller) — архітектурний паттерн, де Model відповідає за дані, View за відображення, Controller за бізнес-логіку.',
  },
];

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = sampleQuestions[currentQuestion];

  // ── Topic #9: Event handlers ──
  const handleSelectAnswer = useCallback((index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  }, [isAnswered]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    if (selectedAnswer === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  }, [selectedAnswer, question.correctIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  }, []);

  // ── Finished screen ──
  if (isFinished) {
    const percentage = Math.round((score / sampleQuestions.length) * 100);
    return (
      <motion.div
        className="container section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '500px' }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
          </span>
          <h2 style={{ marginBottom: '8px' }}>Тест завершено!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Ваш результат:
          </p>
          <div style={{
            fontSize: '48px',
            fontWeight: 800,
            color: percentage >= 80 ? 'var(--color-accent-emerald)' : percentage >= 50 ? 'var(--color-accent-gold)' : 'var(--color-accent-rose)',
            marginBottom: '8px',
          }}>
            {score}/{sampleQuestions.length}
          </div>
          <p style={{ color: 'var(--color-text-tertiary)', marginBottom: '32px' }}>
            {percentage}% правильних відповідей
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRestart}>
              🔄 Пройти знову
            </button>
            <Link to={`/courses/${id}`} className="btn btn-secondary">
              ← Назад до курсу
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: '700px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '12px', display: 'inline-block' }}>
          📝 Тема #9 — React State & Events
        </span>
        <h1 style={{ marginBottom: '8px' }}>Перевірка знань</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            Питання {currentQuestion + 1} з {sampleQuestions.length}
          </span>
          <div style={{
            flex: 1,
            height: '4px',
            background: 'var(--color-bg-tertiary)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%`,
              height: '100%',
              background: 'var(--gradient-primary)',
              transition: 'width 0.3s ease',
              borderRadius: '2px',
            }} />
          </div>
          <span className="badge badge-success">{score} ✓</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          className="glass-card"
          style={{ padding: '32px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ fontSize: '18px', marginBottom: '24px', lineHeight: 1.5 }}>
            {question.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {question.options.map((option, index) => {
              let borderColor = 'var(--color-border)';
              let bg = 'transparent';

              if (isAnswered) {
                if (index === question.correctIndex) {
                  borderColor = 'var(--color-accent-emerald)';
                  bg = 'rgba(16, 185, 129, 0.1)';
                } else if (index === selectedAnswer && index !== question.correctIndex) {
                  borderColor = 'var(--color-accent-rose)';
                  bg = 'rgba(244, 63, 94, 0.1)';
                }
              } else if (index === selectedAnswer) {
                borderColor = 'var(--color-accent-primary)';
                bg = 'rgba(99, 102, 241, 0.1)';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  style={{
                    padding: '14px 18px',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    background: bg,
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span style={{ marginRight: '8px', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: selectedAnswer === question.correctIndex
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(244, 63, 94, 0.08)',
                border: `1px solid ${selectedAnswer === question.correctIndex
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(244, 63, 94, 0.2)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
              }}
            >
              <strong style={{
                color: selectedAnswer === question.correctIndex
                  ? 'var(--color-accent-emerald)' : 'var(--color-accent-rose)',
              }}>
                {selectedAnswer === question.correctIndex ? '✅ Правильно!' : '❌ Неправильно.'}
              </strong>
              <br />
              💡 {question.explanation}
            </motion.div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            {!isAnswered ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                id="submit-answer-btn"
              >
                Відповісти →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                id="next-question-btn"
              >
                {currentQuestion < sampleQuestions.length - 1 ? 'Далі →' : 'Завершити'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizPage;
