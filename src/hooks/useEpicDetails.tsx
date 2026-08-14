import { useEffect, useState } from "react";
import { Epic, PageStatus } from "@/types/epic";
import { getEpicDetails } from "@/services/epic";

export function useEpicDetails(projectId: string, epicId: string | null) {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");

  const fetchEpicDetails = async () => {
    if (!epicId) return;

    setStatus("loading");

    const response = await getEpicDetails(projectId, epicId);

    if (!response.ok || !response.data) {
      setStatus("error");
      return;
    }

    setEpic(response.data);
    setStatus("success");
  };

  useEffect(() => {
    if (projectId && epicId) {
      fetchEpicDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, epicId]);

  return { epic, status, fetchEpicDetails };
}
