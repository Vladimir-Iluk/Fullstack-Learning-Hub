/**
 * ═══════════════════════════════════════════════════════
 * CartContext — State Management with useReducer
 * Topic #5: Заміна Redux хуками (Context + useReducer)
 * Topic #9: React State та робота з подіями
 * ═══════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// ── Types ──
export interface CartItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail_url: string;
  instructor_name: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalPrice: number;
  totalItems: number;
  isInCart: (id: string) => boolean;
}

// ── Initial State ──
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// ── Reducer (Topic #5: replaces Redux) ──
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Prevent duplicates (courses can only be purchased once)
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

// ── Create Context ──
const CartContext = createContext<CartContextType | undefined>(undefined);

// ── Provider Component ──
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ── Action creators (memoized with useCallback) ──
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  // ── Derived state (Topic #15: useMemo optimization) ──
  const totalPrice = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price, 0),
    [state.items]
  );

  const totalItems = useMemo(() => state.items.length, [state.items]);

  const isInCart = useCallback(
    (id: string) => state.items.some((item) => item.id === id),
    [state.items]
  );

  const value = useMemo(
    () => ({
      state,
      addItem,
      removeItem,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
      totalPrice,
      totalItems,
      isInCart,
    }),
    [state, addItem, removeItem, clearCart, toggleCart, openCart, closeCart, totalPrice, totalItems, isInCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ── Custom Hook: useCart ──
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
