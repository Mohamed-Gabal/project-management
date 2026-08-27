import { TASK_STATUS } from "@/constants/tasks/statusConfig";
import StatusColumn from "./TaskStatusColumn";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeInitials: string;
}

interface BoardViewProps {
  projectId: string;
  tasksByStatus: Record<string, Task[]>;
}

const BoardView = ({ projectId, tasksByStatus }: BoardViewProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-6 md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
      {TASK_STATUS.map((status) => {
        const tasks = tasksByStatus[status.key] ?? [];

        return (
          <StatusColumn
            key={status.key}
            projectId={projectId}
            statusKey={status.key}
            count={tasks.length}
            tasks={tasks}
          />
        );
      })}
    </div>
  );
};

export default BoardView;
