/**
 * ═══════════════════════════════════════════════════════
 * Unit Test: Cart Reducer
 * Topic #6: Види тестів — Unit Test (Jest)
 * ═══════════════════════════════════════════════════════
 * Тестуємо чисту логіку cartReducer без рендерингу React.
 */

import { cartReducer, CartItem } from '../context/CartContext';

// ── Test Data ──
const mockCourse: CartItem = {
  id: 'course_001',
  title: 'React Advanced Patterns',
  price: 1299,
  original_price: 1999,
  thumbnail_url: 'https://example.com/image.jpg',
  instructor_name: 'Олексій Шевченко',
  category: 'frontend',
};

const mockCourse2: CartItem = {
  id: 'course_002',
  title: 'Node.js Masterclass',
  price: 999,
  thumbnail_url: 'https://example.com/image2.jpg',
  instructor_name: 'Марія Коваленко',
  category: 'backend',
};

const emptyState = {
  items: [],
  isOpen: false,
};

// ═══════════════════════════════════════════════════════
// Test Suite: Cart Reducer
// ═══════════════════════════════════════════════════════
describe('cartReducer', () => {
  // ── ADD_ITEM ──
  describe('ADD_ITEM', () => {
    it('should add a course to empty cart', () => {
      const result = cartReducer(emptyState, {
        type: 'ADD_ITEM',
        payload: mockCourse,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('course_001');
      expect(result.items[0].title).toBe('React Advanced Patterns');
    });

    it('should add multiple different courses', () => {
      const stateWithOne = cartReducer(emptyState, {
        type: 'ADD_ITEM',
        payload: mockCourse,
      });

      const result = cartReducer(stateWithOne, {
        type: 'ADD_ITEM',
        payload: mockCourse2,
      });

      expect(result.items).toHaveLength(2);
    });

    it('should NOT add duplicate course', () => {
      const stateWithOne = cartReducer(emptyState, {
        type: 'ADD_ITEM',
        payload: mockCourse,
      });

      const result = cartReducer(stateWithOne, {
        type: 'ADD_ITEM',
        payload: mockCourse,
      });

      expect(result.items).toHaveLength(1);
    });

    it('should not mutate original state (immutability check)', () => {
      const originalState = { items: [], isOpen: false };
      cartReducer(originalState, { type: 'ADD_ITEM', payload: mockCourse });

      expect(originalState.items).toHaveLength(0);
    });
  });

  // ── REMOVE_ITEM ──
  describe('REMOVE_ITEM', () => {
    it('should remove a course from cart by ID', () => {
      const stateWith2 = {
        items: [mockCourse, mockCourse2],
        isOpen: false,
      };

      const result = cartReducer(stateWith2, {
        type: 'REMOVE_ITEM',
        payload: 'course_001',
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('course_002');
    });

    it('should handle removing from empty cart gracefully', () => {
      const result = cartReducer(emptyState, {
        type: 'REMOVE_ITEM',
        payload: 'non_existent',
      });

      expect(result.items).toHaveLength(0);
    });
  });

  // ── CLEAR_CART ──
  describe('CLEAR_CART', () => {
    it('should remove all items from cart', () => {
      const stateWith2 = {
        items: [mockCourse, mockCourse2],
        isOpen: true,
      };

      const result = cartReducer(stateWith2, { type: 'CLEAR_CART' });

      expect(result.items).toHaveLength(0);
    });
  });

  // ── TOGGLE_CART ──
  describe('TOGGLE_CART', () => {
    it('should toggle cart open state', () => {
      const result1 = cartReducer(emptyState, { type: 'TOGGLE_CART' });
      expect(result1.isOpen).toBe(true);

      const result2 = cartReducer(result1, { type: 'TOGGLE_CART' });
      expect(result2.isOpen).toBe(false);
    });
  });

  // ── OPEN_CART / CLOSE_CART ──
  describe('OPEN_CART / CLOSE_CART', () => {
    it('should open cart', () => {
      const result = cartReducer(emptyState, { type: 'OPEN_CART' });
      expect(result.isOpen).toBe(true);
    });

    it('should close cart', () => {
      const openState = { ...emptyState, isOpen: true };
      const result = cartReducer(openState, { type: 'CLOSE_CART' });
      expect(result.isOpen).toBe(false);
    });
  });

  // ── Default case ──
  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const result = cartReducer(emptyState, { type: 'UNKNOWN' as any });
      expect(result).toEqual(emptyState);
    });
  });
});
