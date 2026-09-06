import CalendarEmptyIcon from "@/assets/icons/CalenderEmpty.svg";
import Image from "next/image";
import { getStatusStyle } from "@/lib/statistics/colors";
import { formatDayHeader, isToday } from "@/lib/statistics/date";
import type { DailyStatistics } from "@/types/statistics";

interface StatisticsCalendarProps {
  daily: DailyStatistics[];
}

const StatisticsCalendar = ({ daily }: StatisticsCalendarProps) => {
  return (
    <section
      className="w-[960px] max-w-full h-[420px]"
      aria-label="Weekly task calendar"
    >
      <div
        className="grid h-full gap-3"
        style={{
          gridTemplateColumns: `repeat(${daily.length}, minmax(0, 1fr))`,
        }}
      >
        {daily.map((day) => {
          const { dayName, dayNumber } = formatDayHeader(day.day);
          const today = isToday(day.day);
          const statusEntries = Object.entries(day.statuses).filter(
            ([, count]) => (count ?? 0) > 0,
          );

          return (
            <div
              key={day.day}
              className={`relative h-full rounded-[8px] border bg-surface p-4 ${
                today ? "border-[#003D9B] border-2" : "border-[#D6E4FF]"
              }`}
            >
              {today && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0052CC] px-3 py-0.5 text-[10px] font-bold text-white">
                  TODAY
                </span>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#7A869A]">
                  {dayName}
                </span>
                <span className="text-lg font-bold text-[#172B4D]">
                  {dayNumber}
                </span>
              </div>

              {statusEntries.length > 0 ? (
                <div className="mt-5 flex flex-col gap-2">
                  {statusEntries.map(([status, count]) => {
                    const style = getStatusStyle(status);
                    return (
                      <div
                        key={status}
                        className="flex min-h-[35px] items-center justify-between rounded-[2px] px-2 text-xs font-semibold"
                        style={{
                          backgroundColor: style.bgColor,
                          color: style.textColor,
                          borderLeft: style.borderAccent
                            ? `4px solid ${style.borderAccent}`
                            : undefined,
                        }}
                      >
                        <span>{style.label}</span>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-[calc(100%-64px)] flex-col items-center justify-center gap-2">
                  <Image
                    src={CalendarEmptyIcon}
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-medium tracking-wide text-[#A5ADBA]">
                    NO TASKS
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatisticsCalendar;
