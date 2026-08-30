"use client";

import { useRouter } from "next/navigation";
import Pagination from "@/components/ui/Pagination";
import TaskMobileList from "@/components/task/TaskMobileList";
import { useState } from "react";
import TaskDetailsModal from "./TaskDetailModal";

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  assignee: string;
}

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  currentPage: number;
  totalCount: number;
  limit: number;
}

const TaskList = ({
  projectId,
  tasks,
  currentPage,
  totalCount,
  limit,
}: TaskListProps) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    // Update the page in the URL so the Server Component fetches the selected page
    router.push(`/project/${projectId}/tasks?view=list&page=${page}`);
  };

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Desktop: Task Table + Pagination */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-surface">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-[#F8FAFC]">
                <tr className="h-[32px]">
                  <th className="px-4 text-left text-[9px] font-bold uppercase text-[#64748B]">
                    Task ID
                  </th>

                  <th className="px-4 text-left text-[9px] font-bold uppercase text-[#64748B]">
                    Title
                  </th>

                  <th className="px-4 text-left text-[9px] font-bold uppercase text-[#64748B]">
                    Status
                  </th>

                  <th className="px-4 text-left text-[9px] font-bold uppercase text-[#64748B]">
                    Due Date
                  </th>

                  <th className="px-4 text-left text-[9px] font-bold uppercase text-[#64748B]">
                    Assignee
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    onClick={() => setSelectedTaskId(task.id)}
                    key={task.id}
                    className="h-[56px] border-t border-[#E2E8F0] cursor-pointer"
                  >
                    <td className="px-4 text-[10px] font-medium text-[#2563EB]">
                      TASK-{task.id}
                    </td>

                    <td className="max-w-[280px] truncate px-4 text-[11px] font-medium text-[#0F172A]">
                      {task.title}
                    </td>

                    <td className="px-4">
                      <span className="inline-flex rounded-[2px] bg-[#DBEAFE] px-2 py-1 text-[8px] font-bold uppercase text-[#1E40AF]">
                        {task.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 text-[10px] text-[#475569]">
                      {task.dueDate}
                    </td>

                    <td className="px-4 text-[10px] font-medium text-[#334155]">
                      {task.assignee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalCount > limit && (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            limit={limit}
            onPageChange={handlePageChange}
            label="active tasks"
          />
        )}
      </div>

      {/* Mobile: Cards + Infinite Scroll */}
      <TaskMobileList
        projectId={projectId}
        tasks={tasks}
        totalCount={totalCount}
        limit={limit}
      />

      {/*  */}
      {selectedTaskId && (
        <TaskDetailsModal
          projectId={projectId}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
