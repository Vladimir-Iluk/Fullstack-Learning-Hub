/**
 * ═══════════════════════════════════════════════════════
 * Component: Pagination
 * Topic #19: Пагінація (посторінковий вивід)
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  return (
    <nav className="pagination" id="pagination" aria-label="Навігація по сторінках">
      <button
        className="pagination-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Попередня сторінка"
      >
        ← Назад
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={page}
              className={`pagination-btn page ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={`dots-${index}`} className="pagination-dots">
              {page}
            </span>
          )
        )}
      </div>

      <button
        className="pagination-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Наступна сторінка"
      >
        Далі →
      </button>
    </nav>
  );
};

export default Pagination;
