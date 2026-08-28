import { TASK_STATUS } from "@/constants/tasks/statusConfig";
import StatusColumn from "./TaskStatusColumn";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

interface BoardTasks {
  tasks: Task[];
  totalCount: number;
}

interface BoardViewProps {
  projectId: string;
  tasksByStatus: Record<string, BoardTasks>;
}

const BoardView = ({ projectId, tasksByStatus }: BoardViewProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-6 md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
      {TASK_STATUS.map((status) => {
        const statusData = tasksByStatus[status.key] ?? {
          tasks: [],
          totalCount: 0,
        };

        return (
          <StatusColumn
            key={status.key}
            projectId={projectId}
            statusKey={status.key}
            tasks={statusData.tasks}
            totalCount={statusData.totalCount}
          />
        );
      })}
    </div>
  );
};

export default BoardView;
