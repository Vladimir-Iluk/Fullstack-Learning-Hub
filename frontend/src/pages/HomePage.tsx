/**
 * ═══════════════════════════════════════════════════════
 * Page: Home — Course Catalog with Pagination
 * Topic #9:  React State та робота з подіями
 * Topic #15: useMemo для фільтрації
 * Topic #19: Пагінація
 * ═══════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import Pagination from '../components/Pagination';
import { useFetch } from '../hooks/useFetch';
import './HomePage.css';

interface Course {
  _id: string;
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

interface CoursesResponse {
  courses: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const categories = [
  { value: '', label: '🌐 Усі' },
  { value: 'frontend', label: '🎨 Frontend' },
  { value: 'backend', label: '⚙️ Backend' },
  { value: 'fullstack', label: '🌐 Fullstack' },
  { value: 'devops', label: '🐳 DevOps' },
  { value: 'mobile', label: '📱 Mobile' },
  { value: 'data-science', label: '📊 Data Science' },
  { value: 'design', label: '✏️ Design' },
];

const sortOptions = [
  { value: 'newest', label: 'Нові' },
  { value: 'popular', label: 'Популярні' },
  { value: 'price_asc', label: 'Дешевші' },
  { value: 'price_desc', label: 'Дорожчі' },
  { value: 'rating', label: 'За рейтингом' },
];

const HomePage: React.FC = () => {
  // ── Topic #9: State management with events ──
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Build API query string ──
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: '6',
      sort: selectedSort,
    });
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    return params.toString();
  }, [currentPage, selectedCategory, selectedSort, searchQuery]);

  // ── Fetch courses (Topic #10: useFetch) ──
  const { data, isLoading, error } = useFetch<CoursesResponse>(
    `/api/courses?${queryString}`
  );

  // ── Event handlers (Topic #9) ──
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge badge badge-primary">🚀 Платформа для розробників</span>
            <h1 className="hero-title">
              Прокачай свої навички з{' '}
              <span className="gradient-text">DevHub LMS</span>
            </h1>
            <p className="hero-subtitle">
              Вивчайте React, Node.js, TypeScript та інші сучасні технології
              від найкращих інструкторів України
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">9+</span>
                <span className="stat-label">Курсів</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">15K+</span>
                <span className="stat-label">Студентів</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">21</span>
                <span className="stat-label">Тем</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-bar glass-card">
            {/* Search */}
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="input search-input"
                placeholder="Шукати курси..."
                value={searchQuery}
                onChange={handleSearchChange}
                id="search-input"
              />
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
              {categories.map(({ value, label }) => (
                <button
                  key={value}
                  className={`category-tab ${selectedCategory === value ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(value)}
                  id={`category-${value || 'all'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="sort-wrapper">
              <select
                className="input sort-select"
                value={selectedSort}
                onChange={handleSortChange}
                id="sort-select"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="courses-section">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card skeleton" style={{ height: '400px' }} />
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <h3>Не вдалося завантажити курси</h3>
              <p>{error}</p>
            </div>
          ) : data?.courses?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>Курсів не знайдено</h3>
              <p>Спробуйте змінити фільтри або пошуковий запит</p>
            </div>
          ) : (
            <>
              <div className="courses-header">
                <h2>
                  {selectedCategory
                    ? categories.find((c) => c.value === selectedCategory)?.label
                    : 'Усі курси'}
                </h2>
                <span className="courses-count">
                  {data?.pagination?.totalCount ?? 0} курсів
                </span>
              </div>
              <div className="grid grid-cols-3">
                {data?.courses?.map((course) => (
                  <CourseCard
                    key={course._id}
                    id={course._id}
                    title={course.title}
                    short_description={course.short_description}
                    instructor_name={course.instructor_name}
                    category={course.category}
                    difficulty={course.difficulty}
                    price={course.price}
                    original_price={course.original_price}
                    thumbnail_url={course.thumbnail_url}
                    rating={course.rating}
                    reviews_count={course.reviews_count}
                    students_count={course.students_count}
                    total_duration_hours={course.total_duration_hours}
                    tags={course.tags}
                    is_featured={course.is_featured}
                  />
                ))}
              </div>

              {/* Topic #19: Pagination */}
              {data?.pagination && (
                <Pagination
                  currentPage={data.pagination.currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
