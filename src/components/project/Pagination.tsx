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

  return (
    <div className="flex items-center justify-between mt-8">
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
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            onClick={() => onPageChange(index + 1)}
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-title-md ${
              currentPage === index + 1
                ? "bg-primary text-surface"
                : "border border-surface-highest text-neutral-dark"
            }`}
          >
            {index + 1}
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
