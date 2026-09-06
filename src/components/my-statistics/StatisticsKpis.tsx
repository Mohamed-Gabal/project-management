import CalenderIcon from "@/assets/icons/calenderStatistics.svg";
import CheckIcon from "@/assets/icons/CheckStatistics.svg";
import OverIcon from "@/assets/icons/OverStatisticst.svg";
import Image from "next/image";

interface StatisticsKpisProps {
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
}

const StatisticsKpis = ({
  totalTasks,
  doneTasks,
  overdueTasks,
}: StatisticsKpisProps) => {
  const kpis = [
    {
      id: "total",
      title: "Total Tasks",
      value: totalTasks,
      icon: CalenderIcon,
      bgClass: "bg-[#0052CC1A]",
    },
    {
      id: "done",
      title: "Completed Tasks",
      value: doneTasks,
      icon: CheckIcon,
      bgClass: "bg-[#0068441A]",
    },
    {
      id: "overdue",
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: OverIcon,
      bgClass: "bg-[#FFDAD633]",
      textClass: "text-[#BA1A1A]",
    },
  ];

  return (
    <section className="w-[960px] max-w-full" aria-label="Task summary">
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-surface shadow-sm p-4 w-[304px] h-[104px] rounded-[8px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral text-xl mb-2">
                  {kpi.title}
                </h3>
                <p className={`text-2xl font-bold ${kpi.textClass ?? ""}`}>
                  {kpi.value}
                </p>
              </div>
              <div
                className={`w-[48px] h-[48px] ${kpi.bgClass} flex items-center justify-center rounded-[2px]`}
              >
                <Image
                  src={kpi.icon}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsKpis;
