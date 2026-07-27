import ArrowLeft from "@/assets/icons/arrow_left.svg";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import Image from "next/image";

const Pagination = () => {
  return (
    <div className="flex items-center justify-between mt-8">
      <span className="text-label-sm text-neutral">
        Showing 5 of 24 active projects
      </span>

      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-surface-highest text-neutral-light">
          <Image src={ArrowRight} alt="ArrowRight" width={16} height={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-surface text-title-md">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-surface-highest text-neutral-dark text-title-md">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-surface-highest text-neutral-light">
          <Image src={ArrowLeft} alt="ArrowRight" width={10} height={10} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
