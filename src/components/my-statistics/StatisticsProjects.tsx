import type { TasksCountPerProject } from "@/types/statistics";

interface StatisticsProjectsProps {
  projects: TasksCountPerProject[];
}

const StatisticsProjects = ({ projects }: StatisticsProjectsProps) => {
  return (
    <section className="w-[464px] max-w-full h-[264px] rounded-[8px] bg-surface p-8 shadow overflow-y-auto">
      <h2 className="text-xl font-bold text-[#041B3C]">All Projects</h2>
      <div className="mt-6 flex flex-col gap-4">
        {projects.length === 0 ? (
          <p className="text-sm text-[#97A0AF]">
            No projects with tasks in this period.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.project_id}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium text-neutral">
                {project.project_name}
              </span>
              <span className="text-sm font-semibold">
                {project.tasks_count} Tasks
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default StatisticsProjects;
