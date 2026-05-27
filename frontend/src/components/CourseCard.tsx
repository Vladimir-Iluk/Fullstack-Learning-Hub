/**
 * ═══════════════════════════════════════════════════════
 * Component: CourseCard (Memoized)
 * Topic #2:  Анімація (hover effects, Framer Motion)
 * Topic #15: React.memo (optimization)
 * ═══════════════════════════════════════════════════════
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useCart, CartItem } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CourseCard.css';

interface CourseCardProps {
  id: string;
  title: string;
  short_description?: string;
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
  tags?: string[];
  is_featured?: boolean;
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Початковий', color: 'var(--color-accent-emerald)' },
  intermediate: { label: 'Середній', color: 'var(--color-accent-gold)' },
  advanced: { label: 'Просунутий', color: 'var(--color-accent-rose)' },
};

const categoryLabels: Record<string, string> = {
  frontend: '🎨 Frontend',
  backend: '⚙️ Backend',
  fullstack: '🌐 Fullstack',
  devops: '🐳 DevOps',
  mobile: '📱 Mobile',
  'data-science': '📊 Data Science',
  design: '✏️ Design',
};

const CourseCard: React.FC<CourseCardProps> = memo(({
  id,
  title,
  short_description,
  instructor_name,
  category,
  difficulty,
  price,
  original_price,
  thumbnail_url,
  rating,
  reviews_count,
  students_count,
  total_duration_hours,
  is_featured,
}) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(id);
  const diffInfo = difficultyLabels[difficulty] ?? difficultyLabels.beginner;
  const discount = original_price && original_price > price
    ? Math.round(((original_price - price) / original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      const item: CartItem = {
        id,
        title,
        price,
        original_price,
        thumbnail_url,
        instructor_name,
        category,
      };
      addItem(item);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <motion.div
      className={`course-card glass-card ${is_featured ? 'featured' : ''}`}
      id={`course-card-${id}`}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/courses/${id}`} className="card-link">
        {/* Thumbnail */}
        <div className="card-thumbnail">
          <img
            src={thumbnail_url}
            alt={title}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop';
            }}
          />
          {discount > 0 && (
            <span className="card-discount-badge">-{discount}%</span>
          )}
          {is_featured && <span className="card-featured-badge">⭐ Хіт</span>}
          <div className="card-category-overlay">
            {categoryLabels[category] ?? category}
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          {short_description && (
            <p className="card-description">{short_description}</p>
          )}

          <div className="card-instructor">
            <span className="instructor-avatar">
              {instructor_name.charAt(0)}
            </span>
            <span className="instructor-name">{instructor_name}</span>
          </div>

          <div className="card-meta">
            <span className="card-rating">
              <span className="stars">{renderStars(rating)}</span>
              <span className="rating-value">{rating}</span>
              <span className="reviews-count">({reviews_count})</span>
            </span>
            <span className="card-students">
              👥 {students_count.toLocaleString('uk-UA')}
            </span>
          </div>

          <div className="card-details">
            <span className="detail-item">
              ⏱ {total_duration_hours}h
            </span>
            <span
              className="detail-item difficulty"
              style={{ color: diffInfo.color }}
            >
              {diffInfo.label}
            </span>
          </div>

          {/* Price & CTA */}
          <div className="card-footer">
            <div className="card-price-block">
              <span className="price">{price} ₴</span>
              {original_price && original_price > price && (
                <span className="price-original">{original_price} ₴</span>
              )}
            </div>
            <button
              className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={inCart}
              id={`add-to-cart-${id}`}
            >
              {inCart ? '✓ В кошику' : '+ Додати'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
