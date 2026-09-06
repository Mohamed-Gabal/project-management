import type { StatisticsStatus } from "@/types/statistics";

interface StatusStyle {
  label: string;
  textColor: string;
  bgColor: string;
  chartColor: string;
  borderAccent?: string;
}

export const STATUS_STYLES: Record<StatisticsStatus, StatusStyle> = {
  TO_DO: {
    label: "TO DO",
    textColor: "#6B778C",
    bgColor: "#F4F5F7",
    chartColor: "#6B778C",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    textColor: "#003D9B",
    bgColor: "#DEEBFF",
    chartColor: "#003D9B",
    borderAccent: "#0052CC",
  },
  BLOCKED: {
    label: "BLOCKED",
    textColor: "#DE350B",
    bgColor: "#FFF7F7",
    chartColor: "#BA1A1A",
  },
  IN_REVIEW: {
    label: "IN REVIEW",
    textColor: "#5243AA",
    bgColor: "#EAE6FF",
    chartColor: "#5243AA",
  },
  READY_FOR_QA: {
    label: "READY FOR QA",
    textColor: "#946F00",
    bgColor: "#FFF9E6",
    chartColor: "#946F00",
  },
  REOPENED: {
    label: "REOPENED",
    textColor: "#B04B00",
    bgColor: "#FFEBDC",
    chartColor: "#B04B00",
  },
  READY_FOR_PRODUCTION: {
    label: "READY FOR PRODUCTION",
    textColor: "#00757F",
    bgColor: "#E3FBFF",
    chartColor: "#00757F",
  },
  DONE: {
    label: "DONE",
    textColor: "#006644",
    bgColor: "#E3FCEF",
    chartColor: "#004E32",
  },
};

export function getStatusStyle(status: string): StatusStyle {
  return (
    STATUS_STYLES[status as StatisticsStatus] ?? {
      label: status,
      textColor: "#6B778C",
      bgColor: "#F4F5F7",
      chartColor: "#6B778C",
    }
  );
}
