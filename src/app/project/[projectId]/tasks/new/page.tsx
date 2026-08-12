"use client";

import ProjectsHeader from "@/components/project/ProjectsHeader";
import TaskForm from "@/components/task/TaskForm";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { useParams } from "next/navigation";

const NewTaskPage = () => {
  const params = useParams();
  // const router = useRouter();

  const projectId = params.projectId as string;

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

      <TaskForm />
    </section>
  );
};

export default NewTaskPage;
