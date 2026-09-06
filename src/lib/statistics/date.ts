export const MAX_RANGE_DAYS = 7;

export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentWeekRange(): [Date, Date] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(0, 0, 0, 0);

  return [start, end];
}

export function diffInDaysInclusive(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

function isValidDateString(value: string | undefined): value is string {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

export function resolveDateRange(
  startParam: string | undefined,
  endParam: string | undefined,
): { startDate: Date; endDate: Date; wasCorrected: boolean } {
  if (isValidDateString(startParam) && isValidDateString(endParam)) {
    const start = new Date(startParam);
    const end = new Date(endParam);

    if (end >= start && diffInDaysInclusive(start, end) <= MAX_RANGE_DAYS) {
      return { startDate: start, endDate: end, wasCorrected: false };
    }

    const clampedEnd = new Date(start);
    clampedEnd.setDate(start.getDate() + (MAX_RANGE_DAYS - 1));
    return { startDate: start, endDate: clampedEnd, wasCorrected: true };
  }

  const [defaultStart, defaultEnd] = getCurrentWeekRange();
  return { startDate: defaultStart, endDate: defaultEnd, wasCorrected: false };
}

export function formatDayHeader(dateStr: string): {
  dayName: string;
  dayNumber: string;
} {
  const date = new Date(dateStr);
  return {
    dayName: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    dayNumber: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }),
  };
}

export function formatRangeLabel(start: Date, end: Date): string {
  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} - ${endLabel}`;
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
