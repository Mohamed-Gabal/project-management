import CalendarEmptyIcon from "@/assets/icons/CalenderEmpty.svg";
import Image from "next/image";

const statisticsCalendarData = [
  {
    day: "SUN",
    date: "11 May",
    statuses: [],
  },
  {
    day: "MON",
    date: "12 May",
    statuses: [
      { label: "TO DO", count: 4, type: "default" },
      { label: "ACTIVE", count: 2, type: "active" },
    ],
  },
  {
    day: "TUE",
    date: "13 May",
    statuses: [
      { label: "ACTIVE", count: 5, type: "active" },
      { label: "BLOCKED", count: 1, type: "blocked" },
    ],
  },
  {
    day: "WED",
    date: "14 May",
    isToday: true,
    statuses: [
      { label: "IN PROGRESS", count: 6, type: "progress" },
      { label: "DONE", count: 3, type: "done" },
    ],
  },
  {
    day: "THU",
    date: "15 May",
    statuses: [{ label: "TO DO", count: 8, type: "default" }],
  },
  {
    day: "FRI",
    date: "16 May",
    statuses: [{ label: "DONE", count: 12, type: "done" }],
  },
  {
    day: "SAT",
    date: "17 May",
    statuses: [],
  },
];

const StatisticsCalendar = () => {
  return (
    <section className="w-[960px] max-w-full h-[420px]">
      <div className="grid h-full grid-cols-7 gap-3">
        {statisticsCalendarData.map((day) => (
          <div
            key={day.date}
            className={`relative h-full rounded-[8px] border bg-surface p-4 ${
              day.isToday ? "border-[#003D9B] border-2" : "border-[#D6E4FF]"
            }`}
          >
            {/* Today badge */}
            {day.isToday && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0052CC] px-3 py-0.5 text-[10px] font-bold text-white">
                TODAY
              </span>
            )}

            {/* Day header */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#7A869A]">
                {day.day}
              </span>

              <span className="text-lg font-bold text-[#172B4D]">
                {day.date}
              </span>
            </div>

            {/* Statuses */}
            {day.statuses.length > 0 ? (
              <div className="mt-5 flex flex-col gap-2">
                {day.statuses.map((status) => (
                  <div
                    key={status.label}
                    className={`flex min-h-[35px] items-center justify-between rounded-[2px] px-2 text-xs font-semibold ${
                      status.type === "active"
                        ? "bg-[#DEEBFF] text-[#003D9B]"
                        : status.type === "progress"
                          ? "border-l-4 border-[#0052CC] bg-[#DEEBFF] text-[#003D9B]"
                          : status.type === "blocked"
                            ? "bg-[#FFF7F7] text-[#DE350B]"
                            : status.type === "done"
                              ? "bg-[#E3FCEF] text-[#006644]"
                              : "bg-[#F4F5F7] text-[#6B778C]"
                    }`}
                  >
                    <span>{status.label}</span>
                    <span>{status.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex h-[calc(100%-64px)] flex-col items-center justify-center gap-2">
                <Image src={CalendarEmptyIcon} alt="" width={32} height={32} />

                <span className="text-[10px] font-medium tracking-wide text-[#A5ADBA]">
                  NO TASKS
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsCalendar;
