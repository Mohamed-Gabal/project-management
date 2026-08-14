"use client";

import { useEpicDetails } from "@/hooks/useEpicDetails";
import { getInitials } from "@/lib/utils/getInitials";
import EpicTitle from "@/assets/icons/epic.svg";
import CopyIcon from "@/assets/icons/copy.svg";
import CloseIcon from "@/assets/icons/close.svg";
import CalendarIcon from "@/assets/icons/epicDate.svg";
import Image from "next/image";
import EpicTaskList from "./EpicTaskList";

interface EpicDetailsModalProps {
  projectId: string;
  epicId: string;
  onClose: () => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EpicDetailsModal = ({
  projectId,
  epicId,
  onClose,
}: EpicDetailsModalProps) => {
  const { epic, status } = useEpicDetails(projectId, epicId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[672px] overflow-y-auto rounded-lg bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "loading" && (
          <p className="py-10 text-center text-body-sm text-neutral">
            Loading epic details...
          </p>
        )}

        {status === "error" && (
          <p className="py-10 text-center text-body-sm text-red-500">
            Failed to load epic details.
          </p>
        )}

        {status === "success" && epic && (
          <>
            {/* Header: Epic ID + Copy link + Close */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-bold text-neutral">
                <Image src={EpicTitle} alt="" width={20} height={20} />
                {epic.epic_id}
              </span>

              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="flex items-center gap-1 whitespace-nowrap text-[12px] font-medium text-neutral sm:text-[13px]"
                >
                  <Image src={CopyIcon} alt="" width={15} height={15} />
                  Copy link
                </button>
                <button
                  className="cursor-pointer"
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <Image src={CloseIcon} alt="" width={20} height={20} />
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-3 rounded-sm border border-[#E4E7F5] px-3 py-2.5 sm:mb-4 sm:px-4 sm:py-3">
              <span className="text-body-sm font-semibold text-neutral-dark sm:text-body-md">
                {epic.title}
              </span>
            </div>

            {/* Description */}
            <div className="mb-4 min-h-[64px] rounded-sm border border-[#E4E7F5] px-3 py-2.5 sm:mb-5 sm:min-h-[80px] sm:px-4 sm:py-3">
              <span className="text-body-sm text-neutral">
                {epic.description || "No description provided"}
              </span>
            </div>

            {/* Created By / Assignee / Deadline */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {/* Created By */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Created By
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003D9B] text-[10px] font-semibold text-white">
                    {getInitials(epic.created_by?.name ?? "")}
                  </div>
                  <span className="min-w-0 truncate text-body-sm font-medium text-neutral-dark">
                    {epic.created_by?.name ?? "Unknown"}
                  </span>
                </div>
              </div>

              {/* Assignee - display only, styled like the Figma select box */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Assignee
                </span>
                <div className="flex items-center gap-2 rounded-sm border border-[#E4E7F5] px-2.5 py-1.5">
                  {epic.assignee?.name ? (
                    <>
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                        {getInitials(epic.assignee.name)}
                      </div>
                      <span className="min-w-0 truncate text-body-sm font-medium text-neutral-dark">
                        {epic.assignee.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-body-sm font-medium text-[#8B8D98]">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline - display only, styled like the Figma select box */}
              <div className="min-w-0">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                  Deadline
                </span>
                <div className="flex items-center gap-1 rounded-sm border border-[#E4E7F5] px-2.5 py-1.5">
                  <Image src={CalendarIcon} alt="" width={13} height={13} />
                  <span className="whitespace-nowrap text-body-sm font-medium text-neutral-dark">
                    {epic.deadline ? formatDate(epic.deadline) : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="mb-4 border-b border-[#F1F3FF] pb-4 sm:mb-5">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98] sm:mb-2">
                Created At
              </span>
              <div className="flex items-center gap-1">
                <Image src={CalendarIcon} alt="" width={13} height={13} />
                <span className="whitespace-nowrap text-body-sm font-medium text-neutral-dark">
                  {formatDate(epic.created_at)}
                </span>
              </div>
            </div>

            {/* Epic Tasks */}
            <EpicTaskList epicId={epic.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default EpicDetailsModal;
