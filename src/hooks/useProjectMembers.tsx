import { useEffect, useState } from "react";
import { getProjectMembers } from "@/services/project";
import { ProjectMember } from "@/types/member";

export function useProjectMembers(projectId: string) {
  const [members, setMembers] = useState<ProjectMember[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await getProjectMembers(projectId);
      if (response.ok) {
        setMembers(response.data);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return { members };
}
