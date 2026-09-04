const statisticsProjectsData = [
  {
    id: 1,
    name: "Skyline Residency",
    tasksCount: "45 Tasks",
  },
  {
    id: 2,
    name: "Urban Center Phase 2",
    tasksCount: "28 Tasks",
  },
  {
    id: 3,
    name: "Green Valley Office",
    tasksCount: "12 Tasks",
  },
];

const StatisticsProjects = () => {
  return (
    <section className="w-[464px] max-w-full h-[264px] rounded-[8px] bg-surface p-8 shadow">
      {/* Section title */}
      <h2 className="text-xl font-bold text-[#041B3C]">All Projects</h2>

      {/* Projects list */}
      <div className="mt-6 flex flex-col gap-4">
        {statisticsProjectsData.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral">
              {project.name}
            </span>

            <span className="text-sm font-semibold">{project.tasksCount}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsProjects;
