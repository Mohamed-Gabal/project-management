// Creator or assignee info attached to an Epic
interface EpicUser {
  sub: string;
  name: string | null;
  email: string | null;
  department: string | null;
}

// A single Project Epic returned from the API
export interface Epic {
  id: string;
  epic_id: string;
  title: string;
  description: string | null;
  deadline: string;
  created_at: string;
  created_by: EpicUser;
  assignee: EpicUser;
}

// Status of the epics fetch request
export type PageStatus = "loading" | "success" | "empty" | "error";
