import ArrowLeft from "@/assets/icons/arrow_left.svg";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import Image from "next/image";

const StatisticsFilter = () => {
  return (
    <section className="flex items-center justify-between w-[960px] max-w-full h-[68px] bg-[#F1F3FF] rounded-[8px] p-4">
      {/* Date navigator */}
      <div className="flex items-center gap-3 h-6">
        <button
          type="button"
          aria-label="Previous week"
          className="text-gray-500"
        >
          <Image src={ArrowRight} alt="Next week" width={10} height={10} />
        </button>
        <span className="text-sm font-medium whitespace-nowrap">
          May 11 - May 17, 2025
        </span>
        <button type="button" aria-label="Next week">
          <Image src={ArrowLeft} alt="Previous week" width={10} height={10} />
        </button>
      </div>

      {/* Filters group */}
      <div className="flex items-center gap-4 h-9">
        <select className="h-9 w-[204px] rounded-[8px] bg-surface px-3 text-sm outline-none">
          <option>All Projects</option>
        </select>
        <select className="h-9 rounded-[8px] bg-surface px-3 text-sm outline-none">
          <option>All Statuses</option>
        </select>
      </div>
    </section>
  );
};

export default StatisticsFilter;
