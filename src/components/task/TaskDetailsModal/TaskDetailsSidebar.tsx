"use client";

import Image from "next/image";

import CalendarIcon from "@/assets/icons/epicDate.svg";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectMember } from "@/types/member";

export interface TaskDetailsData {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
  status: string;
  epic_id?: string | null;
  epic_name?: string | null;
  assignee?: {
    id?: string;
    name?: string;
    avatar?: string;
  } | null;
  reporter?: {
    name?: string;
    avatar?: string;
  } | null;
}

interface Epic {
  id: string;
  epic_id: string;
  title: string;
}

interface TaskDetailsSidebarProps {
  task: TaskDetailsData;
  members: ProjectMember[];
  epics: Epic[];
  isUpdatingAssignee: boolean;
  isUpdatingEpic: boolean;
  isUpdatingDueDate: boolean;
  isUpdatingStatus: boolean;
  isEditingAssignee: boolean;
  onAssigneeEdit: () => void;
  onAssigneeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onAssigneeBlur: () => void;
  onEpicChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDueDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const STATUS_OPTIONS = [
  { value: "TO_DO", label: "TO DO" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "BLOCKED", label: "BLOCKED" },
  { value: "IN_REVIEW", label: "IN REVIEW" },
  { value: "READY_FOR_QA", label: "READY FOR QA" },
  { value: "REOPENED", label: "REOPENED" },
  { value: "READY_FOR_PRODUCTION", label: "READY FOR PRODUCTION" },
  { value: "DONE", label: "DONE" },
];

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
};

// Desktop task attributes and editable controls.
const TaskDetailsSidebar = ({
  task,
  members,
  epics,
  isUpdatingAssignee,
  isUpdatingEpic,
  isUpdatingDueDate,
  isUpdatingStatus,
  isEditingAssignee,
  onAssigneeEdit,
  onAssigneeChange,
  onAssigneeBlur,
  onEpicChange,
  onDueDateChange,
  onStatusChange,
}: TaskDetailsSidebarProps) => {
  return (
    <div className="hidden w-[320px] shrink-0 flex-col gap-5 border-l border-[#E8EDFF] bg-[#F1F3FF] p-6 sm:flex">
      {/* Status */}
      <div>
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Status
        </span>

        <select
          value={task.status}
          onChange={onStatusChange}
          disabled={isUpdatingStatus}
          className={`w-full cursor-pointer rounded-md px-3 py-2.5 text-[11px] font-bold uppercase outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusStyle(
            task.status,
          )}`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee */}
      <div className="min-w-0">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Assignee
        </span>

        {isEditingAssignee ? (
          <select
            autoFocus
            value={task.assignee?.id ?? ""}
            onChange={onAssigneeChange}
            onBlur={onAssigneeBlur}
            disabled={isUpdatingAssignee}
            className="w-full cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Unassigned</option>

            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.metadata.name}
              </option>
            ))}
          </select>
        ) : (
          <button
            type="button"
            onClick={onAssigneeEdit}
            disabled={isUpdatingAssignee}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
          >
            {task.assignee?.name ? (
              <>
                {task.assignee.avatar ? (
                  <Image
                    src={task.assignee.avatar}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                    {getInitials(task.assignee.name)}
                  </div>
                )}

                <span className="truncate text-body-sm font-medium text-neutral-dark">
                  {task.assignee.name}
                </span>
              </>
            ) : (
              <span className="text-body-sm text-[#8B8D98]">Unassigned</span>
            )}
          </button>
        )}
      </div>

      {/* Reporter */}
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

      {/* Due Date */}
      <div>
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Due Date
        </span>

        <input
          type="datetime-local"
          value={task.due_date ? task.due_date.slice(0, 16) : ""}
          onChange={onDueDateChange}
          disabled={isUpdatingDueDate}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full cursor-pointer rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Created At */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Created At
        </span>

        <span className="text-body-sm font-medium text-neutral-dark">
          {formatDate(task.created_at)}
        </span>
      </div>
    </div>
  );
};

export default TaskDetailsSidebar;
