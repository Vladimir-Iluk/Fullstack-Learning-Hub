/**
 * ═══════════════════════════════════════════════════════
 * Page: Course Details
 * Topic #10: useFetch custom hook
 * Topic #9:  React State (tab switching, events)
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFetch } from '../hooks/useFetch';
import { useCart, CartItem } from '../context/CartContext';

interface Lecture {
  _id: string;
  title: string;
  duration_minutes: number;
  is_free: boolean;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lectures: Lecture[];
}

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  short_description: string;
  instructor_name: string;
  category: string;
  difficulty: string;
  price: number;
  original_price?: number;
  thumbnail_url: string;
  rating: number;
  reviews_count: number;
  students_count: number;
  total_duration_hours: number;
  tags: string[];
  modules: Module[];
  is_featured: boolean;
}

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useFetch<{ course: CourseDetail }>(`/api/courses/${id}`);
  const { addItem, isInCart } = useCart();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const course = data?.course;
  const inCart = course ? isInCart(course._id) : false;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const handleAddToCart = () => {
    if (course && !inCart) {
      const item: CartItem = {
        id: course._id,
        title: course.title,
        price: course.price,
        original_price: course.original_price,
        thumbnail_url: course.thumbnail_url,
        instructor_name: course.instructor_name,
        category: course.category,
      };
      addItem(item);
    }
  };

  if (isLoading) {
    return (
      <div className="container section">
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '40px', width: '60%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '20px', width: '40%' }} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>Курс не знайдено</h3>
          <p>{error ?? 'Спробуйте повернутися до каталогу'}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            ← Каталог
          </Link>
        </div>
      </div>
    );
  }

  const totalLectures = course.modules?.reduce((sum, m) => sum + (m.lectures?.length ?? 0), 0) ?? 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(180deg, rgba(10,10,26,0.3) 0%, var(--color-bg-primary) 100%), url(${course.thumbnail_url}) center/cover`,
        padding: '60px 0 40px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'end' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{course.category}</span>
                <span className="badge badge-warning">{course.difficulty}</span>
                {course.is_featured && <span className="badge badge-success">⭐ Хіт</span>}
              </div>
              <h1 style={{ marginBottom: '12px' }}>{course.title}</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
                {course.short_description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
                <span className="stars" style={{ fontSize: '14px' }}>
                  {'★'.repeat(Math.round(course.rating))}{'☆'.repeat(5 - Math.round(course.rating))}
                  <span style={{ marginLeft: '4px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{course.rating}</span>
                  <span style={{ marginLeft: '4px' }}>({course.reviews_count} відгуків)</span>
                </span>
                <span>👥 {course.students_count.toLocaleString('uk-UA')} студентів</span>
                <span>⏱ {course.total_duration_hours}h</span>
                <span>📚 {totalLectures} лекцій</span>
              </div>
              <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Інструктор: <strong style={{ color: 'var(--color-text-accent)' }}>{course.instructor_name}</strong>
              </div>
            </motion.div>

            {/* Purchase Card */}
            <motion.div
              className="glass-card"
              style={{ padding: '24px', position: 'sticky', top: '96px' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div style={{ marginBottom: '20px' }}>
                <span className="price" style={{ fontSize: '28px' }}>{course.price} ₴</span>
                {course.original_price && course.original_price > course.price && (
                  <>
                    <span className="price-original" style={{ fontSize: '16px' }}>{course.original_price} ₴</span>
                    <span className="price-discount">
                      -{Math.round(((course.original_price - course.price) / course.original_price) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <button
                className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                style={{ width: '100%', marginBottom: '12px' }}
                onClick={handleAddToCart}
                disabled={inCart}
                id="course-add-to-cart"
              >
                {inCart ? '✓ В кошику' : '🛒 Додати до кошика'}
              </button>
              {inCart && (
                <Link to="/cart" className="btn btn-secondary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
                  Перейти до кошика →
                </Link>
              )}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📚 Лекцій:</span><span>{totalLectures}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>⏱ Тривалість:</span><span>{course.total_duration_hours} годин</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📊 Рівень:</span><span>{course.difficulty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📜 Сертифікат:</span><span style={{ color: 'var(--color-accent-emerald)' }}>✓ Так</span>
                </div>
              </div>
              <Link
                to={`/courses/${id}/quiz`}
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: '16px', textAlign: 'center' }}
              >
                📝 Пройти тест
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '0' }}>
          {(['overview', 'curriculum', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              className="btn btn-ghost"
              onClick={() => setActiveTab(tab)}
              style={{
                borderBottom: activeTab === tab ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
                borderRadius: 0,
                color: activeTab === tab ? 'var(--color-accent-tertiary)' : 'var(--color-text-tertiary)',
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab === 'overview' ? '📋 Огляд' : tab === 'curriculum' ? '📖 Програма' : '💬 Відгуки'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '16px' }}>Про курс</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '15px' }}>
              {course.description}
            </p>
            {course.tags?.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {course.tags.map((tag) => (
                  <span key={tag} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'curriculum' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ marginBottom: '16px' }}>Програма курсу</h2>
            {course.modules?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {course.modules.sort((a, b) => a.order - b.order).map((mod) => (
                  <div key={mod._id} className="glass-card" style={{ padding: '16px' }}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => toggleModule(mod._id)}
                    >
                      <h3 style={{ fontSize: '15px' }}>📁 {mod.title}</h3>
                      <span style={{
                        fontSize: '12px', color: 'var(--color-text-tertiary)',
                        transform: expandedModules.has(mod._id) ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        display: 'inline-block',
                      }}>▼</span>
                    </div>
                    {expandedModules.has(mod._id) && mod.lectures && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                        {mod.lectures.sort((a, b) => a.order - b.order).map((lec) => (
                          <div key={lec._id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '8px 0', fontSize: '13px',
                            borderBottom: '1px solid rgba(99,102,241,0.05)',
                          }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>
                              {lec.is_free ? '🔓' : '🔒'} {lec.title}
                            </span>
                            <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
                              {lec.duration_minutes} хв
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-tertiary)' }}>Програма ще не додана</p>
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <h3>Відгуки скоро з'являться</h3>
              <p>Поки тут порожньо — будьте першим!</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetailsPage;
