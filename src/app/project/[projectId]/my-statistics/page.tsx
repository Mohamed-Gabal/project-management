import { redirect } from "next/navigation";
import ProjectsHeader from "@/components/project/ProjectsHeader";
import StatisticsFilter from "@/components/my-statistics/StatisticsFilter";
import StatisticsKpis from "@/components/my-statistics/StatisticsKpis";
import StatisticsCalendar from "@/components/my-statistics/StatisticsCalendar";
import StatisticsStatusChart from "@/components/my-statistics/StatisticsStatusChart";
import StatisticsProjects from "@/components/my-statistics/StatisticsProjects";
import { getTasksCalendarStats } from "@/lib/api/getTasksCalendarStats";
import { getTasksCountPerProject } from "@/lib/api/getTasksCountPerProject";
import { formatDateForApi, resolveDateRange } from "@/lib/statistics/date";
import { TASK_STATUS } from "@/constants/tasks/statusConfig";

interface MyStatisticsPageProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    start?: string;
    end?: string;
    project?: string;
    status?: string;
  }>;
}

function isValidStatus(value: string | undefined): value is StatisticsStatus {
  return TASK_STATUS.some((status) => status.key === value);
}

const MyStatisticsPage = async ({
  params,
  searchParams,
}: MyStatisticsPageProps) => {
  const { projectId } = await params;
  const query = await searchParams;

  const { startDate, endDate, wasCorrected } = resolveDateRange(
    query.start,
    query.end,
  );
  const projectFilterId = query.project ?? null;
  const status = isValidStatus(query.status) ? query.status : null;

  const startStr = formatDateForApi(startDate);
  const endStr = formatDateForApi(endDate);

  if (wasCorrected) {
    const sp = new URLSearchParams();
    sp.set("start", startStr);
    sp.set("end", endStr);
    if (projectId) sp.set("project", projectId);
    if (status) sp.set("status", status);
    redirect(`/my-statistics?${sp.toString()}`);
  }

  console.log("STATISTICS PARAMS:", {
    startDate: startStr,
    endDate: endStr,
    projectId,
    status,
  });

  const [calendarResult, projectsResult] = await Promise.all([
    getTasksCalendarStats({
      startDate: startStr,
      endDate: endStr,
      projectId,
      status,
    }),
    getTasksCountPerProject({ startDate: startStr, endDate: endStr }),
  ]);

  const calendarData = calendarResult.ok ? calendarResult.data : null;
  const projectsData = projectsResult.ok ? projectsResult.data : [];

  return (
    <section className="flex flex-col w-[1024px] max-w-full p-8 gap-8">
      <ProjectsHeader
        title="My Statistics"
        description="Track your task activity and progress over the selected period."
      />

      <StatisticsFilter
        projectId={projectId}
        initialStart={startStr}
        initialEnd={endStr}
        initialProjectId={projectFilterId}
        initialStatus={status}
        projects={projectsData.map((p) => ({
          id: p.project_id,
          name: p.project_name,
        }))}
      />

      {!calendarResult.ok ? (
        <div
          role="alert"
          className="w-[960px] max-w-full rounded-[8px] bg-[#FFF7F7] p-6 text-sm font-medium text-[#BA1A1A]"
        >
          {calendarResult.message} — please try again.
        </div>
      ) : (
        <>
          <StatisticsKpis
            totalTasks={calendarData!.total_tasks}
            doneTasks={calendarData!.done_tasks}
            overdueTasks={calendarData!.overdue_tasks}
          />

          <StatisticsCalendar daily={calendarData!.daily} />

          <div className="flex items-start gap-10">
            <StatisticsStatusChart totals={calendarData!.totals} />
            <StatisticsProjects projects={projectsData} />
          </div>
        </>
      )}
    </section>
  );
};

export default MyStatisticsPage;
