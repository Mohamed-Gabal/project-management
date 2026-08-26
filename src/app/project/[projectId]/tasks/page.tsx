import ProjectsHeader from "@/components/project/ProjectsHeader";
import BoardView from "@/components/task/BoardView";
import TasksToolBar from "@/components/task/TasksToolbar";
import BreadCrumb from "@/components/ui/BreadCrumb";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

interface TaskPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const mockTasksByStatus: Record<string, Task[]> = {
  TO_DO: [
    {
      id: "1",
      title: "Incorporate stakeholder feedback from v1.2 Review",
      dueDate: "OCT 12",
      assigneeInitials: "MT",
    },
    {
      id: "2",
      title: "Audit typography hierarchy for mobile views",
      dueDate: "OCT 14",
      assigneeInitials: "JD",
    },
  ],
  IN_PROGRESS: [
    {
      id: "3",
      title: "Interactive Prototype for Curator Dashboard",
      dueDate: "TODAY",
      assigneeInitials: "SK",
    },
  ],
  BLOCKED: [
    {
      id: "4",
      title: "Sync external assets database to Curator core",
      dueDate: "DELAYED",
      assigneeInitials: "MT",
    },
  ],
  IN_REVIEW: [
    {
      id: "5",
      title: "Document system architecture decisions",
      dueDate: "OCT 18",
      assigneeInitials: "AL",
    },
  ],
  READY_FOR_QA: [
    {
      id: "6",
      title: "Verify payment gateway integration",
      dueDate: "OCT 20",
      assigneeInitials: "RM",
    },
  ],
  REOPENED: [],
  READY_FOR_PRODUCTION: [],
  DONE: [
    {
      id: "7",
      title: "Update onboarding flow copy",
      dueDate: "OCT 10",
      assigneeInitials: "NF",
    },
  ],
};

const TasksPage = async ({ params }: TaskPageProps) => {
  const { projectId } = await params;
  return (
    <section className="w-full min-w-0 max-w-[1024px] flex flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "Projects", href: "/project" },
          { label: "Rafiq" },
          { label: "Tasks" },
        ]}
      />

      {/* Project Header */}
      <ProjectsHeader
        title="Active Workboard"
        description="Curating Project Alpha's production pipeline and milestones."
        actionSlot={<TasksToolBar />}
      />

      {/* StatusColumn */}
      <BoardView tasksByStatus={mockTasksByStatus} projectId={projectId} />
    </section>
  );
};

export default TasksPage;
