"use client";

import ProjectsHeader from "@/components/project/ProjectsHeader";
import BreadCrumb from "@/components/ui/BreadCrumb";
import PlusIcon from "@/assets/icons/plus.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import EpicCard from "@/components/epic/EpicCard";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { getProjectEpic } from "@/services/project";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import ProjectsErrorState from "@/components/ui/ProjectsErrorState";
import ProjectsEmptyState from "@/components/ui/ProjectsEmptyState";
import { getInitials } from "@/lib/utils/getInitials";

type PageStatus = "loading" | "success" | "empty" | "error";

interface Epic {
  id: string;
  epic_id: string;
  title: string;
  description: string | null;
  deadline: string;
  created_at: string;
  created_by: {
    sub: string;
    name: string | null;
    email: string | null;
    department: string | null;
  };
  assignee: {
    sub: string;
    name: string;
    email: string;
    department: string;
  };
}

const EpicPage = () => {
  const router = useRouter();
  const params = useParams();

  // Get the selected project ID from the URL.
  const projectId = params.projectId as string;

  // Store the API data and the current page state.
  const [epics, setEpics] = useState<Epic[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");

  // Fetch all epics belonging to the selected project.
  const fetchEpics = async () => {
    setStatus("loading");

    const response = await getProjectEpic(projectId);

    if (!response.ok) {
      setStatus("error");
      return;
    }

    if (response.data.length === 0) {
      setEpics([]);
      setStatus("empty");
      return;
    }

    setEpics(response.data);
    setStatus("success");
  };

  // Fetch epics when the project ID becomes available or changes.
  useEffect(() => {
    if (projectId) {
      fetchEpics();
    }
  }, [projectId]);

  return (
    <section className="w-full min-w-0 overflow-x-hidden flex flex-col gap-8 max-w-[1024px] px-10 py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "PROJECT", href: "/project" },
          { label: "PR0JECT NAME" },
          { label: "EPICS" },
        ]}
      />
      {/* Page header and epic search */}
      <ProjectsHeader
        title="Project Epics"
        buttonText="New Epic"
        buttonIcon={PlusIcon}
        // Navigate to the "Create New Epic" page.
        onButtonClick={() => router.push(`/project/${projectId}/epics/new`)}
        rightContent={
          <div className="relative w-full min-w-0">
            <Image
              src={SearchIcon}
              alt="search"
              width={15}
              height={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              type="text"
              placeholder="Search epics..."
              className="h-11 w-full rounded-sm bg-surface-highest pl-10 pr-4 text-body-sm outline-none"
            />
          </div>
        }
      />

      {/* Loading state */}
      {status === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectSkeleton />
        </div>
      )}

      {/* Error state */}
      {status === "error" && <ProjectsErrorState onRetry={fetchEpics} />}

      {/* Empty state */}
      {status === "empty" && (
        <ProjectsEmptyState
          onCreateProject={() => router.push(`/project/${projectId}/epics/new`)}
        />
      )}

      {/* Epics List */}
      {status === "success" && (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {epics.map((epic) => (
            <EpicCard
              key={epic.id}
              epicId={epic.epic_id}
              title={epic.title}
              assigneeName={epic.assignee?.name ?? "Unassigned"}
              assigneeInitials={getInitials(epic.assignee?.name ?? "")}
              createdBy={epic.created_by.name}
              createdDate={new Date(epic.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
            />
          ))}
        </div>
      )}

      {/*  */}
      <div className="fixed bottom-[95px] right-5 z-20 md:hidden">
        <Button
          type="button"
          aria-label="Create new epic"
          onClick={() => router.push(`/project/${projectId}/epics/new`)}
          className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#003D9B] to-[#0052CC] p-0 shadow-md hover:opacity-90"
        >
          <Image src={PlusIcon} alt="" width={24} height={24} />
        </Button>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={1}
        totalCount={24}
        limit={6}
        onPageChange={() => {}}
      />
    </section>
  );
};

export default EpicPage;
