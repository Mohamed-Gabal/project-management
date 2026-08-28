"use client";

import Plus from "@/assets/icons/plus-status.svg";
import PlusIcon from "@/assets/icons/plus-add-status.svg";
import Image from "next/image";
import { TASK_STATUS } from "@/constants/tasks/statusConfig";
import TaskCard from "./TaskCard";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadMoreTasks } from "@/actions/task";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

interface StatusColumnProps {
  projectId: string;
  statusKey: (typeof TASK_STATUS)[number]["key"];
  tasks: Task[];
  totalCount: number;
}

const LIMIT = 10;

const StatusColumn = ({
  projectId,
  statusKey,
  tasks: initialTasks,
  totalCount,
}: StatusColumnProps) => {
  const status = TASK_STATUS.find((s) => s.key === statusKey);

  const [tasks, setTasks] = useState(initialTasks);
  const [offset, setOffset] = useState(initialTasks.length);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasMore = tasks.length < totalCount;

  useEffect(() => {
    setTasks(initialTasks);
    setOffset(initialTasks.length);
  }, [initialTasks]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
          // Load the next page when the user reaches the bottom of the column
          const result = await loadMoreTasks(
            projectId,
            statusKey,
            LIMIT,
            offset,
          );

          if (result.ok) {
            const newTasks = result.data.map((task) => ({
              id: task.id,
              title: task.title,
              dueDate: task.due_date,
              assigneeInitials: task.assignee?.name
                ? task.assignee.name
                    .split(" ")
                    .map((name: string) => name[0])
                    .join("")
                    .toUpperCase()
                : "--",
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
  }, [projectId, statusKey, offset, hasMore]);

  if (!status) return null;

  return (
    <section className="w-full md:w-[228px] md:shrink-0">
      {/* Header */}
      <div className="flex h-[19px] w-full items-center justify-between px-1">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: status.dotColor }}
          />

          <span className="text-xs font-semibold uppercase text-neutral">
            {status.label}
          </span>

          <span className="flex h-[19px] w-[18px] shrink-0 items-center justify-center rounded-[2px] bg-[#E0E8FF] text-xs font-bold text-neutral-dark">
            {tasks.length}
          </span>
        </div>

        <Link
          href={`/project/${projectId}/tasks/new?status=${statusKey}`}
          className="shrink-0 cursor-pointer"
        >
          <Image src={Plus} alt="" width={15} height={15} />
        </Link>
      </div>

      {/* Add New Task Button */}
      <Link
        href={`/project/${projectId}/tasks/new?status=${statusKey}`}
        className="mt-3 flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#C3C6D64D] text-xs font-semibold uppercase tracking-wide text-[#43465499] whitespace-nowrap"
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
    </section>
  );
};

export default StatusColumn;
