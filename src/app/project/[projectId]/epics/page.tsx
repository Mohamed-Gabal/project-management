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

const EpicPage = () => {
  const router = useRouter();

  const params = useParams();
  // const { projectId } = useParams<{ projectId: string }>();

  const projectId = params.projectId as string;
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
      {/* Page Project Header */}
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

      {/* EpicCard Component */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <EpicCard
          epicId="EPIC-102"
          title="Sustainable Materials Integration"
          assigneeName="Alice Moore"
          assigneeInitials="AM"
          createdBy="Sarah Jenkins"
          createdDate="22 Oct 2025"
        />
        <EpicCard
          epicId="EPIC-102"
          title="Sustainable Materials Integration"
          assigneeName="Alice Moore"
          assigneeInitials="AM"
          createdBy="Sarah Jenkins"
          createdDate="22 Oct 2025"
        />
        <EpicCard
          epicId="EPIC-102"
          title="Sustainable Materials Integration"
          assigneeName="Alice Moore"
          assigneeInitials="AM"
          createdBy="Sarah Jenkins"
          createdDate="22 Oct 2025"
        />
        <EpicCard
          epicId="EPIC-102"
          title="Sustainable Materials Integration"
          assigneeName="Alice Moore"
          assigneeInitials="AM"
          createdBy="Sarah Jenkins"
          createdDate="22 Oct 2025"
        />
      </div>

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
