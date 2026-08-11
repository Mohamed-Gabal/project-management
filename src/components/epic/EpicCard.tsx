import EpicDot from "@/assets/icons/epicDot.svg";
import EpicDate from "@/assets/icons/epicDate.svg";
import EpicUser from "@/assets/icons/epicUser.svg";
import Image from "next/image";

interface EpicCardProps {
  epicId: string;
  title: string;
  assigneeName: string;
  assigneeInitials: string;
  createdBy: string;
  createdDate: string;
}

const EpicCard = ({
  epicId,
  title,
  assigneeName,
  assigneeInitials,
  createdBy,
  createdDate,
}: EpicCardProps) => {
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-lg bg-white md:min-h-[209px] md:border-l-4 md:border-l-[#004E32] shadow-card">
      <div className="flex min-h-[118px] w-full min-w-0 flex-col justify-between p-3 md:min-h-[209px] md:p-4">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          {/* Epic ID */}
          <span className="rounded-sm px-2 py-1 text-[10px] font-bold leading-none bg-[#DAE2FF] text-[#003D9B] md:bg-[#82F9BE] md:text-[#003D9B] md:text-[8px]">
            {epicId}
          </span>

          {/* Actions */}
          <button
            type="button"
            aria-label="Epic actions"
            className="flex h-4 w-4 shrink-0 items-center justify-center"
          >
            <Image src={EpicDot} alt="" width={5} height={5} />
          </button>
        </div>

        {/* Title */}
        <h3 className="w-full min-w-0 break-words text-[15px] font-semibold leading-[1.35] text-neutral-dark md:max-w-[432px] md:text-body-md md:leading-[1.4]">
          {title}
        </h3>

        {/* Assignee */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Avatar */}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003D9B] text-[10px] font-semibold text-white md:h-12 md:w-12 md:bg-[#82F9BE] md:text-[14px] md:text-neutral-dark">
            {assigneeInitials}
          </div>

          {/* Assignee Info */}
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-medium leading-[1.4] text-[#434654] md:text-label-sm">
              Assignee
            </span>

            <span className="truncate text-[10px] font-bold leading-[1.4] text-neutral-dark md:text-body-md">
              {assigneeName}
            </span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex min-w-0 items-center justify-between gap-2 border-t border-[#F1F3FF] pt-2 md:pt-3">
          {/* Created By */}
          <div className="flex min-w-0 items-center gap-1">
            <Image
              src={EpicUser}
              alt=""
              width={12}
              height={12}
              className="shrink-0 md:h-[14px] md:w-[14px]"
            />

            <span
              className="
                truncate text-[8px] font-bold leading-[1.4]
                md:text-body-md
              "
            >
              <span className="font-normal text-neutral">Created by:</span>
              {createdBy}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex shrink-0 items-center gap-1">
            <Image
              src={EpicDate}
              alt=""
              width={12}
              height={12}
              className="shrink-0 md:h-[14px] md:w-[14px]"
            />

            <span className="text-[8px] font-normal leading-[1.4] text-neutral md:text-body-md">
              {createdDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default EpicCard;
