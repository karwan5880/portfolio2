import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for handling pagination logic
 * @param {Array} items - Array of items to paginate
 * @param {number} initialItemsPerPage - Initial items per page (default: 14)
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (items, initialItemsPerPage = 14) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      paginatedItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages
    };
  }, [items, currentPage, itemsPerPage]);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Reset to last page if current page exceeds total pages
  useEffect(() => {
    const { totalPages } = paginationData;
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [paginationData.totalPages, currentPage]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Navigation functions
  const goToPage = (page) => {
    const { totalPages } = paginationData;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(paginationData.totalPages);

  return {
    // Current state
    currentPage,
    itemsPerPage,
    
    // Pagination data
    ...paginationData,
    
    // Actions
    setCurrentPage,
    setItemsPerPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    
    // Helpers
    shouldShowPagination: paginationData.totalPages > 1
  };
};