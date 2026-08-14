import { useEffect, useState } from "react";
import { getProjectEpic } from "@/services/project";
import { Epic, PageStatus } from "@/types/epic";

export function useProjectEpics(projectId: string) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");

  const fetchEpics = async () => {
    setStatus("loading");

    const response = await getProjectEpic(projectId);

    if (!response.ok) {
      setStatus("error");
      return;
    }

    if (response.data.length === 0) {
      setEpics([]);
      setStatus("empty");
      return;
    }

    setEpics(response.data);
    setStatus("success");
  };

  useEffect(() => {
    if (projectId) {
      fetchEpics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return { epics, status, fetchEpics };
}
