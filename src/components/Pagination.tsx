'use client';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Generate page numbers to display (current page + next 2)
  const pageNumbers = [];
  if (currentPage > 0) {
    for (let i = currentPage; i < currentPage + 3; i++) {
        pageNumbers.push(i);
    }
  }


  return (
    <div className="mt-12 flex items-center justify-center gap-2 sm:gap-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 font-semibold text-dark-space shadow-sm transition-all hover:border-tan hover:text-tan disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Number Buttons */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((pageNumber, index) => {
            // Only show the button if it's the current page or if there might be a next page
            if(pageNumber === currentPage || (hasNextPage || index < 2)){
                return (
                    <button 
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold shadow-sm transition-colors ${
                            pageNumber === currentPage 
                            ? 'bg-forest-green text-white' 
                            : 'bg-white text-dark-space hover:bg-gray-100'
                        }`}
                    >
                        {pageNumber}
                    </button>
                )
            }
            return null;
        })}
        
        {/* Ellipsis for more pages */}
        {hasNextPage && pageNumbers.length >= 3 && (
             <span className="flex h-10 w-10 items-center justify-center text-lg font-bold text-gray-400">
                ...
             </span>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-3 font-semibold text-dark-space shadow-sm transition-all hover:border-tan hover:text-tan disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        <span className="hidden sm:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

