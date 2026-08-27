import Plus from "@/assets/icons/plus-status.svg";
import PlusIcon from "@/assets/icons/plus-add-status.svg";
import Image from "next/image";
import { TASK_STATUS } from "@/constants/tasks/statusConfig";
import TaskCard from "./TaskCard";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

interface StatusColumnProps {
  projectId: string;
  statusKey: (typeof TASK_STATUS)[number]["key"];
  count: number;
  tasks: Task[];
}

const StatusColumn = ({
  projectId,
  statusKey,
  count,
  tasks,
}: StatusColumnProps) => {
  const status = TASK_STATUS.find((s) => s.key === statusKey);

  if (!status) return null;
  return (
    <section className="w-full md:w-[228px] md:shrink-0">
      {/* Header */}
      <div className="flex w-full items-center justify-between h-[19px] px-1">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: status.dotColor }}
          />
          <span className="text-xs font-semibold uppercase text-neutral">
            {status.label}
          </span>
          <span className="w-[18px] h-[19px] shrink-0 flex items-center justify-center rounded-[2px] bg-[#E0E8FF] text-xs text-neutral-dark font-bold">
            {count}
          </span>
        </div>
        <Link
          href={`/project/${projectId}/tasks/new?status=${statusKey}`}
          type="button"
          className="cursor-pointer shrink-0"
        >
          <Image src={Plus} alt="" width={15} height={15} />
        </Link>
      </div>
      {/* Add New Task Button */}
      <Link
        href={`/project/${projectId}/tasks/new?status=${statusKey}`}
        className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#C3C6D64D] text-xs font-semibold uppercase tracking-wide text-[#43465499] whitespace-nowrap cursor-pointer"
      >
        <Image src={PlusIcon} alt="" width={15} height={15} />
        Add New Task
      </Link>

      {/* Task List */}
      <div className="mt-4 flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            dueDate={task.dueDate}
            assigneeInitials={task.assigneeInitials}
          />
        ))}
      </div>
    </section>
  );
};

export default StatusColumn;
