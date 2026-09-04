import StatisticsCalendar from "@/components/my-statistics/StatisticsCalendar";
import StatisticsFilter from "@/components/my-statistics/StatisticsFilter";
import StatisticsKpis from "@/components/my-statistics/StatisticsKpis";
import StatisticsProjects from "@/components/my-statistics/StatisticsProjects";
import StatisticsStatusChart from "@/components/my-statistics/StatisticsStatusChart";
import ProjectsHeader from "@/components/project/ProjectsHeader";

const MyStatisticsPage = () => {
  return (
    <section className="flex flex-col w-[1024px] max-w-full p-8 gap-8">
      <ProjectsHeader
        title="Weekly Planner"
        description="Manage your deadlines and track team velocity."
      />

      <StatisticsFilter />
      <StatisticsKpis />
      <StatisticsCalendar />
      <div className="flex items-start gap-10">
        <StatisticsStatusChart />
        <StatisticsProjects />
      </div>
    </section>
  );
};

export default MyStatisticsPage;
