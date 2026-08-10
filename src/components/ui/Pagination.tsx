import ArrowLeft from "@/assets/icons/arrow_left.svg";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}: PaginationProps) => {
  // Calculate how many pages are needed
  const totalPages = Math.ceil(totalCount / limit);

  // Number of projects currently displayed on this page
  const showingCount = Math.min(currentPage * limit, totalCount);

  // Generate the pagination items that should be displayed
  const getPaginationItems = (currentPage: number, totalPages: number) => {
    // Store all pagination items (page numbers and dots)
    const pages: (number | string)[] = [];

    // Calculate the first page in the middle section
    const startPage = Math.max(currentPage - 1, 2);

    // Calculate the last page in the middle section
    const endPage = Math.min(currentPage + 1, totalPages - 1);

    // Always show the first page
    pages.push(1);

    // Show dots if there is a gap after the first page
    if (startPage > 2) {
      pages.push("...");
    }

    // Render all pages between startPage and endPage
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    // Show dots if there is a gap before the last page
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="hidden md:flex items-center justify-between mt-8">
      <span className="text-label-sm text-neutral">
        Showing {showingCount} of {totalCount} active projects
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-md border border-surface-highest text-neutral-light transition-opacity ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <Image src={ArrowRight} alt="ArrowRight" width={16} height={16} />
        </button>

        {/* Generate Pagination Buttons Dynamically Based On Total Page */}
        {paginationItems.map((item, index) => (
          <button
            key={index}
            disabled={item === "..."}
            onClick={() => {
              if (typeof item === "number") onPageChange(item);
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-title-md ${
              currentPage === index + 1
                ? "bg-primary text-surface"
                : "border border-surface-highest text-neutral-dark"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-md border border-surface-highest text-neutral-light transition-opacity ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <Image src={ArrowLeft} alt="ArrowRight" width={10} height={10} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
