const statisticsStatusData = [
  {
    label: "In Progress",
    value: 12,
    color: "#003D9B",
    bgColor: "#003D9B",
  },
  {
    label: "Done",
    value: 9,
    color: "#004E32",
    bgColor: "#004E32",
  },
  {
    label: "Blocked",
    value: 3,
    color: "#BA1A1A",
    bgColor: "#BA1A1A",
  },
];

const StatisticsStatusChart = () => {
  const total = statisticsStatusData.reduce(
    (sum, status) => sum + status.value,
    0,
  );

  const radius = 76;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <section className="w-[480px] max-w-full h-[323px] rounded-[8px] p-8 bg-surface shadow">
      {/* Chart title */}
      <h2 className="text-xl font-bold text-[#041B3C]">Tasks by Status</h2>

      <div className="mt-8 flex items-center justify-between">
        {/* Doughnut chart */}
        <div className="relative flex h-[190px] w-[190px] items-center justify-center">
          <svg
            width="190"
            height="190"
            viewBox="0 0 190 190"
            className="-rotate-90"
            aria-label="Tasks by status chart"
            role="img"
          >
            {/* Base circle */}
            <circle
              cx="95"
              cy="95"
              r={radius}
              fill="none"
              stroke="#E9F0FF"
              strokeWidth="34"
            />

            {/* Dynamic status segments */}
            {statisticsStatusData.map((status) => {
              const percentage = status.value / total;
              const dashLength = percentage * circumference;
              const dashOffset = -accumulatedPercentage * circumference;

              accumulatedPercentage += percentage;

              return (
                <circle
                  key={status.label}
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke={status.color}
                  strokeWidth="34"
                  strokeDasharray={`${dashLength} ${
                    circumference - dashLength
                  }`}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div className="absolute flex flex-col items-center">
            <span className="text-[32px] font-bold leading-none text-[#172B4D]">
              {total}
            </span>

            <span className="mt-1 text-sm font-semibold text-[#97A0AF]">
              Total
            </span>
          </div>
        </div>

        {/* Chart legend */}
        <div className="flex w-[175px] flex-col gap-4">
          {statisticsStatusData.map((status) => {
            const percentage = (status.value / total) * 100;

            return (
              <div key={status.label} className="flex flex-col gap-1">
                {/* Label + count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: status.color,
                      }}
                    />

                    <span className="text-xs font-semibold text-[#5E6C84]">
                      {status.label}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#172B4D]">
                    {status.value}
                  </span>
                </div>

                {/* Progress line */}
                <div className="ml-6 h-1 rounded-full bg-[#E9F0FF]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: status.color,
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
