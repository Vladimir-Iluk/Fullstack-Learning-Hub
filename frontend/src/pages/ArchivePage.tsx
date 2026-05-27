/**
 * ═══════════════════════════════════════════════════════
 * Page: Archive — Class-based Component Demo
 * Topic #1: Класовий підхід до побудови компонентів
 * ═══════════════════════════════════════════════════════
 * Цей модуль навмисно написаний на Class Components
 * для демонстрації "старого" підходу до React.
 */

import React, { Component } from 'react';
import { motion } from 'framer-motion';

// ── Types ──
interface Lecture {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface LectureCardProps {
  lecture: Lecture;
}

interface LectureCardState {
  isExpanded: boolean;
  readingTime: number;
  isReading: boolean;
}

/**
 * LectureCard — Class Component with lifecycle methods
 * Topic #1: componentDidMount, componentWillUnmount, setState
 */
class LectureCard extends Component<LectureCardProps, LectureCardState> {
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(props: LectureCardProps) {
    super(props);
    // ── Initial state in constructor (old pattern) ──
    this.state = {
      isExpanded: false,
      readingTime: 0,
      isReading: false,
    };
    // ── Bind methods (required in class components) ──
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  // ── Lifecycle: Component mounted ──
  componentDidMount(): void {
    console.log(`📚 LectureCard mounted: "${this.props.lecture.title}"`);
  }

  // ── Lifecycle: Component will be removed ──
  componentWillUnmount(): void {
    // Clean up timer to prevent memory leaks
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    console.log(`🗑️ LectureCard unmounted: "${this.props.lecture.title}"`);
  }

  toggleExpand(): void {
    const willExpand = !this.state.isExpanded;

    this.setState({ isExpanded: willExpand });

    if (willExpand) {
      // Start reading timer
      this.setState({ isReading: true, readingTime: 0 });
      this.timerInterval = setInterval(() => {
        this.setState((prevState) => ({
          readingTime: prevState.readingTime + 1,
        }));
      }, 1000);
    } else {
      // Stop reading timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.setState({ isReading: false });
    }
  }

  // ── Format seconds to mm:ss ──
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  render() {
    const { lecture } = this.props;
    const { isExpanded, readingTime, isReading } = this.state;

    return (
      <div
        className="glass-card"
        style={{
          padding: '20px',
          marginBottom: '16px',
          borderColor: isReading ? 'rgba(99, 102, 241, 0.4)' : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={this.toggleExpand}
        >
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>
              📄 {lecture.title}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
              {lecture.date}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isReading && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-accent-emerald)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
              }}>
                ⏱ {this.formatTime(readingTime)}
              </span>
            )}
            <span style={{
              fontSize: '18px',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
              display: 'inline-block',
            }}>
              ▼
            </span>
          </div>
        </div>

        {isExpanded && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
          }}>
            {lecture.content}
          </div>
        )}
      </div>
    );
  }
}

// ── Archive lectures data ──
const archiveLectures: Lecture[] = [
  {
    id: 1,
    title: 'Вступ до React: Virtual DOM та JSX',
    date: '15 січня 2023',
    content: 'React використовує Virtual DOM — легковісну копію реального DOM у пам\'яті. Коли стан компонента змінюється, React створює нове дерево Virtual DOM, порівнює його з попереднім (diffing algorithm) і оновлює лише ті елементи реального DOM, які дійсно змінилися. JSX — це синтаксичне розширення JavaScript, яке дозволяє писати HTML-подібний код прямо в JavaScript файлах. Babel компілює JSX у виклики React.createElement().',
  },
  {
    id: 2,
    title: 'Класові компоненти: State та Lifecycle',
    date: '22 січня 2023',
    content: 'До появи хуків у React 16.8, класові компоненти були єдиним способом використовувати стан та життєвий цикл. constructor() — ініціалізація стану. componentDidMount() — виконується після першого рендеру (ідеально для API-запитів). componentDidUpdate() — викликається після кожного оновлення. componentWillUnmount() — очищення ресурсів (таймери, підписки). setState() — єдиний правильний спосіб оновлення стану.',
  },
  {
    id: 3,
    title: 'Props та однонаправлений потік даних',
    date: '29 січня 2023',
    content: 'В React дані передаються зверху вниз через props (properties). Це називається "однонаправлений потік даних" (one-way data flow). Батьківський компонент передає дані дочірньому через атрибути JSX. Дочірній компонент не може змінювати props — вони є read-only. Якщо дочірньому компоненту потрібно повідомити батьківський про зміну, він викликає callback-функцію, передану через props.',
  },
  {
    id: 4,
    title: 'Обробка подій та форми',
    date: '5 лютого 2023',
    content: 'В React події іменуються у camelCase: onClick, onChange, onSubmit. Обробники подій отримують SyntheticEvent — обгортку React над нативними подіями браузера. Для форм використовуються "контрольовані компоненти" (controlled components), де значення поля зберігається у стані компонента і оновлюється через onChange.',
  },
];

/**
 * ArchivePage — wrapper (functional component using motion)
 */
const ArchivePage: React.FC = () => {
  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <span className="badge badge-warning" style={{ marginBottom: '16px', display: 'inline-block' }}>
            📦 Тема #1 — Класовий підхід
          </span>
          <h1>Архів лекцій</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', fontSize: '14px' }}>
            Цей модуль побудований на <strong>React Class Components</strong> з використанням
            lifecycle-методів для відстеження часу читання кожної лекції.
          </p>
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginTop: '16px',
            fontSize: '12px',
            color: 'var(--color-accent-gold)',
            fontFamily: 'var(--font-mono)',
          }}>
            ⚠️ Legacy Code • React.Component • componentDidMount • componentWillUnmount
          </div>
        </motion.div>

        {/* Render class-based LectureCards */}
        {archiveLectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} />
        ))}
      </div>
    </motion.div>
  );
};

export default ArchivePage;
