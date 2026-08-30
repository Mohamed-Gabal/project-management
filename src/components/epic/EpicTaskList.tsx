"use client";

import { useEpicTasks } from "@/hooks/useEpicTasks";
import { getInitials } from "@/lib/utils/getInitials";
import CalendarIcon from "@/assets/icons/epicDate.svg";
import unUser from "@/assets/icons/unUser.svg";
import plusAdd from "@/assets/icons/plus-add.svg";
import Image from "next/image";
import { useState } from "react";
import TaskDetailsModal from "../task/TaskDetailModal";

interface EpicTaskListProps {
  projectId: string;
  epicId: string;
}

const formatDueDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EpicTaskList = ({ epicId, projectId }: EpicTaskListProps) => {
  const { tasks, status } = useEpicTasks(epicId);

  const [selectedTask, setSelectedTask] = useState<
    (typeof tasks)[number] | null
  >(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-body-md font-bold text-neutral-dark uppercase">
          Tasks
        </h3>
        {/* Desktop only */}
        <button
          type="button"
          className="hidden text-body-sm font-semibold text-primary sm:block"
        >
          + Add Task
        </button>

        {/* Mobile only */}
        <span className="rounded-full bg-[#DAE2FF] px-2 py-1 text-[9px] font-semibold text-[#003D9B] sm:hidden">
          {tasks.length} TASKS
        </span>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 w-full animate-pulse rounded-sm bg-[#F1F3FF]"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="flex items-center justify-center rounded-sm bg-[#F1F3FF] py-8 text-center">
          <p className="text-body-sm text-red-500">Failed to load tasks</p>
        </div>
      )}

      {/* Empty state */}
      {status === "empty" && (
        <div className="flex items-center justify-center rounded-sm bg-[#F1F3FF] py-8 text-center">
          <p className="text-body-sm text-neutral">
            No tasks found for this epic
          </p>
        </div>
      )}

      {/* Success state - task list */}
      {status === "success" && (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="flex cursor-pointer items-center justify-between gap-4 border-b border-[#F1F3FF] px-3 py-3 transition-colors hover:bg-[#F8FAFC] sm:px-3 sm:py-4"
            >
              {/* Title */}
              <span className="block truncate text-body-sm font-medium text-neutral-dark">
                {task.title}
              </span>

              {/* Assignee + Due Date */}
              <div className="mt-2 flex items-center justify-between gap-3 sm:mt-1">
                {/* Assignee */}
                <div className="flex min-w-0 items-center gap-1.5">
                  {task.assignee?.name ? (
                    <>
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#82F9BE] text-[9px] font-semibold text-neutral-dark">
                        {getInitials(task.assignee.name)}
                      </div>

                      <span className="truncate text-[11px] text-neutral-dark">
                        {task.assignee.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Image src={unUser} alt="" width={15} height={15} />

                      <span className="text-[11px] text-[#8B8D98]">
                        Unassigned
                      </span>
                    </>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex shrink-0 items-center gap-1">
                  <Image src={CalendarIcon} alt="" width={12} height={12} />

                  <span className="whitespace-nowrap text-[11px] text-neutral">
                    {task.due_date ? formatDueDate(task.due_date) : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/* Mobile only */}
          <button
            type="button"
            className="mt-1 flex w-full items-center justify-center gap-2 border border-dashed border-[#E4E7F5] py-3 text-[10px] font-semibold uppercase tracking-wide text-[#8B8D98] sm:hidden"
          >
            <Image src={plusAdd} alt="" width={14} height={14} />
            Add New Task
          </button>
        </div>
      )}

      {/*  */}
      {selectedTask && (
        <TaskDetailsModal
          projectId={selectedTask.project_id}
          taskId={selectedTask.id}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default EpicTaskList;
