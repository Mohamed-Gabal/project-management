import ProjectsHeader from "@/components/project/ProjectsHeader";
import BoardView from "@/components/task/BoardView";
import TasksToolBar from "@/components/task/TasksToolbar";
import TaskList from "@/components/task/TaskList";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { getTasks, getTasksByStatus } from "@/services/task-server";
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
  searchParams: Promise<{
    view?: string;
    page?: string;
  }>;
}

const TasksPage = async ({ params, searchParams }: TaskPageProps) => {
  const { projectId } = await params;

  // Read the selected view and page from the URL
  const { view: requestedView = "board", page = "1" } = await searchParams;

  const view = requestedView === "list" ? "list" : "board";

  const parsedPage = Number(page);
  const currentPage = Number.isFinite(parsedPage) ? Math.max(parsedPage, 1) : 1;

  // Fetch only the selected page using limit and offset.
  const listLimit = 10;
  const listOffset = (currentPage - 1) * listLimit;

  const listResult =
    view === "list" ? await getTasks(projectId, listLimit, listOffset) : null;

  const listTasks = listResult?.ok
    ? listResult.data.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        dueDate: task.due_date,
        assignee: task.assignee?.name ?? "--",
      }))
    : [];

  const boardLimit = 10;
  const boardOffset = 0;

  const results =
    view === "board"
      ? await Promise.all(
          TASK_STATUS.map((status) =>
            getTasksByStatus(projectId, status.key, boardLimit, boardOffset),
          ),
        )
      : [];

  const tasksByStatus: Record<string,
    {
      tasks: Task[];
      totalCount: number;
    }
  > = {};

  TASK_STATUS.forEach((status, index) => {
    const result = results[index];

    if (result?.ok) {
      tasksByStatus[status.key] = {
        tasks: result.data.map((task) => ({
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
        })),
        totalCount: result.totalCount,
      };
    } else {
      tasksByStatus[status.key] = {
        tasks: [],
        totalCount: 0,
      };
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

      {/* Render the selected task view */}
      {view === "list" ? (
        <TaskList
          projectId={projectId}
          tasks={listTasks}
          currentPage={currentPage}
          totalCount={listResult?.ok ? listResult.totalCount : 0}
          limit={listLimit}
        />
      ) : (
        <BoardView projectId={projectId} tasksByStatus={tasksByStatus} />
      )}
    </section>
  );
};

export default TasksPage;