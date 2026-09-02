"use client";

import Image from "next/image";

import CalendarIcon from "@/assets/icons/epicDate.svg";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectMember } from "@/types/member";

import { TaskDetailsData } from "./TaskDetailsSidebar";

interface Epic {
  id: string;
  epic_id: string;
  title: string;
}

interface TaskDetailsMobileMetaProps {
  task: TaskDetailsData;
  members: ProjectMember[];
  epics: Epic[];
  isUpdatingAssignee: boolean;
  isUpdatingEpic: boolean;
  isUpdatingDueDate: boolean;
  isUpdatingStatus: boolean;
  onAssigneeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onEpicChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDueDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Mobile-only task metadata and editable controls.
const TaskDetailsMobileMeta = ({
  task,
  members,
  epics,
  isUpdatingAssignee,
  isUpdatingEpic,
  isUpdatingDueDate,
  isUpdatingStatus,
  onAssigneeChange,
  onEpicChange,
  onDueDateChange,
  onStatusChange,
}: TaskDetailsMobileMetaProps) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 sm:hidden">
      {/* Status */}
      <div className="col-span-2">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Status
        </span>

        <select
          value={task.status}
          onChange={onStatusChange}
          disabled={isUpdatingStatus}
          className="w-full rounded-md border border-[#E4E7F5] bg-white px-2.5 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:opacity-60"
        >
          {[
            ["TO_DO", "TO DO"],
            ["IN_PROGRESS", "IN PROGRESS"],
            ["BLOCKED", "BLOCKED"],
            ["IN_REVIEW", "IN REVIEW"],
            ["READY_FOR_QA", "READY FOR QA"],
            ["REOPENED", "REOPENED"],
            ["READY_FOR_PRODUCTION", "READY FOR PRODUCTION"],
            ["DONE", "DONE"],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee */}
      <div className="min-w-0">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Assignee
        </span>

        <select
          value={task.assignee?.id ?? ""}
          onChange={onAssigneeChange}
          disabled={isUpdatingAssignee}
          className="w-full truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:opacity-60"
        >
          <option value="">Unassigned</option>

          {members.map((member) => (
            <option key={member.user_id} value={member.user_id}>
              {member.metadata.name}
            </option>
          ))}
        </select>
      </div>

      {/* Epic */}
      <div className="min-w-0">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Epic
        </span>

        <select
          value={task.epic_id ?? ""}
          onChange={onEpicChange}
          disabled={isUpdatingEpic}
          className="w-full truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:opacity-60"
        >
          <option value="">No Epic</option>

          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.epic_id} {epic.title}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div className="min-w-0">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Due Date
        </span>

        <input
          type="datetime-local"
          value={task.due_date ? task.due_date.slice(0, 16) : ""}
          onChange={onDueDateChange}
          disabled={isUpdatingDueDate}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full min-w-0 rounded-md border border-[#E4E7F5] bg-white px-2 py-2 text-body-sm font-medium text-neutral-dark outline-none disabled:opacity-60"
        />
      </div>

      {/* Created By */}
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

      {/* Created At */}
      <div className="min-w-0">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]">
          Created At
        </span>

        <div className="flex items-center gap-1.5">
          <Image src={CalendarIcon} alt="" width={13} height={13} />

          <span className="text-body-sm font-medium text-neutral-dark">
            {new Date(task.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsMobileMeta;
