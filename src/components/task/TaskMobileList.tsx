"use client";

import { useEffect, useRef, useState } from "react";
import { loadMoreListTasks } from "@/actions/task";
import { TASK_STATUS } from "@/constants/tasks/statusConfig";

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface TaskMobileListProps {
  projectId: string;
  tasks: Task[];
  totalCount: number;
  limit: number;
}

const TaskMobileList = ({
  projectId,
  tasks: initialTasks,
  totalCount,
  limit,
}: TaskMobileListProps) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [offset, setOffset] = useState(initialTasks.length);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
    setOffset(initialTasks.length);
  }, [initialTasks]);

  const hasMore = tasks.length < totalCount;

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
          // Load the next page when the user reaches the bottom of the screen
          const result = await loadMoreListTasks(projectId, limit, offset);

          if (result.ok) {
            const newTasks = result.data.map((task) => ({
              id: task.id,
              title: task.title,
              status: task.status,
              dueDate: task.due_date,
            }));

            if (result.data.length === 0) {
              return;
            }

            setTasks((previousTasks) => {
              const existingIds = new Set(previousTasks.map((task) => task.id));

              const uniqueTasks = newTasks.filter(
                (task) => !existingIds.has(task.id),
              );

              return [...previousTasks, ...uniqueTasks];
            });

            setOffset((previousOffset) => previousOffset + result.data.length);
          }
        } finally {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [projectId, limit, offset, hasMore]);

  return (
    <div className="flex w-full flex-col gap-4 md:hidden">
      {tasks.map((task) => {
        const statusInfo = TASK_STATUS.find((s) => s.key === task.status);

        return (
          <div
            key={task.id}
            className="flex w-full flex-col gap-2 rounded-lg border border-[#C3C6D61A] bg-surface p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral">TASK-{task.id}</span>

              {statusInfo && (
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-dark"
                  style={{ backgroundColor: statusInfo.badgeColor }}
                >
                  {statusInfo.label}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-neutral-dark">
              {task.title}
            </p>

            <div className="text-xs text-neutral">
              <span className="block text-[10px] uppercase text-neutral">
                Due Date
              </span>
              <span>{task.dueDate}</span>
            </div>
          </div>
        );
      })}

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex min-h-6 items-center justify-center"
        >
          {isLoading && (
            <span className="text-xs text-neutral">Loading...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskMobileList;
