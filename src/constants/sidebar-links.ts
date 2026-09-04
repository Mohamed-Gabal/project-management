import ProjectIcon from "@/assets/icons/project.svg";
import EpicsIcon from "@/assets/icons/epics.svg";
import TaskIcon from "@/assets/icons/task.svg";
import MemberIcon from "@/assets/icons/members.svg";
import DetailsIcon from "@/assets/icons/details.svg";
import StatisticsIcon from "@/assets/icons/statistics.svg";

export const getSidebarLinks = (projectId?: string) => [
  {
    label: "Projects",
    mobileLabel: "Projects",
    href: "/project",
    icon: ProjectIcon,
  },
  {
    label: "My Statistics",
    mobileLabel: "Statistics",
    href: `/project/${projectId}/my-statistics`,
    icon: StatisticsIcon,
  },
  {
    label: "Project Epics",
    mobileLabel: "Epics",
    href: `/project/${projectId}/epics`,
    icon: EpicsIcon,
  },
  {
    label: "Project Tasks",
    mobileLabel: "Tasks",
    href: `/project/${projectId}/tasks`,
    icon: TaskIcon,
  },
  {
    label: "Project Members",
    mobileLabel: "Members",
    href: `/project/${projectId}/members`,
    icon: MemberIcon,
  },
  {
    label: "Project Details",
    mobileLabel: "Details",
    href: `/project/${projectId}/edit`,
    icon: DetailsIcon,
  },
];
