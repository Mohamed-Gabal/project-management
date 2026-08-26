import CalendarIcon from "@/assets/icons/epicDate.svg";
import Image from "next/image";

interface TaskCardProps {
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

const TaskCard = ({ title, dueDate, assigneeInitials }: TaskCardProps) => {
  return (
    <div className="flex w-[288px] min-h-[113px] flex-col justify-between rounded-lg border border-[#C3C6D61A] bg-surface p-4 shadow">
      <p className="text-sm font-medium text-neutral-dark line-clamp-2">
        {title}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <Image src={CalendarIcon} alt="" width={15} height={15} />
          <span>{dueDate}</span>
        </div>

        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0E8FF] text-[10px] font-bold">
          {assigneeInitials}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
