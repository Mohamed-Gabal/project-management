// Simplified epic shape used to populate the epic <select> in the Task creation form
export type EpicOption = {
  id: string;
  project_id: string;
  title: string;
  epic_id: string;
};

export type TaskFormProps = {
  projectId: string;
};

// A single Task belonging to an Epic, as returned from the API
export interface Task {
  id: string;
  task_id: string;
  title: string;
  due_date: string | null;
  assignee: {
    id: string;
    name: string;
    email: string;
    department: string | null;
  } | null;
}
