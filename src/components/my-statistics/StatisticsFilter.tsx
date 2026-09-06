"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import type { StatisticsStatus } from "@/types/statistics";
import {
  diffInDaysInclusive,
  MAX_RANGE_DAYS,
  formatDateForApi,
  formatRangeLabel,
} from "@/lib/statistics/date";
import { STATUS_STYLES } from "@/lib/statistics/colors";

interface Project {
  id: string;
  name: string;
}

interface StatisticsFilterProps {
  projectId: string;
  initialStart: string;
  initialEnd: string;
  initialProjectId: string | null;
  initialStatus: StatisticsStatus | null;
  projects: Project[];
}

const STATUS_OPTIONS = Object.entries(STATUS_STYLES) as [
  StatisticsStatus,
  (typeof STATUS_STYLES)[StatisticsStatus],
][];

const StatisticsFilter = ({
  projectId,
  initialStart,
  initialEnd,
  initialProjectId,
  initialStatus,
  projects,
}: StatisticsFilterProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [range, setRange] = useState<DateRange>({
    from: new Date(initialStart),
    to: new Date(initialEnd),
  });
  const [error, setError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const pushUrl = (next: {
    start?: string;
    end?: string;
    project?: string | null;
    status?: string | null;
  }) => {
    const sp = new URLSearchParams();
    sp.set("start", next.start ?? formatDateForApi(range.from ?? new Date()));
    sp.set("end", next.end ?? formatDateForApi(range.to ?? new Date()));

    const project =
      next.project !== undefined ? next.project : initialProjectId;
    const status = next.status !== undefined ? next.status : initialStatus;

    if (project) sp.set("project", project);
    if (status) sp.set("status", status);

    startTransition(() => {
      router.push(`/project/${projectId}/my-statistics?${sp.toString()}`);
    });
  };

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected?.from || !selected?.to) {
      setRange(selected ?? {});
      return;
    }

    const { from, to } = selected;

    if (to < from) {
      setError("End date must be after start date.");
      return;
    }

    if (diffInDaysInclusive(from, to) > MAX_RANGE_DAYS) {
      setError(`You can select up to ${MAX_RANGE_DAYS} days only.`);
      return;
    }

    setError(null);
    setRange(selected);
    setIsPickerOpen(false);
    pushUrl({ start: formatDateForApi(from), end: formatDateForApi(to) });
  };

  const rangeLabel =
    range.from && range.to
      ? formatRangeLabel(range.from, range.to)
      : "Select date range";

  return (
    <section className="flex flex-col gap-2 w-[960px] max-w-full">
      <div className="relative flex flex-wrap items-center justify-between gap-3 min-h-[68px] bg-[#F1F3FF] rounded-[8px] p-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen((open) => !open)}
            aria-haspopup="dialog"
            aria-expanded={isPickerOpen}
            aria-label={`Selected date range: ${rangeLabel}. Click to change, maximum ${MAX_RANGE_DAYS} days.`}
            className="text-sm font-medium whitespace-nowrap rounded-[6px] px-3 py-1.5 bg-surface"
          >
            {rangeLabel}
          </button>

          {isPickerOpen && (
            <div
              role="dialog"
              aria-label="Choose date range"
              className="absolute z-10 mt-2 rounded-[8px] bg-surface p-3 shadow-lg"
            >
              <DayPicker
                mode="range"
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={1}
                defaultMonth={range.from}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 h-9">
          <label htmlFor="project-filter" className="sr-only">
            Filter by project
          </label>
          <select
            id="project-filter"
            className="h-9 w-[204px] rounded-[8px] bg-surface px-3 text-sm outline-none"
            defaultValue={initialProjectId ?? ""}
            onChange={(e) => pushUrl({ project: e.target.value || null })}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            className="h-9 rounded-[8px] bg-surface px-3 text-sm outline-none"
            defaultValue={initialStatus ?? ""}
            onChange={(e) => pushUrl({ status: e.target.value || null })}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(([value, style]) => (
              <option key={value} value={value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {isPending && (
          <span className="text-xs text-[#5E6C84]" aria-live="polite">
            Updating…
          </span>
        )}
      </div>

      {error && (
        <span
          role="alert"
          aria-live="polite"
          className="text-xs font-medium text-[#BA1A1A] px-1"
        >
          {error}
        </span>
      )}
    </section>
  );
};

export default StatisticsFilter;
