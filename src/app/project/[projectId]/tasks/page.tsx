import ProjectsHeader from "@/components/project/ProjectsHeader";
import BoardView from "@/components/task/BoardView";
import TasksToolBar from "@/components/task/TasksToolbar";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { getTasksByStatus } from "@/services/task-server";
import { TASK_STATUS } from "@/constants/tasks/statusConfig";

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

const TasksPage = async ({ params }: TaskPageProps) => {
  const { projectId } = await params;

  const results = await Promise.all(
    TASK_STATUS.map((status) => getTasksByStatus(projectId, status.key)),
  );

  const tasksByStatus: Record<string, Task[]> = {};

  TASK_STATUS.forEach((status, index) => {
    const result = results[index];

    if (result.ok) {
      tasksByStatus[status.key] = result.data.map((task) => ({
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
    } else {
      tasksByStatus[status.key] = [];
    }
  });

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
      <BoardView tasksByStatus={tasksByStatus} projectId={projectId} />
    </section>
  );
};

export default TasksPage;
