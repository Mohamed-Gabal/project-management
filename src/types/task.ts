// types/task.ts

export type ProjectMember = {
  member_id: string;
  project_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    sub: string;
    name: string;
    email: string;
    job_title: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
};

export type Epic = {
  id: string;
  project_id: string;
  title: string;
  epic_id: string;
};

export type TaskFormProps = {
  projectId: string;
};
