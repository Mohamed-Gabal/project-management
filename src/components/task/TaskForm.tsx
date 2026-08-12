"use client";

import Input from "../ui/Input";
import Select from "../ui/Select";
import { TaskFormValues, taskSchema } from "@/lib/validations/task";
import { createTask } from "@/services/task";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    sub: string;
    name: string;
    email: string;
    job_title: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
}

type Epic = {
  id: string;
  project_id: string;
  title: string;
  epic_id: string;
};

const TaskForm = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch(`/api/getProjectMembers/${projectId}`);

        const result = await response.json();

        if (!response.ok) {
          return;
        }

        setMembers(result);
      } catch {
        return;
      }
    };

    if (projectId) {
      loadMembers();
    }
  }, [projectId]);

  useEffect(() => {
    const loadEpics = async () => {
      try {
        const response = await fetch(`/api/getProjectEpics/${projectId}`);

        const result = await response.json();

        if (!response.ok) {
          return;
        }

        setEpics(result);
      } catch {
        return;
      }
    };

    if (projectId) {
      loadEpics();
    }
  }, [projectId]);

  // Form Validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "TO_DO",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    const result = await createTask(projectId, data);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Task created successfully.");
  };

  return (
    <article className="w-full rounded-lg bg-surface p-4 shadow-card md:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Title */}
        {/* Input Component */}
        <Input
          {...register("title")}
          id="title"
          type="text"
          label={
            <>
              TITLE <span className="text-error">*</span>
            </>
          }
          placeholder="e.g., Finalize structural schematics"
          error={errors.title?.message}
        />

        {/* Status + Assignee (side by side) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Status */}
          {/* Select Component */}
          <Select
            {...register("status")}
            id="status"
            label={
              <>
                STATUS <span className="text-error">*</span>
              </>
            }
            error={errors.status?.message}
          >
            <option value="TO_DO">TO DO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="READY_FOR_QA">READY FOR QA</option>
            <option value="REOPENED">REOPENED</option>
            <option value="READY_FOR_PRODUCTION">READY FOR PRODUCTION</option>
            <option value="DONE">DONE</option>
          </Select>
          {/* Assignee */}
          <Select
            {...register("assignee_id")}
            id="assignee"
            label="ASSIGNEE"
            error={errors.assignee_id?.message}
          >
            <option value="">Select Team Member</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.metadata.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Epic */}
        <Select
          id="epic"
          label="EPIC"
          {...register("epic_id")}
          error={errors.epic_id?.message}
        >
          <option value="">Select Epic Link</option>

          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.epic_id}
              {epic.title.length > 100
                ? `${epic.title.slice(0, 100)}...`
                : epic.title}
            </option>
          ))}
        </Select>

        {/* Due Date */}
        <Input
          {...register("due_date")}
          id="due_date"
          type="datetime-local"
          label="DUE DATE"
          error={errors.due_date?.message}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-label-sm font-bold tracking-label-sm text-neutral"
          >
            DESCRIPTION
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={4}
            placeholder="Provide detailed context for this task..."
            className="w-full resize-none rounded-md bg-surface-highest p-4 text-body-md text-neutral-dark placeholder:text-neutral outline-none transition focus:ring-2 focus:ring-primary-container"
          />
          {errors.description && (
            <p className="text-label-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-4 pt-2 md:flex-row md:items-center md:justify-end md:gap-6">
          <button
            onClick={() => router.back()}
            type="button"
            className="w-full text-body-md font-medium text-neutral-dark md:w-auto cursor-pointer"
          >
            Back
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="h-12 w-full rounded-md bg-primary px-6 text-body-md font-medium text-surface transition-colors hover:bg-primary-container md:w-auto cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </article>
  );
};

export default TaskForm;
