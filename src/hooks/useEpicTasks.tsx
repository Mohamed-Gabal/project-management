import { useEffect, useState } from "react";
import { getEpicTasks } from "@/services/epic";
import { Task } from "@/types/task";
import { PageStatus } from "@/types/epic";

export function useEpicTasks(epicId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");

  const fetchTasks = async () => {
    if (!epicId) return;

    setStatus("loading");

    const response = await getEpicTasks(epicId);

    if (!response.ok) {
      setStatus("error");
      return;
    }

    if (response.data.length === 0) {
      setTasks([]);
      setStatus("empty");
      return;
    }

    setTasks(response.data);
    setStatus("success");
  };

  useEffect(() => {
    if (epicId) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epicId]);

  return { tasks, status, fetchTasks };
}
