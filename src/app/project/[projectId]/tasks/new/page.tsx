import ProjectsHeader from "@/components/project/ProjectsHeader";
import TaskForm from "@/components/task/TaskForm";
import BreadCrumb from "@/components/ui/BreadCrumb";

const NewTaskPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ status?: string }>;
}) => {
  const { projectId } = await params;
  const { status } = await searchParams;

  return (
    <section className="w-full min-w-0 overflow-x-hidden flex flex-col gap-8 max-w-[1024px] px-10 py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Project Alpha" },
          { label: "Tasks", href: `/project/${projectId}/tasks` },
          { label: "New Tasks" },
        ]}
      />

      {/* Page Project Header */}
      <ProjectsHeader
        title="Create New Task"
        description="Initialize a new work item within the Architectural Workspace ecosystem."
      />

      <TaskForm projectId={projectId} initialStatus={status} />
    </section>
  );
};

export default NewTaskPage;
