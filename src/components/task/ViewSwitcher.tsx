"use client";

import Board from "@/assets/icons/board.svg";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ViewSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read the current view from the URL so the selected option stays synchronized with the page
  const currentView = searchParams.get("view") ?? "board";

  return (
    <div className="flex h-[38px] items-center gap-2 rounded-[4px] border border-[#C3C6D6]/20 bg-surface px-4 py-2">
      <Image src={Board} alt="" width={16} height={16} className="shrink-0" />

      <select
        value={currentView}
        // Update the URL when the user switches between Board and List views
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("view", event.target.value);

          router.push(`${pathname}?${params.toString()}`);
        }}
        className="h-full cursor-pointer bg-transparent text-sm font-medium text-neutral-dark outline-none"
      >
        <option value="board">Board View</option>
        <option value="list">List View</option>
      </select>
    </div>
  );
};

export default ViewSwitcher;
