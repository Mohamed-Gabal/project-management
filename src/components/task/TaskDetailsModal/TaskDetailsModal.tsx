"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import { loadTaskDetails, UpdateTaskDetails } from "@/actions/task";
import { updateTaskSchema } from "@/lib/validations/task";
import { ProjectMember } from "@/types/member";

import CloseIcon from "@/assets/icons/close.svg";
import LinkIcon from "@/assets/icons/copy.svg";

import ProjectSkeleton from "@/components/ui/ProjectSkeleton";

import TaskDetailsSidebar, { TaskDetailsData } from "./TaskDetailsSidebar";
import TaskDetailsMobileMeta from "./TaskDetailsMobileMeta";

interface TaskDetailsModalProps {
  projectId: string;
  taskId: string;
  onClose: () => void;
}

interface Epic {
  id: string;
  epic_id: string;
  title: string;
}

type TaskDetailsStatus = "loading" | "success" | "error" | "empty";

// Task details modal with optimistic field updates and rollback on API failure.
const TaskDetailsModal = ({
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) => {
  const [task, setTask] = useState<TaskDetailsData | null>(null);
  const [status, setStatus] = useState<TaskDetailsStatus>("loading");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);

  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
  const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);
  const [isUpdatingEpic, setIsUpdatingEpic] = useState(false);
  const [isUpdatingDueDate, setIsUpdatingDueDate] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isEditingAssignee, setIsEditingAssignee] = useState(false);

  // Load task details and supporting dropdown data when the modal opens.
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setStatus("loading");

      const [taskResult, membersResult, epicsResult] = await Promise.all([
        loadTaskDetails(projectId, taskId),
        fetch(`/api/getProjectMembers/${projectId}`).then(async (response) => ({
          ok: response.ok,
          data: await response.json(),
        })),
        fetch(`/api/getProjectEpics/${projectId}`).then(async (response) => ({
          ok: response.ok,
          data: await response.json(),
        })),
      ]);

      if (!isMounted) return;

      if (!taskResult.ok) {
        setStatus("error");
        return;
      }

      if (!taskResult.data) {
        setStatus("empty");
        return;
      }

      setTask(taskResult.data);
      setTitle(taskResult.data.title);
      setDescription(taskResult.data.description ?? "");

      if (membersResult.ok) {
        setMembers(membersResult.data);
      }

      if (epicsResult.ok) {
        setEpics(epicsResult.data);
      }

      setStatus("success");
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projectId, taskId]);

  // Close the modal when Escape is pressed.
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

  // Update a task field optimistically and restore the previous value if the API fails.
  const updateField = async <K extends keyof TaskDetailsData>(
    field: K,
    newValue: TaskDetailsData[K],
    previousValue: TaskDetailsData[K],
    setLoading: (value: boolean) => void,
    payload: Record<string, unknown>,
    onSuccess?: () => void,
  ) => {
    if (!task) return;

    setTask((currentTask) =>
      currentTask
        ? {
            ...currentTask,
            [field]: newValue,
          }
        : currentTask,
    );

    setLoading(true);

    const result = await UpdateTaskDetails(task.id, payload);

    if (!result.ok) {
      setTask((currentTask) =>
        currentTask
          ? {
              ...currentTask,
              [field]: previousValue,
            }
          : currentTask,
      );

      onSuccess?.();

      toast.error("Failed to update task. Please try again.");
    } else {
      toast.success("Task updated successfully.");
    }

    setLoading(false);
  };

  // Validate and save the title only when its value actually changed.
  const handleTitleBlur = async () => {
    if (!task || isUpdatingTitle) return;

    const newTitle = title.trim();
    const previousTitle = task.title;

    if (newTitle === previousTitle) {
      setTitle(previousTitle);
      return;
    }

    const validation = updateTaskSchema.safeParse({
      title: newTitle,
    });

    if (!validation.success) {
      setTitle(previousTitle);
      toast.error(validation.error.issues[0]?.message);
      return;
    }

    setTitle(newTitle);

    await updateField(
      "title",
      newTitle,
      previousTitle,
      setIsUpdatingTitle,
      { title: newTitle },
      () => setTitle(previousTitle),
    );
  };

  // Save the description on blur and convert an empty value to null.
  const handleDescriptionBlur = async () => {
    if (!task || isUpdatingDescription) return;

    const newDescription = description.trim();
    const previousDescription = task.description ?? "";

    if (newDescription === previousDescription) {
      setDescription(previousDescription);
      return;
    }

    setDescription(newDescription);

    await updateField(
      "description",
      newDescription || null,
      task.description,
      setIsUpdatingDescription,
      {
        description: newDescription || null,
      },
      () => setDescription(previousDescription),
    );
  };

  // Save the selected project member immediately and support unassigning the task.
  const handleAssigneeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || isUpdatingAssignee) return;

    const newAssigneeId = event.target.value || null;
    const previousAssignee = task.assignee;

    if (newAssigneeId === (previousAssignee?.id ?? null)) {
      setIsEditingAssignee(false);
      return;
    }

    const selectedMember =
      members.find((member) => member.user_id === newAssigneeId) ?? null;

    const newAssignee = selectedMember
      ? {
          id: selectedMember.user_id,
          name: selectedMember.metadata.name,
          avatar: undefined,
        }
      : null;

    await updateField(
      "assignee",
      newAssignee,
      previousAssignee,
      setIsUpdatingAssignee,
      {
        assignee_id: newAssigneeId,
      },
    );

    setIsEditingAssignee(false);
  };

  // Save the selected epic and clear the relationship when no epic is selected.
  const handleEpicChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || isUpdatingEpic) return;

    const newEpicId = event.target.value || null;
    const previousEpicId = task.epic_id ?? null;

    if (newEpicId === previousEpicId) return;

    const selectedEpic = epics.find((epic) => epic.id === newEpicId) ?? null;

    const previousEpicName = task.epic_name ?? null;

    await updateField(
      "epic_id",
      newEpicId,
      previousEpicId,
      setIsUpdatingEpic,
      {
        epic_id: newEpicId,
      },
      () => {
        setTask((currentTask) =>
          currentTask
            ? {
                ...currentTask,
                epic_name: previousEpicName,
              }
            : currentTask,
        );
      },
    );

    setTask((currentTask) =>
      currentTask
        ? {
            ...currentTask,
            epic_name: selectedEpic?.title ?? null,
          }
        : currentTask,
    );
  };

  // Validate the date, prevent past dates, and save the new value immediately.
  const handleDueDateChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!task || isUpdatingDueDate) return;

    const newDueDate = event.target.value || null;
    const previousDueDate = task.due_date;

    if (newDueDate === previousDueDate) return;

    if (newDueDate) {
      const validation = updateTaskSchema.safeParse({
        due_date: newDueDate,
      });

      if (!validation.success) {
        toast.error(validation.error.issues[0]?.message);
        return;
      }
    }

    await updateField(
      "due_date",
      newDueDate,
      previousDueDate,
      setIsUpdatingDueDate,
      {
        due_date: newDueDate,
      },
    );
  };

  // Validate the selected status and save it immediately when changed.
  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!task || isUpdatingStatus) return;

    const newStatus = event.target.value;
    const previousStatus = task.status;

    if (newStatus === previousStatus) return;

    const validation = updateTaskSchema.safeParse({
      status: newStatus,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message);
      return;
    }

    await updateField(
      "status",
      newStatus,
      previousStatus,
      setIsUpdatingStatus,
      {
        status: newStatus,
      },
    );
  };

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
        <div className="w-full sm:max-w-[896px]">
          <ProjectSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="rounded-lg bg-white p-8 text-sm text-red-500">
          Failed to load task details
        </div>
      </div>
    );
  }

  if (status === "empty" || !task) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="rounded-lg bg-white p-8 text-sm text-neutral">
          Task not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-2xl bg-surface shadow sm:max-h-[870px] sm:max-w-[896px] sm:flex-row sm:overflow-hidden sm:rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2.5 sm:hidden">
          <span className="h-1 w-9 rounded-full bg-[#E4E7F5]" />
        </div>

        {/* Main task content */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex max-w-[160px] truncate rounded-sm bg-[#DAE2FF] px-2 py-1 text-[11px] font-bold text-[#3B4CCA]">
                TASK-{task.id}
              </span>

              <select
                value={task.epic_id ?? ""}
                onChange={handleEpicChange}
                disabled={isUpdatingEpic}
                className="hidden max-w-[220px] cursor-pointer truncate rounded-md border border-[#E4E7F5] bg-white px-2 py-1 text-[11px] font-medium text-neutral outline-none disabled:opacity-60 sm:block"
              >
                <option value="">No Epic</option>

                {epics.map((epic) => (
                  <option key={epic.id} value={epic.id}>
                    {epic.epic_id} {epic.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close task details"
              className="shrink-0 cursor-pointer sm:hidden"
            >
              <Image src={CloseIcon} alt="" width={20} height={20} />
            </button>
          </div>

          {/* Editable title */}
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleTitleBlur}
            disabled={isUpdatingTitle}
            className="mb-3 w-full border-none bg-transparent p-0 text-body-md font-semibold leading-snug text-neutral-dark outline-none disabled:opacity-60"
          />

          <TaskDetailsMobileMeta
            task={task}
            members={members}
            epics={epics}
            isUpdatingAssignee={isUpdatingAssignee}
            isUpdatingEpic={isUpdatingEpic}
            isUpdatingDueDate={isUpdatingDueDate}
            isUpdatingStatus={isUpdatingStatus}
            onAssigneeChange={handleAssigneeChange}
            onEpicChange={handleEpicChange}
            onDueDateChange={handleDueDateChange}
            onStatusChange={handleStatusChange}
          />

          {/* Editable description */}
          <div className="mb-4 flex min-h-[80px] flex-1 flex-col gap-[11px] rounded-sm border border-[#E4E7F5] bg-white px-3 py-3 sm:bg-transparent sm:px-4">
            <label
              htmlFor="description"
              className="block text-[11px] font-medium uppercase tracking-wide text-[#8B8D98]"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={handleDescriptionBlur}
              disabled={isUpdatingDescription}
              placeholder="No description provided"
              className="min-h-[50px] w-full resize-none border-none bg-transparent p-0 text-body-sm text-neutral outline-none disabled:opacity-60"
            />
          </div>

          {/* Modal footer */}
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

        <TaskDetailsSidebar
          task={task}
          members={members}
          epics={epics}
          isUpdatingAssignee={isUpdatingAssignee}
          isUpdatingEpic={isUpdatingEpic}
          isUpdatingDueDate={isUpdatingDueDate}
          isUpdatingStatus={isUpdatingStatus}
          isEditingAssignee={isEditingAssignee}
          onAssigneeEdit={() => setIsEditingAssignee(true)}
          onAssigneeChange={handleAssigneeChange}
          onAssigneeBlur={() => setIsEditingAssignee(false)}
          onEpicChange={handleEpicChange}
          onDueDateChange={handleDueDateChange}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default TaskDetailsModal;
