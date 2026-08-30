"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadTaskDetails } from "@/actions/task";
import CloseIcon from "@/assets/icons/close.svg";
import CalendarIcon from "@/assets/icons/epicDate.svg";
import LinkIcon from "@/assets/icons/copy.svg";
import { getInitials } from "@/lib/utils/getInitials";
import ProjectSkeleton from "../ui/ProjectSkeleton";

interface TaskDetailsModalProps {
  projectId: string;
  taskId: string;
  onClose: () => void;
}

type TaskDetailsStatus = "loading" | "success" | "error" | "empty";

interface TaskDetails {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
  status: string;
  epic_id?: string | null;
  epic_name?: string | null;
  assignee?: {
    name?: string;
    avatar?: string;
  } | null;
  reporter?: {
    name?: string;
    avatar?: string;
  } | null;
}

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status: string) => {
  return status.replaceAll("_", " ");
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-[#DBEAFE] text-[#1D4ED8]";

    case "DONE":
    case "COMPLETED":
      return "bg-[#DCFCE7] text-[#15803D]";

    case "BLOCKED":
      return "bg-[#FEE2E2] text-[#B91C1C]";

    case "TO_DO":
      return "bg-[#F1F5F9] text-[#475569]";

    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
};

// Small inline chevron — avoids depending on an external icon asset that may not exist.
const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 10 6" fill="none" className={className} aria-hidden="true">
    <path
      d="M1 1l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Small inline epic marker — same reasoning as ChevronIcon.
const EpicIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 10 10" fill="none" className={className} aria-hidden="true">
    <path d="M5 0L10 5L5 10L0 5Z" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const TaskDetailsModal = ({
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) => {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [status, setStatus] = useState<TaskDetailsStatus>("loading");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setStatus("loading");
      setTask(null);

      const result = await loadTaskDetails(projectId, taskId);

      if (!result.ok) {
        setStatus("error");
        return;
      }

      if (!result.data) {
        setStatus("empty");
        return;
      }

      setTask(result.data);
      setStatus("success");
    };

    fetchTaskDetails();
  }, [projectId, taskId]);

  // Close the modal when the user presses Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] sm:max-h-[870px] w-full sm:max-w-[896px] flex-col overflow-y-auto rounded-t-2xl bg-surface shadow sm:w-full sm:flex-row sm:overflow-hidden sm:rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {status === "loading" && <ProjectSkeleton />}

        {status === "error" && (
          <div className="w-full py-10 text-center text-sm text-red-500">
            Failed to load task details
          </div>
        )}

        {status === "empty" && (
          <div className="w-full py-10 text-center text-sm text-neutral">
            Task not found
          </div>
        )}

        {status === "success" && task && (
          <>
            {/* Drag handle — mobile bottom sheet only */}
            <div className="flex justify-center pt-2.5 sm:hidden">
              <span className="h-1 w-9 rounded-full bg-[#E4E7F5]" />
            </div>

            {/* ================= LEFT PANEL — Content & Metadata ================= */}
            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-8">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="inline-flex max-w-[160px] shrink-0 truncate rounded-sm bg-[#DAE2FF] px-2 py-1 text-[11px] font-bold text-[#3B4CCA]">
                    TASK-{task.id}
                  </span>

                  {/* Epic — desktop only, dropdown-styled per Figma */}
                  {task.epic_id && (
                    <button
                      type="button"
                      className="hidden max-w-[220px] cursor-pointer items-center gap-1.5 truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-1 text-[11px] font-medium text-neutral sm:inline-flex"
                    >
                      <EpicIcon className="h-2.5 w-2.5 shrink-0 text-neutral" />
                      <span className="truncate">
                        EPIC-{task.epic_id}
                        {task.epic_name ? ` (${task.epic_name})` : ""}
                      </span>
                      <ChevronIcon className="h-2 w-2 shrink-0 text-neutral" />
                    </button>
                  )}
                </div>

                {/* Close icon — mobile bottom sheet only, no close icon on desktop per design */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close task details"
                  className="shrink-0 cursor-pointer sm:hidden"
                >
                  <Image src={CloseIcon} alt="" width={20} height={20} />
                </button>
              </div>

              {/* Title */}
              <h2 className="mb-3 break-words text-body-md font-semibold leading-snug text-neutral-dark">
                {task.title}
              </h2>

              {/* Status + Epic badges — mobile only */}
              <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
                <span
                  className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusStyle(
                    task.status,
                  )}`}
                >
                  {formatStatus(task.status)}
                </span>

                {task.epic_id && (
                  <span className="inline-flex max-w-[160px] items-center gap-1 truncate rounded-sm border border-[#E4E7F5] px-2 py-1 text-[10px] font-medium text-neutral">
                    EPIC-{task.epic_id}
                  </span>
                )}
              </div>

              {/* Assignee / Created by / Due date / Created at — mobile grid only */}
              <div className="mb-4 grid grid-cols-2 gap-4 sm:hidden">
                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Assignee
                  </span>

                  {task.assignee?.name ? (
                    <div className="flex items-center gap-2">
                      {task.assignee.avatar ? (
                        <Image
                          src={task.assignee.avatar}
                          alt=""
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                          {getInitials(task.assignee.name)}
                        </div>
                      )}
                      <span className="truncate text-body-sm font-medium text-neutral-dark">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-body-sm text-[#8B8D98]">
                      Unassigned
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Due Date
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Image src={CalendarIcon} alt="" width={13} height={13} />
                    <span className="text-body-sm font-medium text-neutral-dark">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Created By
                  </span>

                  {task.reporter?.name ? (
                    <div className="flex items-center gap-2">
                      {task.reporter.avatar ? (
                        <Image
                          src={task.reporter.avatar}
                          alt=""
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
                          {getInitials(task.reporter.name)}
                        </div>
                      )}
                      <span className="truncate text-body-sm font-medium text-neutral-dark">
                        {task.reporter.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-body-sm text-[#8B8D98]">Unknown</span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                    Created At
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Image src={CalendarIcon} alt="" width={13} height={13} />
                    <span className="text-body-sm font-medium text-neutral-dark">
                      {formatDate(task.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 flex min-h-[80px] flex-1 flex-col gap-[11px] rounded-sm border border-[#E4E7F5] bg-white px-3 py-3 sm:bg-transparent sm:px-4">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Description
                </span>

                <p className="whitespace-pre-line break-words text-body-sm text-neutral">
                  {task.description || "No description provided"}
                </p>
              </div>

              {/* Footer — desktop only */}
              <div className="mt-auto hidden items-center justify-between border-t border-[#F1F3FF] bg-[#E8EDFF] p-4 py-2 sm:flex">
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-1.5 text-body-sm font-medium text-neutral hover:text-neutral-dark"
                >
                  <Image src={LinkIcon} alt="" width={18} height={18} />
                  Copy link
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-sm bg-[#D7E2FF] px-4 py-2 text-body-sm font-medium text-neutral-dark transition-all duration-300 hover:bg-[#E8EDFF]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* ================= RIGHT PANEL — Side Attributes (desktop only) ================= */}
            <div className="hidden w-[320px] shrink-0 flex-col gap-5 border-l border-[#E8EDFF] bg-[#F1F3FF] p-6 sm:flex">
              {/* Status — dropdown-styled button, colored fill, no border (matches Figma) */}
              <div>
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Status
                </span>

                <button
                  type="button"
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-[11px] font-bold uppercase ${getStatusStyle(
                    task.status,
                  )}`}
                >
                  {formatStatus(task.status)}
                  <ChevronIcon className="h-2.5 w-2.5" />
                </button>
              </div>

              {/* Assignee — dropdown-styled button, white fill + border, avatar + chevron */}
              <div className="min-w-0">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Assignee
                </span>

                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {task.assignee?.name ? (
                      <>
                        {task.assignee.avatar ? (
                          <Image
                            src={task.assignee.avatar}
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px] shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                            {getInitials(task.assignee.name)}
                          </div>
                        )}
                        <span className="truncate text-body-sm font-medium text-neutral-dark">
                          {task.assignee.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-body-sm text-[#8B8D98]">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <ChevronIcon className="h-2.5 w-2.5 shrink-0 text-neutral" />
                </button>
              </div>

              {/* Reporter — plain text, no dropdown styling in this design */}
              <div className="min-w-0">
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Reporter
                </span>

                {task.reporter?.name ? (
                  <div className="flex items-center gap-2">
                    {task.reporter.avatar ? (
                      <Image
                        src={task.reporter.avatar}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DAE2FF] text-[9px] font-semibold text-neutral-dark">
                        {getInitials(task.reporter.name)}
                      </div>
                    )}
                    <span className="truncate text-body-sm font-medium text-neutral-dark">
                      {task.reporter.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-body-sm text-[#8B8D98]">Unknown</span>
                )}
              </div>

              <div className="border-t border-white" />

              {/* Due Date — dropdown-styled button, same treatment as Assignee */}
              <div>
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Due Date
                </span>

                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2"
                >
                  <div className="flex items-center gap-1.5">
                    <Image src={CalendarIcon} alt="" width={13} height={13} />
                    <span className="text-body-sm font-medium text-neutral-dark">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                  <ChevronIcon className="h-2.5 w-2.5 shrink-0 text-neutral" />
                </button>
              </div>

              {/* Created At — inline label/value row, no border, no chevron, no icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
                  Created At
                </span>
                <span className="text-body-sm font-medium text-neutral-dark">
                  {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
