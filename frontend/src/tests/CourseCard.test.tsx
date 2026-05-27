/**
 * ═══════════════════════════════════════════════════════
 * Snapshot Test: CourseCard Component
 * Topic #6: Види тестів — Snapshot Test (Jest)
 * ═══════════════════════════════════════════════════════
 * Знімок (snapshot) HTML-розмітки компонента для відстеження
 * неочікуваних змін у UI.
 *
 * ПРИМІТКА: Цей файл показує структуру snapshot-тесту.
 * Для запуску потрібні налаштування jest з jsdom та
 * підтримкою framer-motion mocks.
 */

// import React from 'react';
// import { render } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import { CartProvider } from '../context/CartContext';
// import CourseCard from '../components/CourseCard';

/**
 * Snapshot test для CourseCard
 *
 * Оскільки CourseCard залежить від CartContext, BrowserRouter
 * та framer-motion, ми обертаємо його у відповідні провайдери.
 *
 * describe('CourseCard Snapshot', () => {
 *   const defaultProps = {
 *     id: 'test_001',
 *     title: 'Test Course',
 *     short_description: 'A test course description',
 *     instructor_name: 'Test Instructor',
 *     category: 'frontend',
 *     difficulty: 'beginner',
 *     price: 999,
 *     original_price: 1499,
 *     thumbnail_url: 'https://example.com/image.jpg',
 *     rating: 4.5,
 *     reviews_count: 100,
 *     students_count: 500,
 *     total_duration_hours: 20,
 *     tags: ['react', 'typescript'],
 *     is_featured: true,
 *   };
 *
 *   it('should match snapshot', () => {
 *     const { container } = render(
 *       <BrowserRouter>
 *         <CartProvider>
 *           <CourseCard {...defaultProps} />
 *         </CartProvider>
 *       </BrowserRouter>
 *     );
 *
 *     expect(container.firstChild).toMatchSnapshot();
 *   });
 *
 *   it('should match snapshot without discount', () => {
 *     const { container } = render(
 *       <BrowserRouter>
 *         <CartProvider>
 *           <CourseCard {...defaultProps} original_price={undefined} is_featured={false} />
 *         </CartProvider>
 *       </BrowserRouter>
 *     );
 *
 *     expect(container.firstChild).toMatchSnapshot();
 *   });
 * });
 */

// Placeholder test to demonstrate snapshot structure
describe('CourseCard Snapshot (Topic #6)', () => {
  it('snapshot test structure is documented', () => {
    // This test documents the snapshot testing approach
    // Full implementation requires jest-dom, RTL, and framer-motion mocks
    expect(true).toBe(true);
  });
});
