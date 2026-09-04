import CalenderIcon from "@/assets/icons/calenderStatistics.svg";
import CheckIcon from "@/assets/icons/CheckStatistics.svg";
import OverIcon from "@/assets/icons/OverStatisticst.svg";
import Image from "next/image";

const StatisticsKpisData = [
  {
    id: 1,
    title: "Total Tasks",
    description: "24",
    icon: CalenderIcon,
    bgClass: "bg-[#0052CC1A]",
  },
  {
    id: 2,
    title: "Completed Tasks",
    description: "15",
    icon: CheckIcon,
    bgClass: "bg-[#0068441A]",
  },
  {
    id: 3,
    title: "Overdue Tasks",
    description: "3",
    icon: OverIcon,
    bgClass: "bg-[#FFDAD633]",
    textClass: "text-[#BA1A1A]",
  },
];

const StatisticsKpis = () => {
  return (
    <section className="w-[960px] max-w-full">
      <div className="grid grid-cols-3 gap-4">
        {StatisticsKpisData.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-surface shadow-sm p-4 w-[304px] h-[104px] rounded-[8px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral text-xl mb-2">
                  {kpi.title}
                </h3>
                <p className={`text-2xl font-bold ${kpi.textClass}`}>
                  {kpi.description}
                </p>
              </div>
              <div
                className={`w-[48px] h-[48px] ${kpi.bgClass} flex items-center justify-center rounded-[2px]`}
              >
                <Image src={kpi.icon} alt={kpi.title} width={24} height={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsKpis;
