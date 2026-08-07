"use client";

import ProjectsHeader from "@/components/project/ProjectsHeader";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { EpicFormValues, EpicSchema } from "@/lib/validations/epic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEpic } from "@/services/epic";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const NewEpicPage = () => {
  const router = useRouter();

  const params = useParams();

  const projectId = params.projectId as string;

  // Form Validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EpicFormValues>({
    resolver: zodResolver(EpicSchema),
  });

  // Form Submission
  const onSubmit = async (data: EpicFormValues) => {
    const result = await createEpic(projectId, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Epic created successfully.");
    router.push(`/project`);
  };

  return (
    <section className="flex flex-col gap-8 max-w-[896px] px-10 py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Project Alpha" },
          { label: "Epics" },
          { label: "New Epic" },
        ]}
      />

      {/* Page Project Header */}
      <ProjectsHeader
        title="Create New Epic"
        description="Define a major project phase or high-level milestone to group related tasks and track architectural progress."
      />

      <div className="max-w-[848px] rounded-lg border border-neutral-light/10 bg-surface p-6 md:p-8 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Title */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[120px_1fr] md:gap-8">
            <label
              htmlFor="title"
              className="text-label-sm font-bold tracking-label-sm text-neutral-dark"
            >
              TITLE
            </label>
            <div>
              <input
                {...register("title")}
                id="title"
                type="text"
                placeholder="e.g. Structural Foundation Phase"
                className="h-12 w-full rounded-md bg-surface-highest px-4 outline-none transition focus:ring-2 focus:ring-primary-container"
              />

              {/* Error Message */}
              {errors.title && (
                <p className="text-error text-sm">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[120px_1fr] md:gap-8">
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="text-label-sm font-bold tracking-label-sm text-neutral-dark"
              >
                DESCRIPTION
              </label>

              <span className="text-xs text-neutral">Optional</span>
            </div>

            <div>
              <textarea
                {...register("description")}
                id="description"
                rows={5}
                placeholder="Describe the scope and objectives of this epic..."
                className="w-full resize-none rounded-md bg-surface-highest p-4 outline-none transition focus:ring-2 focus:ring-primary-container"
              />

              {/* Error Message */}
              {errors.description && (
                <p className="text-error text-sm">
                  {errors.description?.message}
                </p>
              )}
            </div>
          </div>

          {/* Assignee + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              {/* Assignee */}
              <label
                htmlFor="assignee"
                className="text-label-sm font=bold uppercase tracking-label-sm text-neutral-dark"
              >
                Assignee
              </label>
              <select
                {...register("assignee_id")}
                id="assignee"
                className="w-full h-12 rounded-md border border-transparent bg-surface-highest px-4 text-body-md text-neutral-dark outline-none border-none transition focus:border-primary focus:ring-4 focus:ring-primary-container/20"
              >
                <option value="">Select a member...</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="deadline"
                className="text-label-sm font-bold uppercase tracking-label-sm text-neutral-dark"
              >
                Deadline
              </label>
              <input
                {...register("deadline")}
                id="deadline"
                type="date"
                className="w-full h-12 rounded-md border border-transparent bg-surface-highest px-4 text-body-md text-neutral-dark outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-container/20"
              />
              {/* Error Message */}
              {errors.deadline && (
                <p className="text-error text-sm">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-10 pt-2 md:flex-row md:items-center md:justify-end">
            {/* Cancel */}
            <button
              type="button"
              className="text-body-md font-medium text-neutral-dark"
            >
              Cancel
            </button>
            {/* Create Epic */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full md:w-[158px] h-12 bg-primary rounded-md text-surface px-4 py-2 hover:bg-primary-container transition-colors duration-200"
            >
              {isSubmitting ? "Creating..." : "Create Epic"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewEpicPage;
