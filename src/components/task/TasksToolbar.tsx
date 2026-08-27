import Search from "@/assets/icons/search.svg";
import Board from "@/assets/icons/board.svg";
import Image from "next/image";

const TasksToolBar = () => {
  return (
    <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
      {/* Search Input */}
      <div className="relative flex h-10 w-full max-w-[256px] items-center rounded-md bg-[#D7E2FF] px-3">
        <Image
          src={Search}
          alt=""
          width={16}
          height={16}
          className="shrink-0"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          className="h-full w-full bg-transparent px-2 text-sm outline-none placeholder:text-[#9CA3AF]"
        />
      </div>

      {/* View Switcher */}
      <div className="flex h-[38px] items-center gap-2 rounded-[4px] border border-[#C3C6D6]/20 bg-surface px-4 py-2">
        <Image src={Board} alt="" width={16} height={16} className="shrink-0" />
        <select className="h-full bg-transparent text-sm font-medium text-neutral-dark outline-none cursor-pointer">
          <option>Board View</option>
          <option>List View</option>
        </select>
      </div>
    </div>
  );
};

export default TasksToolBar;
