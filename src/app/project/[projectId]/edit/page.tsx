"use client";

import Image from "next/image";
import TimeIcon from "@/assets/icons/timeProject.svg";
import ProtipIcon from "@/assets/icons/pro-tip.svg";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getProjectId, updateProject } from "@/services/project";
import { ProjectFormValues, ProjectSchema } from "@/lib/validations/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";

const EditPage = () => {
  // Store the current project details
  const { projectId } = useParams<{ projectId: string }>();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Watch the description field to display the character count
  const description = watch("description");

  useEffect(() => {
    // Fetch the current project details when the page loads
    const fetchProject = async () => {
      const result = await getProjectId(projectId);

      if (!result) return;
      if (result.ok) {
        reset({
          name: result.data.name,
          description: result.data.description,
        });
      }
    };

    fetchProject();
  }, [projectId]);

  const onSubmit = async (data: ProjectFormValues) => {
    const result = await updateProject(projectId, data);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Project updated successfully");
    router.push("/project");
  };

  return (
    <section className="w-full min-w-0 flex flex-col gap-8 max-w-[1024px] px-10 py-10">
      {/* Import Component - Breadcrumb - hidden on mobile */}
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Project Title" },
          { label: "Edit" },
        ]}
      />

      {/* Page Title - hidden on mobile */}
      <h1 className="hidden text-headline-lg font-bold tracking-headline-lg text-neutral-dark md:block">
        Edit Project
      </h1>

      <div className="mx-auto w-full max-w-[960px] overflow-hidden rounded-lg bg-surface md:shadow-card">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-neutral-light px-4 py-5 md:px-8 md:py-7">
          <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-container/10 md:flex">
            <Image
              src={TimeIcon}
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="mb-1 text-base font-bold text-neutral-dark md:text-lg">
              Edit Project
            </h2>
            <p className="text-xs text-neutral md:text-body-md">
              Define the scope and foundational details of your project.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-4 md:p-8"
        >
          {/* Project Title */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-label-sm font-bold uppercase tracking-label-sm text-neutral-dark"
            >
              Project Title
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Enter Project Title"
              className={`h-12 w-full rounded-md px-4 outline-none transition bg-surface-highest ${
                errors.name
                  ? "border border-error focus:border-error focus:ring-4 focus:ring-error/20"
                  : "border border-transparent focus:border-primary focus:ring-4 focus:ring-primary-container/20"
              }`}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-error">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="text-label-sm font-bold uppercase tracking-label-sm text-neutral-dark"
              >
                Description
              </label>
              <span className="text-xs text-neutral">Optional</span>
            </div>
            <textarea
              {...register("description")}
              id="description"
              rows={5}
              placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
              className="w-full resize-none rounded-md border border-transparent bg-surface-highest p-4 text-body-md text-neutral-dark outline-none transition placeholder:text-neutral focus:border-primary focus:ring-4 focus:ring-primary-container/20"
            />
            <p className="text-right text-xs text-neutral">
              {description?.length || 0} / 500 characters
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-error">
                {errors.description?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse items-center gap-3 border-t border-neutral-light p-4 md:flex-row md:justify-between md:gap-0 md:p-8">
            <button
              onClick={() => router.push("/project")}
              type="button"
              className="text-body-md font-medium text-neutral-dark transition-colors hover:text-primary"
            >
              Cancel
            </button>

            {/* Save Project Button */}
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full md:w-auto rounded-md px-6 py-3 text-body-md shadow-md hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-2 bg-surface-low px-4 py-4 md:px-8 md:py-5">
          <Image
            src={ProtipIcon}
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
          />
          <p className="text-xs text-neutral md:text-body-md">
            <span className="font-semibold text-neutral-dark">Pro Tip:</span>
            You can invite project members and assign epics immediately after
            the initial creation process.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditPage;
