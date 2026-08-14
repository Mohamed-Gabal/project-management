"use client";

import ProjectsHeader from "@/components/project/ProjectsHeader";
import BreadCrumb from "@/components/ui/BreadCrumb";
import PlusIcon from "@/assets/icons/plus.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EpicCard from "@/components/epic/EpicCard";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import ProjectsErrorState from "@/components/ui/ProjectsErrorState";
import ProjectsEmptyState from "@/components/ui/ProjectsEmptyState";
import { getInitials } from "@/lib/utils/getInitials";
import { useProjectEpics } from "@/hooks/useProjectEpics";
import { useState } from "react";
import EpicDetailsModal from "./EpicDetailsModal";

interface EpicsPageViewProps {
  projectId: string;
}

const EpicsPageView = ({ projectId }: EpicsPageViewProps) => {
  const router = useRouter();
  const { epics, status, fetchEpics } = useProjectEpics(projectId);
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);

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
              assigneeInitials={getInitials(epic.assignee?.name ?? "NA")}
              createdBy={epic.created_by.name}
              createdDate={new Date(epic.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
              onClick={() => setSelectedEpicId(epic.id)}
            />
          ))}
        </div>
      )}

      {/* Mobile create button */}
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

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalCount={24}
        limit={6}
        onPageChange={() => {}}
      />

      {/* Modal */}
      {selectedEpicId && (
        <EpicDetailsModal
          projectId={projectId}
          epicId={selectedEpicId}
          onClose={() => setSelectedEpicId(null)}
        />
      )}
    </section>
  );
};

export default EpicsPageView;
