import Search from "@/assets/icons/search.svg";
import Image from "next/image";
import ViewSwitcher from "./ViewSwitcher";

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
      <ViewSwitcher />
    </div>
  );
};

export default TasksToolBar;
