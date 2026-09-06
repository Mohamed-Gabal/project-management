import { getStatusStyle } from "@/lib/statistics/colors";
import type { StatisticsStatus } from "@/types/statistics";

interface StatisticsStatusChartProps {
  totals: Partial<Record<StatisticsStatus, number>>;
}

const RADIUS = 76;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const StatisticsStatusChart = ({ totals }: StatisticsStatusChartProps) => {
  const entries = Object.entries(totals).filter(
    ([, value]) => (value ?? 0) > 0,
  ) as [StatisticsStatus, number][];
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  let accumulated = 0;

  const summary = entries
    .map(([status, value]) => `${getStatusStyle(status).label}: ${value}`)
    .join(", ");

  return (
    <section className="w-[480px] max-w-full h-[323px] rounded-[8px] p-8 bg-surface shadow">
      <h2 className="text-xl font-bold text-[#041B3C]">Tasks by Status</h2>

      <div className="mt-8 flex items-center justify-between">
        <div className="relative flex h-[190px] w-[190px] items-center justify-center">
          {total === 0 ? (
            <span className="text-sm font-medium text-[#97A0AF] text-center px-4">
              No tasks in this period
            </span>
          ) : (
            <>
              <svg
                width="190"
                height="190"
                viewBox="0 0 190 190"
                className="-rotate-90"
                role="img"
                aria-label={`Tasks by status: ${summary}`}
              >
                <circle
                  cx="95"
                  cy="95"
                  r={RADIUS}
                  fill="none"
                  stroke="#E9F0FF"
                  strokeWidth="34"
                />
                {entries.map(([status, value]) => {
                  const percentage = value / total;
                  const dashLength = percentage * CIRCUMFERENCE;
                  const dashOffset = -accumulated * CIRCUMFERENCE;
                  accumulated += percentage;

                  return (
                    <circle
                      key={status}
                      cx="95"
                      cy="95"
                      r={RADIUS}
                      fill="none"
                      stroke={getStatusStyle(status).chartColor}
                      strokeWidth="34"
                      strokeDasharray={`${dashLength} ${CIRCUMFERENCE - dashLength}`}
                      strokeDashoffset={dashOffset}
                    />
                  );
                })}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[32px] font-bold leading-none text-[#172B4D]">
                  {total}
                </span>
                <span className="mt-1 text-sm font-semibold text-[#97A0AF]">
                  Total
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex w-[175px] flex-col gap-4 overflow-y-auto max-h-[190px]">
          {entries.map(([status, value]) => {
            const style = getStatusStyle(status);
            const percentage = total ? (value / total) * 100 : 0;

            return (
              <div key={status} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: style.chartColor }}
                    />
                    <span className="text-xs font-semibold text-[#5E6C84]">
                      {style.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#172B4D]">
                    {value}
                  </span>
                </div>
                <div className="ml-6 h-1 rounded-full bg-[#E9F0FF]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: style.chartColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsStatusChart;
