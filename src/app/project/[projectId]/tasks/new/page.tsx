import ProjectsHeader from "@/components/project/ProjectsHeader";
import TaskForm from "@/components/task/TaskForm";
import BreadCrumb from "@/components/ui/BreadCrumb";

const NewTaskPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

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

      <TaskForm projectId="projectId" />
    </section>
  );
};

export default NewTaskPage;
