import { useTheme } from "../hooks/useTheme";

const IconPagination = ({ currentPage, totalPages, onPageChange }) => {
  const { getThemeClasses } = useTheme();

  // Don't render if only one page
  if (totalPages <= 1) return null;

  // Helper function to calculate which page numbers to show
  const getVisiblePageNumbers = () => {
    const maxVisiblePages = 5;

    // If we have 5 or fewer pages, show them all
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the range of pages to show (always 5 pages)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  // Helper function to get button styles
  const getNavigationButtonStyles = (isDisabled) => {
    if (isDisabled) {
      return `p-2 rounded ${getThemeClasses("textMuted")} cursor-not-allowed`;
    }
    return `p-2 rounded ${getThemeClasses(
      "buttonSecondary"
    )} hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  const getPageButtonStyles = (pageNumber) => {
    const isCurrentPage = currentPage === pageNumber;
    const baseStyles = "px-3 py-2 text-sm rounded";

    if (isCurrentPage) {
      return `${baseStyles} ${getThemeClasses("button")}`;
    }
    return `${baseStyles} ${getThemeClasses("buttonSecondary")}`;
  };

  // Navigation handlers
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => onPageChange(totalPages);

  // Check if navigation buttons should be disabled
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`${getThemeClasses("header")} border-t px-4 py-3`}>
      <div className="flex justify-center items-center gap-1">
        {/* First Page Button */}
        <button
          onClick={goToFirstPage}
          disabled={isFirstPage}
          className={getNavigationButtonStyles(isFirstPage)}
          title="First page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Previous Page Button */}
        <button
          onClick={goToPreviousPage}
          disabled={isFirstPage}
          className={getNavigationButtonStyles(isFirstPage)}
          title="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {/* Mobile: Show current/total */}
          <div className="sm:hidden">
            <span className={`px-3 py-2 text-sm ${getThemeClasses("text")}`}>
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Desktop: Show page number buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={getPageButtonStyles(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Next Page Button */}
        <button
          onClick={goToNextPage}
          disabled={isLastPage}
          className={getNavigationButtonStyles(isLastPage)}
          title="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Last Page Button */}
        <button
          onClick={goToLastPage}
          disabled={isLastPage}
          className={getNavigationButtonStyles(isLastPage)}
          title="Last page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IconPagination;
